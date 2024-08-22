import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class CommonFilter {
  @ApiProperty({
    example: 0,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number;

  @ApiProperty({
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiProperty({
    example: 'asc',
    required: false,
  })
  @IsOptional()
  @Type(() => String)
  @IsString()
  @IsIn(['asc', 'desc'])
  sort_dir?: string;
}

export class CommonDeleteDto {
  @ApiProperty({ example: 'INACTIVE' })
  @IsString()
  @IsNotEmpty()
  status: string;
}
