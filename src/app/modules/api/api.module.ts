import { Module } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';
import { StripeController } from 'src/app/controller/api/stripe/stripe.controller';

@Module({
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
