import { Module, Global } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';
import { StripeController } from 'src/app/controller/api/stripe/stripe.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [ConfigModule, StripeModule],
  controllers: [StripeController],
  providers: [StripeService],

  exports: [StripeService],
})
export class StripeModule { }
