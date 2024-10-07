import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LeadStatus } from 'src/app/const';

export class CreateLeadDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Master',
    description: 'Required field when creating a lead',
  })
  master: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Description',
    description: 'Required field when creating a lead',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Category',
    description: 'Required field when creating a lead',
  })
  category: string;

  @IsEnum(LeadStatus)
  @IsNotEmpty()
  @ApiProperty({
    example: 'In Progress',
    description: 'Required field when creating a lead',
  })
  status: LeadStatus;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Required field when creating a lead',
  })
  amount: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a lead',
  })
  opportunity_id: string;
}
