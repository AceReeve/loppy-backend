import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WorkFlowStatus } from 'src/app/const/action';

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
  @IsOptional()
  @ValidateNested()
  @Type(() => TriggerWorkFlow)
  @ApiProperty({
    type: TriggerWorkFlow,
    description: 'Trigger',
    example: {
      id: '1',
      trigger_name: 'Birthday Reminder',
      content: '[]',
    },
  })
  trigger?: TriggerWorkFlow;

  @IsOptional()
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
  action?: ActionWorkFlow;
}

export class UpdateWorkflowDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'WorkFlow Name',
    example: 'Birthday Reminder WorkFlow',
  })
  workflow_name: string;

  @IsNotEmpty()
  @IsIn([WorkFlowStatus.PUBLISHED, WorkFlowStatus.SAVED])
  @ApiProperty({
    description: 'Status[Publised, Saved]',
    example: 'Saved',
  })
  status: string;

  @IsOptional()
  @ApiProperty({
    description: 'Work Flow ID optional',
    example: '12312541251561',
  })
  folder_id?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TriggerWorkFlow)
  @ApiProperty({
    type: TriggerWorkFlow,
    description: 'Trigger',
    example: {
      id: '1',
      trigger_name: 'Birthday Reminder',
      content: '[]',
    },
  })
  trigger: TriggerWorkFlow;

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
