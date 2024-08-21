import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiQueryOptions,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards, Req, BadRequestException, Headers, RawBodyRequest, Res, Get, Query } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';
import {
  cancelSubscriptionDTO,
  StripeDTO,
  StripePaymentIntentDTO,
  SummarizePaymentDTO,
  UpdateSubscriptionDTO,
} from 'src/app/dto/api/stripe';
import RequestWithRawBody from 'src/app/interface/stripe/requestWithRawBody.interface';
import Stripe from 'stripe';
import { StripeWebhookService } from 'src/app/services/api/stripe/stripe.webhook.service';
import { JwtAuthGuard } from 'src/app/guard/auth';
import { Response, response } from 'express';
import { Public } from 'src/app/decorators/public.decorator';
import { Query as ExpressQuery } from 'express-serve-static-core';

@ApiTags('Payment')
@Controller('payment')
export class StripeController {
  private stripeEventTypes: string[] =
    [
      "payment_intent.succeeded",
      "payment_intent.processing",
      "payment_intent.payment_failed"
    ]

  constructor(private readonly stripeService: StripeService,
    private stripeWebhookService: StripeWebhookService) { }


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
        message: error,
      };
    }
  }


  @ApiBearerAuth('Bearer')
  @Post('create-subscription')
  @ApiOperation({ summary: 'create subscription' })
  async createSubscription(
    @Req() request,
    @Body() stripeDTO: StripePaymentIntentDTO) {
    try {
      const userId = request.user.sub;
      console.log("12312321312", userId)
      const subscription = await this.stripeService.createSubscription(
        stripeDTO,
        userId,
      );
      return {
        success: true,
        subscription
      };
    }
    catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  @Public()
  @Post('summarize-payment')
  @ApiOperation({ summary: 'summarize payment using confirmation token' })
  async summarizePayment(@Body() summarizePaymentDTO: SummarizePaymentDTO) {
    return await this.stripeService.summarizePayment(summarizePaymentDTO);
  }

  @ApiBearerAuth('Bearer')
  @Get('payment-status')
  @ApiOperation({ summary: 'summarize payment using confirmation token' })
  async getPaymentStatus(@Req() request) {
    const userId = request.user.sub;
    return await this.stripeWebhookService.getUserStripeData(userId);
  }

  @ApiBearerAuth('Bearer')
  @Get('subscription-status')
  @ApiOperation({ summary: 'subscription status' })
  @ApiQuery({
    name: 'customerId',
    required: false,
    default: 1,
  } as ApiQueryOptions)
  async getCustomerSubscription(@Query() request: ExpressQuery) {
    return await this.stripeService.customerSubscriptions(request);
  }


  @ApiBearerAuth('Bearer')
  @Post('update-subscription')
  @ApiOperation({ summary: 'update subscription' })
  async updateSubscription(
    @Req() request,
    @Body() stripeDTO: UpdateSubscriptionDTO) {
    try {
      const userId = request.user.sub;
      const subscription = await this.stripeService.updateSubscription(
        stripeDTO,
        userId,
      );
      return {
        success: true,
        subscription
      };
    }
    catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }


  @ApiBearerAuth('Bearer')
  @Post('cancel-subscription')
  @ApiOperation({ summary: 'cancel subscription' })
  async cancelSubscription(
    @Req() request,
    @Body() stripeDTO: cancelSubscriptionDTO) {
    try {
      const userId = request.user.sub;
      const subscription = await this.stripeService.cancelSubscription(
        stripeDTO,
        userId,
      );
      return {
        success: true,
        subscription
      };
    }
    catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }


  @Public()
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


      // if (this.stripeEventTypes.includes(stripeEvent.type)) {
      //   const stripePayment = stripeEvent.data.object as Stripe.PaymentIntent;
      //   const userId = stripePayment.metadata.userId;
      //   await this.stripeWebhookService.processSubscriptionUpdate(stripeEvent, userId);
      // }

      // switch (stripeEvent.type) { 
      //   case 'checkout.session.completed': { }
      //   case 'customer.subscription.deleted': { }
      // }

      return response.status(201).json({ received: true }).end();
    } catch (error) {
      console.log("Error", error)
    }
  }

}
