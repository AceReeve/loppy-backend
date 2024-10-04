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

export class TwilioCredDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  twilio_account_sid: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  twilio_chat_service_sid: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  twilio_api_key_sid: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  twilio_api_key_secret: string;

  @ApiProperty({ example: '+0000000' })
  @IsString()
  twilio_auth_token: string;

  @ApiProperty({ example: '+18015203693' })
  @IsString()
  twilio_number: string;
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


export class SubscriptionResponseDTO {
  @ApiProperty({
    description: 'Subscription ID`',
  })
  @IsString()
  subscriptionId: string;

  @ApiProperty({
    description: 'Payment Intent Secret`',
  })
  @IsString()
  clientSecret: string;
}


export class UpdateSubscriptionDTO {
  @ApiProperty({
    description: 'Subscription ID`',
  })
  @IsString()
  subscriptionId: string;

  @ApiProperty({
    example: 'essential',
    description:
      'Type of subscription. Can be `essential`, `professional`, or `corporate`',
  })
  @IsString()
  type: 'essential' | 'professional' | 'corporate';
}

export class cancelSubscriptionDTO {
  @ApiProperty({
    description: 'Subscription ID`',
  })
  @IsString()
  subscriptionId: string;

  @ApiProperty({
    example: 'essential',
    description:
      'Type of subscription. Can be `essential`, `professional`, or `corporate`',
  })
  @IsString()
  type: 'essential' | 'professional' | 'corporate';
}

export class TwilioCreateSubAccount {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  name: string;
}



export class CreateBundleDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  friendlyName: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  email: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  isoCountry: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  numberType: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  endUserType: string;
}

export class CreateEndUserDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  friendlyName: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  endUserType: string;
}

export class AddSupportingDocumentsDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  bundleSid: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  registeredAddress: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  documentNumber: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  issuanceDate: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  friendlyName: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  documentType: string;
}

export class PurchaseNumberDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  subAccountSid: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  phoneNumber: string;
}

export class AssignPhoneNumberToSubAccountDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  subAccountSid: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  phoneNumberSid: string;
}

export class AssignToBundleDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  bundleSID: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  documentId: string;
}


export class SubmitBundleDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  bundleSID: string;
}

export class AssignBundleToPhoneNumberDTO {
  @ApiProperty({ example: '0000000' })
  @IsString()
  bundleSID: string;

  @ApiProperty({ example: '0000000' })
  @IsString()
  phoneNumberSID: string;
}

