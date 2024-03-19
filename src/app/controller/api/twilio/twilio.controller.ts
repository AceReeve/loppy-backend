import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { TwilioService } from 'src/app/services/api/twilio/twilio.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MessageDTO } from 'src/app/dto/api/stripe';
import { JwtAuthGuard } from 'src/app/guard/auth';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class TwilioController {
  constructor(private twilioService: TwilioService) { }

  @Post()
  @ApiBearerAuth('Bearer')
  async sendMessage(
    @Body() messageDTO: MessageDTO
  ) {
    return this.twilioService.sendMessage(messageDTO);
  }

  @Get('messageStatus/:sId')
  @ApiBearerAuth('Bearer')
  async getMessageStatus(
    @Param('sId') sId: string
  ) {
    return this.twilioService.getMessageStatus(sId);
  }

  @Get('get-all')
  @ApiBearerAuth('Bearer')
  async getAllMessages() {
    return this.twilioService.getAllMessages();
  }
}
