import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';
import {
  StripeDTO,
  StripePaymentIntentDTO,
  SummarizePaymentDTO,
} from 'src/app/dto/api/stripe';
@ApiTags('Payment')
@Controller('payment')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @ApiBearerAuth('Bearer')
  @Post('create-charge')
  @ApiOperation({ summary: 'create charge' })
  async createCharge(@Body() stripeDTO: StripeDTO) {
    try {
      const charge = await this.stripeService.createCharge(stripeDTO);
      return {
        success: true,
        charge,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiBearerAuth('Bearer')
  @Post('create-payment-intent')
  @ApiOperation({ summary: 'create payment intent' })
  async createPaymentIntent(@Body() stripeDTO: StripePaymentIntentDTO) {
    return await this.stripeService.createPaymentIntent(stripeDTO);
  }

  @ApiBearerAuth('Bearer')
  @Post('summarize-payment')
  @ApiOperation({ summary: 'summarize payment using confirmation token' })
  async summarizePayment(@Body() summarizePaymentDTO: SummarizePaymentDTO) {
    return await this.stripeService.summarizePayment(summarizePaymentDTO);
  }
}
