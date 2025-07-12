import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSwapRequestDto } from './dto/create-swap-request.dto';
import { GetSwapRequestsQueryDto } from './dto/get-requests.dto';
import { SwapStatus } from '@prisma/client';
@Injectable()
export class SwapRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSwapRequest(
    senderId: number,
    dto: CreateSwapRequestDto,
  ) {
    const {
      receiverId,
      senderSkillId,
      receiverSkillId,
      message,
    } = dto;

    try {
      // 1. Validate sender's offered skill
      const senderSkill = await this.prisma.userOfferedSkill.findUnique({
        where: {
          userId_skillId: {
            userId: BigInt(senderId),
            skillId: BigInt(senderSkillId),
          },
        },
      });

      if (!senderSkill) {
        throw new HttpException(
          'Sender does not offer the specified skill.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 2. Validate receiver's wanted skill
      const receiverSkill = await this.prisma.userWantedSkill.findUnique({
        where: {
          userId_skillId: {
            userId: BigInt(receiverId),
            skillId: BigInt(receiverSkillId),
          },
        },
      });

      if (!receiverSkill) {
        throw new HttpException(
          'Receiver does not want the specified skill.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 3. Create swap request
      const swapRequest = await this.prisma.swapRequest.create({
        data: {
          requesterId: BigInt(senderId),
          responderId: BigInt(receiverId),
          requesterSkillId: BigInt(senderSkillId),
          responderSkillId: BigInt(receiverSkillId),
          message,
        },
      });

      return {
        message: 'Swap request sent successfully.',
        swapRequestId: swapRequest.id,
      };
    } catch (error) {
      console.error('Swap creation error:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to create swap request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // swap.service.ts
async getAllSwapRequests(userId: number, query: GetSwapRequestsQueryDto) {
  try {
    const {
      search = '',
      pageNo = '1',
      pageSize = '10',
      sender = true,
    } = query;

    const take = parseInt(pageSize);
    const skip = (parseInt(pageNo) - 1) * take;

    const filterField = sender ? 'requesterId' : 'responderId';

    const whereClause: any = {
      [filterField]: BigInt(userId),
      OR: search
        ? [
            { message: { contains: search, mode: 'insensitive' } },
            { requester: { name: { contains: search, mode: 'insensitive' } } },
            { responder: { name: { contains: search, mode: 'insensitive' } } },
          ]
        : undefined,
    };

    const [requests, totalCount] = await this.prisma.$transaction([
      this.prisma.swapRequest.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          requester: { select: { id: true, name: true, email: true } },
          responder: { select: { id: true, name: true, email: true } },
          requesterSkill: true,
          responderSkill: true,
        },
      }),
      this.prisma.swapRequest.count({ where: whereClause }),
    ]);

    // 🔄 Filter response to only return opposite party details
    const filteredRequests = requests.map((req) => ({
      id: req.id,
      message: req.message,
      status: req.status,
      createdAt: req.createdAt,
      updatedAt: req.updatedAt,
      skillOffered: sender ? req.requesterSkill : req.responderSkill,
      skillRequested: sender ? req.responderSkill : req.requesterSkill,
      user: sender ? req.responder : req.requester, // 👈 Opposite party
    }));

    return {
      data: filteredRequests,
      paginationMeta: {
        totalItems: totalCount,
        currentPage: parseInt(pageNo),
        pageSize: take,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  } catch (error) {
    throw new HttpException(error.message || 'Something went wrong', error.status || 500);
  }
}
async updateSwapStatus(
    userId: number,
    requestId: number,
    status: SwapStatus,
  ) {
    try {
      // 1. Find the request
      const swapRequest = await this.prisma.swapRequest.findUnique({
        where: { id: BigInt(requestId) },
      });

      if (!swapRequest) {
        throw new HttpException('Swap request not found', HttpStatus.NOT_FOUND);
      }

      // 2. Check if user is the responder
      if (swapRequest.responderId.toString() !== userId.toString()) {
        throw new HttpException(
          'You are not authorized to update this request',
          HttpStatus.FORBIDDEN,
        );
      }

      // 3. Update status
      const updatedRequest = await this.prisma.swapRequest.update({
        where: { id: BigInt(requestId) },
        data: {
          status,
        },
      });

      return {
        message: `Swap request ${status} successfully.`,
        data: updatedRequest,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update swap status',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}
