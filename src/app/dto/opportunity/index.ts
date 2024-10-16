import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOpportunityDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Survey Filled Out',
    description: 'Required field when creating a opportunity',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '#0000FF',
    description: 'Required field when creating a opportunity',
  })
  color?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Required field when creating a opportunity',
  })
  lead_value: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a opportunity',
  })
  pipeline_id: string;
}

export class UpdateOpportunitiesDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a opportunity',
  })
  pipeline_id: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Customer Responded',
    description: 'Required field when creating a opportunity',
  })
  pipeline_opportunities: string[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: [],
    description: 'Required field when creating a opportunity',
  })
  updated_items: UpdateOpportunityDTO[];
}

export class UpdateOpportunityDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a opportunity',
  })
  _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Customer Responded',
    description: 'Required field when creating a opportunity',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '#0000FF',
    description: 'Required field when creating a opportunity',
  })
  color?: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Required field when creating a opportunity',
  })
  lead_value: number;
}
