// src/feedback/feedback.controller.ts
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Create feedback for a user' })
  @ApiResponse({ status: 201, description: 'Feedback created successfully' })
  async createFeedback(
    @Body() dto: CreateFeedbackDto,
    @Req() req: any,
  ) {
    try {
      const reviewerId = req.user.userId;
      return await this.feedbackService.create(
        dto,
        reviewerId,
      );
    } catch (err) {
      console.error('Create Feedback Error:', err);
      throw new HttpException(
        'Something went wrong while creating feedback',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all feedbacks for a user (as reviewee)' })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Returns all feedbacks for the given user',
  })
  async getAllFeedbacks(@Query('userId') userId: string) {
    try {
      return await this.feedbackService.getAllForUser(BigInt(userId));
    } catch (err) {
      console.error('Get Feedbacks Error:', err);
      throw new HttpException(
        'Something went wrong while fetching feedbacks',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
