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
  Validate,
} from 'class-validator';
import { ObjectId, Schema } from 'mongoose';
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
export class GoogleSaveDTO {
  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  picture: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  token: string;
}
export class UserInfoDTO {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MaxLength(256, {
    message: 'First name is too long (maximum 256 characters)',
  })
  first_name: string;
  @ApiProperty({ example: 'Dela Cruz' })
  @IsString()
  @MaxLength(256, {
    message: 'Last First name is too long (maximum 256 characters)',
  })
  last_name: string;
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 19123456789 })
  contact_no: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ example: '2021-01-01' })
  birthday: Date;

  @ApiProperty({ example: 'Male' })
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty({ example: 'service hero' })
  @IsString()
  @IsOptional()
  company: string;

  // address optional
  @ApiProperty({ example: 'address' })
  @IsString()
  @IsOptional()
  address: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2009 })
  zipCode: number;

  @ApiProperty({ example: 'city' })
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({ example: 'state' })
  @IsString()
  @IsOptional()
  state: string;
}

export class UserRegisterDTO {
  // @ApiProperty({ example: 'Juan' })
  // @IsString()
  // @MaxLength(256, {
  //   message: 'First name is too long (maximum 256 characters)',
  // })
  // first_name: string;

  // @ApiProperty({ example: 'Dela Cruz' })
  // @IsString()
  // @MaxLength(256, {
  //   message: 'Last First name is too long (maximum 256 characters)',
  // })
  // last_name: string;

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

  // @ApiProperty({ example: 'Password123!' })
  // @IsString()
  // @IsNotEmpty()
  // confirm_password: string;
}

// export class InviteUserDTO {
//   @ApiProperty({ example: ['example@gmail.com', 'example1@gmail.com'] })
//   @IsString({ each: true })
//   @IsNotEmpty()
//   @IsEmail({}, { each: true })
//   email: string[];
// }
class EmailRole {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'role' })
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'team_id' })
  @IsOptional()
  team?: ObjectId;
}

export class InviteUserDTO {
  @ApiProperty({
    type: [EmailRole],
    example: [
      { email: 'example@gmail.com', role: 'Manager', team: 'FrontEnd Team' },
      { email: 'example1@gmail.com', role: 'Member', team: 'BackEnd Team ' },
    ],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EmailRole)
  users: EmailRole[];
}
export class ResetPasswordDto {
  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @IsNotEmpty()
  current_password: string;

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
  new_password: string;
}

export class CreatePasswordDto {
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
}

export class InvitedUserRegistrationDTO {
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

  // @ApiProperty({ example: 'Password123!' })
  // @IsString()
  // @IsNotEmpty()
  // confirm_password: string;
}

export class ProfileImageType {
  @ApiProperty({
    example: 'image_1',
    required: true,
  })
  @IsString()
  type: any;
}
