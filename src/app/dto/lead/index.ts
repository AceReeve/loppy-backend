import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { LeadStatus } from 'src/app/const';

export class CreateLeadDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a lead',
  })
  owner_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a lead',
  })
  stage_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a lead',
  })
  pipeline_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a lead',
  })
  primary_contact_name_id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'HVAC Pricing Survey',
    description: 'Required field when creating a lead',
  })
  opportunity_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Facebook Lead',
    description: 'Required field when creating a lead',
  })
  opportunity_source: string;

  @IsEnum(LeadStatus)
  @IsOptional()
  @ApiProperty({
    example: 'In Progress',
    description: 'Required field when creating a lead',
  })
  status: LeadStatus;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1800,
    description: 'Required field when creating a lead',
  })
  opportunity_value: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'name@example.com',
    description: 'Required field when creating a lead',
  })
  primary_email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Required field when creating a lead',
  })
  primary_phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Required field when creating a lead',
  })
  additional_contacts: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Required field when creating a lead',
  })
  followers: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Required field when creating a lead',
  })
  business_name: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    example: '',
    description: 'Required field when creating a lead',
  })
  tags: string[];
}
