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
import { IsStringOrArray } from 'src/app/validator/single-array.validator';
export class TagsDTO {
  @ApiProperty({ example: 'ChatGPT Subscription' })
  @IsString()
  @IsNotEmpty()
  tag_name: string;
}
export class ContactsDTO {
  @ApiProperty({ example: 'juan' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'delacruz' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '2406812495' })
  @IsNumber()
  @IsNotEmpty()
  phone_number: number;

  @ApiProperty({ example: 'delacruz' })
  @IsString()
  @IsNotEmpty()
  source: string;

  // @ApiProperty({ example: '2323' })
  // @IsNumber()
  // @IsNotEmpty()
  // lifetime_value: number;

  @ApiProperty({ example: 'delacruz' })
  @IsString()
  @IsNotEmpty()
  last_campaign_ran: string;

  @ApiProperty({ example: '2023-03-19T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  last_interaction: Date;

  @ApiProperty({ type: [TagsDTO] })
  @IsArray()
  @IsOptional()
  tags?: TagsDTO[];
}

export class FilterTags {
  @ApiPropertyOptional({
    example: 'tag1 or ["tag2", "tag3"]',
    description: 'Single or multiple tags for filtering',
    type: 'string',
    isArray: true,
  })
  @IsStringOrArray({
    message: 'tags must be a single string or an array of strings',
  })
  @IsOptional()
  tag?: string | string[];
}
