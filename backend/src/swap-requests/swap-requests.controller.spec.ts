import { Test, TestingModule } from '@nestjs/testing';
import { SwapRequestsController } from './swap-requests.controller';

describe('SwapRequestsController', () => {
  let controller: SwapRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwapRequestsController],
    }).compile();

    controller = module.get<SwapRequestsController>(SwapRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
