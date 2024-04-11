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

@ApiTags('Messages')
@Controller('messages')
@ApiBearerAuth('Bearer')
export class TwilioController {
  constructor(private twilioService: TwilioService) {}
  @Post('twilio-credentials/:ssid/:auth_token/:twilio_number')
  async twilioCredentials(
    @Param('ssid') ssid: string,
    @Param('auth_token') auth_token: string,
    @Param('twilio_number') twilio_number: string,
  ) {
    return this.twilioService.twilioCredentials(
      ssid,
      auth_token,
      twilio_number,
    );
  }

  @Post()
  async sendMessage(@Body() messageDTO: MessageDTO) {
    return this.twilioService.sendMessage(messageDTO);
  }

  @Get('messageStatus/:sId')
  async getMessageStatus(@Param('sId') sId: string) {
    return this.twilioService.getMessageStatus(sId);
  }

  @Get('get-all')
  async getAllMessages() {
    return this.twilioService.getAllMessages();
  }
  @Get('get-all-contacts')
  async getAllContacts() {
    return this.twilioService.getAllContacts();
  }

  @Get('get-twilio-access-token')
  async getTwilioAccessToken() {
    return this.twilioService.getTwilioAccessToken();
  }
}
