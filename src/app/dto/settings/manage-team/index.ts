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

export class InviteMemberDTO {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '665846667b733844b8558372' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: '665846667b733844b8558372' })
  @IsString()
  @IsNotEmpty()
  team: string;
}

export class CustomRoleDTO {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: 'role description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '665846667b733844b8558372' })
  @IsString()
  @IsNotEmpty()
  team: string;
}

export class CreateTeamDTO {
  @ApiProperty({ example: 'BE' })
  @IsString()
  @IsNotEmpty()
  team: string;

  @ApiProperty({ example: 'test' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: ['661f82ee17d9f28f4aecb483', '662e1544f311a6f2ce0cca37'],
    type: [String],
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  team_member?: string[];
}
