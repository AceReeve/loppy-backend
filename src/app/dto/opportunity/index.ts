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
    example: 'Title',
    description: 'Required field when creating a opportunity',
  })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Required field when creating a opportunity',
  })
  itemOrder: number;

  @ApiProperty({
    example: ['661f82ee17d9f28f4aecb483', '662e1544f311a6f2ce0cca37'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  leads?: string[];
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
    example: 'Title',
    description: 'Required field when creating a opportunity',
  })
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Required field when creating a opportunity',
  })
  itemOrder: number;

  @ApiProperty({
    example: ['661f82ee17d9f28f4aecb483', '662e1544f311a6f2ce0cca37'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  leads?: string[];
}
