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

export class UserLoginDTO {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}


export class UserRegisterDTO {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  @Matches(/^\S*$/, {
    message: 'password must not contain space',
  })
  @Matches(/^.*(?=.*[a-z0-9]).*$/, {
    message: 'password is not a valid string',
  })
  @Matches(/^.*(?=.*[a-z]).*$/, {
    message: 'password must contain at least one lowercase letter',
  })
  @Matches(/^.*(?=.*[A-Z]).*$/, {
    message: 'password must contain at least one uppercase letter',
  })
  @Matches(/^.*(?=.*[\d]).*$/, {
    message: 'password must contain at least one number',
  })
  password: string;

  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MaxLength(256, { message: 'First name is too long (maximum 256 characters)' })
  first_name?: string;

  @ApiProperty({ example: 'Dela Cruz' })
  @IsString()
  @MaxLength(256, { message: 'Last First name is too long (maximum 256 characters)' })
  last_name?: string;
}
