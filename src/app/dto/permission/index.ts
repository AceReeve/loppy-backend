import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDTO {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '63e0c8adc281aad34e36f630',
    description:
      '(Optional) This will be used when creating role with permission',
  })
  role_id?: string;

  @IsArray()
  @ApiPropertyOptional({
    example: ['CREATE', 'READ'],
    description:
      '(Optional) This will be used when creating role while also defining its permission',
  })
  action: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '63e0c8adc281aad34e36f631',
    description: '(Optional) This is the mongo id of a module',
  })
  module_id: string;
}
export class UpdatePermissionDTO {
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional({
    example: ['CREATE', 'READ'],
    description: '(Optional) field when updating a permission action',
  })
  action: string[];

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  module_id: string;
}
