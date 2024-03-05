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
export class UserInfoDTO {
  @ApiProperty({ example: 'JuanDelacuz' })
  @IsString()
  @MaxLength(256, { message: 'User name is too long (maximum 256 characters)' })
  username: string;

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

  @ApiProperty({ example: 'address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2009 })
  zipCode: number;

  @ApiProperty({ example: 'city' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'state' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 19123456789 })
  contact_no: number;

  @ApiProperty({ example: 'Male' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2021-01-01' })
  birthday: Date;

  @ApiProperty({ example: 'CEO Service Hero' })
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UserRegisterDTO {

  @ApiProperty({ example: '63dcd70658eb9ca6a922df41' })
  @IsOptional()
  _id?: string;

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

  @ApiProperty({ example: '63dcd70658eb9ca6a922df41' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({ type: () => UserInfoDTO })
  @ValidateNested()
  @IsOptional()
  user_information?: UserInfoDTO;
}
