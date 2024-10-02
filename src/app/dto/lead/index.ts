import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLeadDTO {
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

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Required field when creating a lead',
  })
  itemOrder: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 1,
    description: 'Required field when creating a lead',
  })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a lead',
  })
  opportunity_id: string;
}
