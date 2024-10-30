import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLeadTriggerDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Opportunity status changed',
    description: 'Required field when creating a lead',
  })
  trigger_type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Opportunity Status Changed',
    description: 'Required field when creating a lead',
  })
  trigger_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Assigned to',
    description: 'Required field when creating a lead',
  })
  filter_type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a lead',
  })
  filter_value: string;
}
