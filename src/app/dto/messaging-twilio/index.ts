import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class EmailRole {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'role_id' })
  @IsNotEmpty()
  role: string;
}
export class OrganizationDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ServiceHero',
    description: 'Required field when creating a organization',
  })
  organization_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Description here',
    description: 'Required field when creating a organization',
  })
  description: string;

  @ApiProperty({
    type: [EmailRole],
    example: [
      { email: 'example@gmail.com', role: 'Manager' },
      { email: 'example1@gmail.com', role: 'Member' },
    ],
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EmailRole)
  users: EmailRole[];
}

export class InboxesDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'ServiceHero',
    description: 'Required field when creating Inbox',
  })
  inbox_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Description here',
    description: 'Required field when creating Inbox',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'organization_id',
    description: 'Required field when creating Inbox',
  })
  organization_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '+18015203693',
    description: 'Required field when creating Inbox',
  })
  purchased_number: string;
}

class MemberDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user_id',
    description: 'User ID to be added to the organization',
  })
  user_id: string;
}

export class AddMemberDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MemberDTO)
  @ApiProperty({
    type: [MemberDTO],
    description: 'Array of members to be added to the organization',
  })
  members: MemberDTO[];
}
