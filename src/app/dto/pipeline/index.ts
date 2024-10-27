import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePipelineDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Title',
    description: 'Required field when creating a pipeline',
  })
  title: string;
}

export class UpdatePipelineDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '661f82ee17d9f28f4aecb483',
    description: 'Required field when creating a pipeline',
  })
  _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Title',
    description: 'Required field when creating a pipeline',
  })
  title: string;
}
