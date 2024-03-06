// payment.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';

@Controller('payment')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-charge')
  async createCharge(
    @Body()
    paymentData: {
      amount: number;
      currency: string;
      source: string;
      description: string;
    },
  ) {
    try {
      const charge = await this.stripeService.createCharge();
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
}
