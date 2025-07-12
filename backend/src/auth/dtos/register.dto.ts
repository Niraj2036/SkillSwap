import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayMinSize,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsNotEmpty()
  @IsString()
  profilePic: string;

  @ApiProperty({ example: '+911234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Pune, India', required: false })
  @IsOptional()
  @IsString()
  location?: string;


  @ApiProperty({  required: true})
  @IsString()
  password?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsOptional()
  @IsString()
  profilePhoto?: string;

  @ApiProperty({
    example: ['Weekends', 'Evenings'],
    description: 'Array of available time slots',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  availability: string[];

  @ApiProperty({
    example: ['Photoshop', 'Video Editing'],
    description: 'Skills the user is offering',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  offeredSkills: string[];

  @ApiProperty({
    example: ['Excel', 'Public Speaking'],
    description: 'Skills the user wants to learn',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  wantedSkills: string[];
}
