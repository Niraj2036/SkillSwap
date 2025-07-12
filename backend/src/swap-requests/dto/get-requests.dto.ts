// dto/get-swap-requests-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsNumberString } from 'class-validator';

export class GetSwapRequestsQueryDto {
  @ApiPropertyOptional({ description: 'Search keyword for requester/responder name or message' })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Current page number', example: 1 })
  @IsOptional()
  @IsNumberString()
  pageNo?: string;

  @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
  @IsOptional()
  @IsNumberString()
  pageSize?: string;

  @ApiPropertyOptional({ description: 'Whether to fetch sent (true) or received (false) requests', example: true })
  @IsOptional()
  @IsBoolean()
  sender?: boolean;
}
