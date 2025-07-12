import { Test, TestingModule } from '@nestjs/testing';
import { SwapRequestsService } from './swap-requests.service';

describe('SwapRequestsService', () => {
  let service: SwapRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwapRequestsService],
    }).compile();

    service = module.get<SwapRequestsService>(SwapRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
