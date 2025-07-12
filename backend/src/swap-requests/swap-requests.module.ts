import { Module } from '@nestjs/common';
import { SwapRequestsController } from './swap-requests.controller';
import { SwapRequestsService } from './swap-requests.service';

@Module({
  controllers: [SwapRequestsController],
  providers: [SwapRequestsService]
})
export class SwapRequestsModule {}
