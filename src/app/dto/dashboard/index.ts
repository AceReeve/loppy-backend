import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsAlphanumeric,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Schema } from 'mongoose';
import { CommonFilter } from '..';

export class DashBoardDTO {
    @ApiProperty({ example: 'Juan' })
    @IsString()
    @MaxLength(256, { message: 'First name is too long (maximum 256 characters)' })
    first_name: string;
  
    @ApiProperty({ example: 'Omega' })
    @IsString()
    @IsOptional()
    @MaxLength(256, { message: 'Middle name is too long (maximum 256 characters)' })
    middle_name?: string;
  
    @ApiProperty({ example: 'Dela Cruz' })
    @IsString()
    @MaxLength(256, { message: 'Last First name is too long (maximum 256 characters)' })
    last_name?: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ example: '2021-01-01' })
    date: Date;
  
    @ApiProperty({ example: 'Google' })
    @IsString()
    source?: string;

    @ApiProperty({ example: 'phone_call' })
    @IsString()
    lead_type?: string;

    @ApiProperty({ example: 123123253426 })
    @IsString()
    call_duration?: string ;

    @ApiProperty({ example: '0' })
    @IsString()
    ltv?: string;

    @ApiProperty({ example: 'No' })
    @IsString()
    existing_customer?: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ example: '2021-01-01' })
    created_at: Date;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ example: '2021-01-01' })
    updated_at: Date;

}



