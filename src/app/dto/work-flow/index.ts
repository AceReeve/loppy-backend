import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TriggerWorkFlow {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'Required field when creating a Work Flow',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  trigger_name: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  content?: [];
}
export class ActionWorkFlow {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '1',
    description: 'Required field when creating a Work Flow',
  })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  action_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Happy Birthday',
    description: 'Content of the action',
  })
  content: string;
}

export class CreateWorkflowDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TriggerWorkFlow)
  @ApiProperty({
    type: TriggerWorkFlow,
    description: 'Trigger',
    example: {
      id: '1',
      trigger_name: 'Birthday Reminder',
      content: 'Some trigger content here',
    },
  })
  triger: TriggerWorkFlow;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ActionWorkFlow)
  @ApiProperty({
    type: ActionWorkFlow,
    description: 'Action',
    example: {
      id: '1',
      action_name: 'Send Email',
      content: 'Happy Birthday! Wishing you all the best on your special day.',
    },
  })
  action: ActionWorkFlow;
}
