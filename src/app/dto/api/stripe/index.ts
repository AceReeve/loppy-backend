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

////TWILIO A2P

export class CreateCustomerProfileDTO {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe Starter Customer Profile Bundle' })
  @IsString()
  @IsNotEmpty()
  friendlyName: string;
}

export class CreateEndUserDTO {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '+11234567890' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'Starter Profile End User' })
  @IsString()
  @IsNotEmpty()
  friendlyName: string;
}

export class createAddressDTO {
  @ApiProperty({ example: 'Example City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  isoCountry: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ example: 'CA' })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({ example: '123 Example Street' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Apt B' })
  @IsString()
  @IsNotEmpty()
  streetSecondary: string;
}

export class CreateSupportingDocumentDTO {
  @ApiProperty({ example: 'ADXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' })
  @IsString()
  @IsNotEmpty()
  addressSIDs: string;

  @ApiProperty({ example: 'SP Document Address' })
  @IsString()
  @IsNotEmpty()
  friendlyName: string;
}


export class CreateCustomerProfileEntityAssignmentDTO {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  customerProfileSID: string;

  @ApiProperty({ example: 'SP Document Address' })
  @IsString()
  @IsNotEmpty()
  objectSID: string;
}

export class CreateCustomerProfileEvaluationDTO {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  customerProfileSID: string;

  @ApiProperty({ example: 'SP Document Address' })
  @IsString()
  @IsNotEmpty()
  policySID: string;
}

export class UpdateCustomerProfileDTO {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  customerProfileSID: string;
}

export class CreateTrustProductDTO {
  @ApiProperty({ example: 'johndoe@example.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Doe Starter Customer Profile Bundle' })
  @IsString()
  @IsNotEmpty()
  friendlyName: string;
}

export class CreateEndUserTrustHubDTO {
  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  brandName: string;

  @ApiProperty({ example: 'John Doe Starter Customer Profile Bundle' })
  @IsString()
  @IsNotEmpty()
  vertical: string;

  @ApiProperty({ example: 'John Doe Starter Customer Profile Bundle' })
  @IsString()
  @IsNotEmpty()
  mobilePhoneNumber: string;

  @ApiProperty({ example: 'John Doe Starter Customer Profile Bundle' })
  @IsString()
  @IsNotEmpty()
  friendlyName: string;
}

export class CreateTrustProductEntityAssignmentDTO {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  customerProfileSID: string;

  @ApiProperty({ example: 'ITXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' })
  @IsString()
  @IsNotEmpty()
  endUserSID: string;
}

export class CreateTrustProductEvaluationDTO {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  customerProfileSID: string;
}

export class UpdateTrustProductDTO {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  trustProductSID: string;
}

export class CreateBrandRegistrationDTO {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  a2PProfileBundleSID: string;

  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  customerProfileBundleSID: string;
}

export class FetchBrandRegistrationsDTO {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  brandRegistrationSID: string;
}

export class CreateBrandRegistrationsOTP {
  @ApiProperty({ example: 'BUaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' })
  @IsString()
  @IsNotEmpty()
  brandRegistrationSID: string;
}