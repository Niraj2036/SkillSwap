import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSwapRequestDto {
  @ApiProperty({ example: 2, description: 'Receiver user ID' })
  @IsNumber()
  receiverId: number;

  @ApiProperty({ example: 3, description: 'Sender\'s skill ID' })
  @IsNumber()
  senderSkillId: number;

  @ApiProperty({ example: 5, description: 'Receiver\'s skill ID' })
  @IsNumber()
  receiverSkillId: number;

  @ApiProperty({ example: 'Hey, I would like to exchange these skills!', description: 'Message with the swap request' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
