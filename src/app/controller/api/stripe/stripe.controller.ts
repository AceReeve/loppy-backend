import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller, Post, Body } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';

@ApiTags('Stripe')
@Controller('stripe')
@ApiBearerAuth()
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('charge')
  async charge(@Body() amount: number, currency: string, source: string) {
    return this.stripeService.charge(amount, currency, source);
  }
}
