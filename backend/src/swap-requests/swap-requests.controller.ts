// swap.controller.ts
import { Controller, Get, Query, Req, HttpException, HttpStatus ,Post,Body,Patch} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse,ApiBody } from '@nestjs/swagger';
import { SwapRequestsService } from './swap-requests.service';
import { GetSwapRequestsQueryDto } from './dto/get-requests.dto';
import { CreateSwapRequestDto } from './dto/create-swap-request.dto';


@ApiTags('Swap Requests')
@Controller('swap-requests')
export class SwapRequestsController {
  constructor(private readonly swapService: SwapRequestsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all swap requests for the user' })
  @ApiQuery({ name: 'search', required: false, description: 'Search keyword' })
  @ApiQuery({ name: 'pageNo', required: false, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Page size' })
  @ApiQuery({ name: 'sender', required: false, description: 'True for sent requests, false for received' })
  @ApiResponse({ status: 200, description: 'List of swap requests with pagination' })
  async getSwapRequests(@Query() query: GetSwapRequestsQueryDto, @Req() req: any) {
    try {
      const userId = req.user.userId; // Comes from auth middleware
      return await this.swapService.getAllSwapRequests(userId, query);
    } catch (error) {
      console.error('Error fetching swap requests:', error);
      throw new HttpException('Failed to fetch swap requests', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Post()
  @ApiOperation({ summary: 'Create a new swap request' })
  @ApiBody({ type: CreateSwapRequestDto })
  @ApiResponse({ status: 201, description: 'Swap request created successfully' })
  @ApiResponse({ status: 400, description: 'Validation or logical error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createSwapRequest(@Req() req, @Body() dto: CreateSwapRequestDto) {
    try {
      const senderId = req.user.userId;
      const result = await this.swapService.createSwapRequest(senderId, dto);

      return {
        message: 'Swap request created successfully',
        data: result,
      };
    } catch (error) {
      console.error('Create swap error:', error);
      throw new HttpException(
        error.message || 'Failed to create swap request',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Patch('status')
  @ApiOperation({ summary: 'Update status of a swap request' })
  @ApiBody({
    schema: {
      example: {
        requestId: 12,
        status: 'accepted',
      },
    },
  })
  async updateSwapStatus(@Body() body: any, @Req() req: any) {
    try {
      const { requestId, status } = body;
      const userId = req.user.userId;

      if (!requestId || !status) {
        throw new HttpException('Missing requestId or status', HttpStatus.BAD_REQUEST);
      }

      return await this.swapService.updateSwapStatus(userId, requestId, status);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update status',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
