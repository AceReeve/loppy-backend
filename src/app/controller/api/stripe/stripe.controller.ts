import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { StripeService } from 'src/app/services/api/stripe/stripe.service';
import { StripeDTO } from 'src/app/dto/api/stripe';
@ApiTags('User')
@Controller('payment')
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  @Post('create-charge')
  @ApiOperation({ summary: 'create charge' })
  async createCharge(
    @Body() stripeDTO: StripeDTO
  ) {
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
}
