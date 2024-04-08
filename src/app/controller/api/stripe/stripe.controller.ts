import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards, Req, BadRequestException, Headers, RawBodyRequest, Res } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';
import { StripeDTO, StripePaymentIntentDTO, SummarizePaymentDTO } from 'src/app/dto/api/stripe';
import RequestWithRawBody from 'src/app/interface/stripe/requestWithRawBody.interface';
import Stripe from 'stripe';
import { StripeWebhookService } from 'src/app/services/api/stripe/stripe.webhook.service';
import { JwtAuthGuard } from 'src/app/guard/auth';
import { Response, response } from 'express';

@ApiTags('Payment')
@Controller('payment')
export class StripeController {
  constructor(private readonly stripeService: StripeService,
    private stripeWebhookService: StripeWebhookService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  @Post('create-charge')
  @ApiOperation({ summary: 'create charge' })
  async createCharge(
    @Req() request,
    @Body() stripeDTO: StripeDTO
  ) {
    try {
      const userId = request.user.sub;
      console.log('userId from controller', userId);
      const charge = await this.stripeService.createCharge({
        ...stripeDTO,
        metadata: { userId: userId.toString() },
      });
      console.log('charge1231', charge)
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Bearer')
  @Post('create-payment-intent')
  @ApiOperation({ summary: 'create payment intent' })
  async createPaymentIntent(
    @Req() request,
    @Body() stripeDTO: StripePaymentIntentDTO) {
    try {
      const userId = request.user.sub;
      const paymentIntent = await this.stripeService.createPaymentIntent(
        stripeDTO,
        userId,
      );

      return {
        success: true,
        paymentIntent
      };
    }
    catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiBearerAuth('Bearer')
  @Post('summarize-payment')
  @ApiOperation({ summary: 'summarize payment using confirmation token' })
  async summarizePayment(@Body() summarizePaymentDTO: SummarizePaymentDTO) {
    return await this.stripeService.summarizePayment(summarizePaymentDTO);
  }


  @Post('webhook')
  async handleIncomingEvents(
    @Headers('stripe-signature') signature: string,
    @Req() request: RequestWithRawBody,
    @Res() response: Response
  ) {

    try {
      if (!signature) {
        throw new BadRequestException('Missing stripe-signature header');
      }
      const stripeEvent = this.stripeService.constructEventFromPayload(signature, request.rawBody);

      if (stripeEvent.type === 'payment_intent.succeeded') {
        const stripePayment = stripeEvent.data.object;
        const userId = stripePayment.metadata.userId;
        return this.stripeWebhookService.processSubscriptionUpdate(stripeEvent, userId);
      }
      return response.status(200).end();

    } catch (error) {
      console.log("Error", error)
    }
  }

}
