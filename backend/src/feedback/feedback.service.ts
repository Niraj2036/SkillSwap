// src/feedback/feedback.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto,reviewerId:number) {
    try {
      return await this.prisma.swapFeedback.create({
        data: {
          reviewerId: BigInt(reviewerId),
          revieweeId: BigInt(dto.revieweeId),
          rating: dto.rating,
          feedback:dto.feedback
        },
      });
    } catch (err) {
      console.error('Create Feedback Error:', err);
      throw new InternalServerErrorException('Failed to create feedback');
    }
  }

  async getAllForUser(userId: bigint) {
    try {
      const feedbacks = await this.prisma.swapFeedback.findMany({
        where: {
          revieweeId: userId,
        },
        include: {
          reviewer: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return feedbacks.map((fb) => ({
        ...fb,
        id: fb.id.toString(),
        reviewerId: fb.reviewerId.toString(),
        revieweeId: fb.revieweeId.toString(),
      }));
    } catch (err) {
      console.error('Get Feedbacks Error:', err);
      throw new InternalServerErrorException('Failed to fetch feedbacks');
    }
  }
}
