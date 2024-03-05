import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateRoleDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Admin',
    description: 'Required field when creating a role',
  })
  role_name: string;
}
