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
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  node_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Birthday Reminder',
  })
  node_type_id?: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  content?: {};
}
export class ActionWorkFlow {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  node_name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  node_type_id: string;

  @IsNotEmpty()
  @ApiProperty({
    example: 'Birthday Reminder',
    description: 'Required field when creating a Work Flow',
  })
  content?: { [key: string]: any };
}

export class CreateWorkflowDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => TriggerWorkFlow)
  @ApiProperty({
    type: TriggerWorkFlow,
    description: 'Trigger',
    example: {
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
      title: 'Send Email',
      node_name: 'Send Email',
      node_type_id: 'Send Email',
      content:
        '{ "subject": "Happy Birthday" , "message": "Happy birthday to you",}',
    },
  })
  action?: ActionWorkFlow;
}

export class UpdateWorkflowDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TriggerWorkFlow)
  @ApiProperty({
    type: TriggerWorkFlow,
    description: 'Trigger',
    example: {
      title: 'Birthday!',
      node_name: 'Birthday Reminder',
      node_type_id: 'Birthday Reminder',
      content: '{}',
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
      title: 'Send Email',
      node_name: 'Send Email',
      node_type_id: 'Send Email',
      content: {
        subject: 'Happy Birthday',
        message: 'Happy birthday to you',
      },
    },
  })
  action: ActionWorkFlow;
}

export class SmsDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'number',
    example: '097654156958',
  })
  to: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Message',
    example: 'Hi',
  })
  message: string;
}
