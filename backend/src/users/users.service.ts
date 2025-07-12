import { Injectable,HttpException,HttpStatus } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/utils/hash.util';

@Injectable()
export class UsersService {
    constructor(private readonly prisma:PrismaService){}
    // src/user/user.service.ts
async updateUser(userId: number, dto: UpdateUserDto) {
  const {
    name,
    profilePic,
    phone,
    location,
    profilePhoto,
    availability,
    offeredSkills = [],
    wantedSkills = [],
    password,
  } = dto;

  try {
    return await this.prisma.$transaction(async (tx) => {
      // Step 1: Hash new password (if updating)
      let hashedPassword: string | undefined = undefined;
      if (password) {
        hashedPassword = await hashPassword(password);
      }

      // Step 2: Update user info
      await tx.user.update({
        where: { id: userId },
        data: {
          name,
          profilePic,
          phone,
          location,
          profilePhoto,
          availability,
          ...(hashedPassword && { password: hashedPassword }),
        },
      });

      // Step 3: Manage skills (if provided)
      const getSkillIds = async (skills: string[]) => {
        const skillRecords = await Promise.all(
          skills.map(async (skillName) => {
            const existing = await tx.skill.findUnique({ where: { name: skillName } });
            if (existing) return existing;
            return tx.skill.create({ data: { name: skillName } });
          }),
        );
        return skillRecords.map((s) => s.id);
      };

      if (offeredSkills.length > 0) {
        const offeredIds = await getSkillIds(offeredSkills);
        await tx.userOfferedSkill.deleteMany({ where: { userId } });
        await tx.userOfferedSkill.createMany({
          data: offeredIds.map((skillId) => ({ userId, skillId })),
        });
      }

      if (wantedSkills.length > 0) {
        const wantedIds = await getSkillIds(wantedSkills);
        await tx.userWantedSkill.deleteMany({ where: { userId } });
        await tx.userWantedSkill.createMany({
          data: wantedIds.map((skillId) => ({ userId, skillId })),
        });
      }

      return { message: 'User updated successfully' };
    });
  } catch (error) {
    console.error('Update user error:', error);
    throw new HttpException(
      error.message || 'Failed to update user',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

// src/user/user.service.ts
async getAllUsers({
  currentUserId,
  availability,
  search,
  page,
  limit,
}: {
  currentUserId: bigint;
  availability?: string | string[];
  search?: string;
  page: number;
  limit: number;
}) {
  try {
    const whereClause: any = {
      id: { not: currentUserId },
      isPublic: true,
    };

    // Name search (case-insensitive partial match)
    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    // Availability filter (intersection check)
    if (availability) {
      const availArray = Array.isArray(availability) ? availability : [availability];
      whereClause.availability = { hasSome: availArray };
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        offeredSkills: { include: { skill: true } },
        wantedSkills: { include: { skill: true } },
        receivedFeedback: true,
      },
    });

    // Format user data
    return users.map((user) => {
      const averageRating =
        user.receivedFeedback.length > 0
          ? (
              user.receivedFeedback.reduce((sum, f) => sum + f.rating, 0) /
              user.receivedFeedback.length
            ).toFixed(1)
          : null;

      return {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        phone: user.phone,
        location: user.location,
        profilePhoto: user.profilePhoto,
        availability: user.availability,
        createdAt: user.createdAt,
        averageRating,
        offeredSkills: user.offeredSkills.map((os) => os.skill.name),
        wantedSkills: user.wantedSkills.map((ws) => ws.skill.name),
      };
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    throw new HttpException(
      error.message || 'Failed to retrieve users',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
async getme(userId){
    try{
        const user=await this.prisma.user.findUnique({
            where:{
                id:userId
            },
            include:{
                wantedSkills:true,
                offeredSkills:true
            }
        })
    }catch(error){
    throw new HttpException(
      error.message || 'Failed to retrieve users',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
}
}
}
