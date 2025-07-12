// src/user/user.controller.ts
import {
  Controller,
  Put,
  Req,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Get,Query

} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,ApiQuery
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Put('update')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUser(@Body() dto: UpdateUserDto, @Req() req) {
    try {
      const userId = req.user.userId;
      return await this.userService.updateUser(userId, dto);
    } catch (err) {
      console.error('UpdateUserControllerError:', err);
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}
@Get('me')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Fetched user successfully' })
  async getme( @Req() req) {
    try {
      const userId = req.user.userId;
      return await this.userService.getme(userId);
    } catch (err) {
      console.error('UpdateUserControllerError:', err);
      throw new HttpException(
        'Failed to get user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
}
  
}
