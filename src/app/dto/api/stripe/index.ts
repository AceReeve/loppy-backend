import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
} from 'class-validator';

export class StripeDTO {
  @ApiProperty({ example: '2000' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'usd' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'tok_visa' })
  @IsString()
  source?: string;

  @ApiProperty({ example: 'description' })
  @IsString()
  description?: string;
  metadata?: { [key: string]: string };
}

export class MessageDTO {
  @ApiProperty({ example: '+18015203693' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'hello' })
  @IsString()
  body: string;
}


export class StripePaymentIntentDTO {
    @ApiProperty({
        example: 'essential',
        description:
            'Type of subscription. Can be `essential`, `professional`, or `corporate`',
    })
    @IsString()
    type: 'essential' | 'professional' | 'corporate';

    @ApiProperty({
        description: 'Confirmation token sent from the client`',
    })
    @IsString()
    confirmationToken: string;

    metadata?: { [key: string]: string };
}


export class SummarizePaymentDTO {
    @ApiProperty({
        description: 'Confirmation token sent from the client`',
    })
    @IsString()
    confirmationToken: string;
}



