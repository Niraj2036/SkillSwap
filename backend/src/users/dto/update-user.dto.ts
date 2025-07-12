// src/user/dto/update-user.dto.ts
import { IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profilePic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  availability?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  offeredSkills?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  wantedSkills?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;
}
