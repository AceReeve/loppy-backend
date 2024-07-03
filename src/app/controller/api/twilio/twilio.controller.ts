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

  @Post(
    'twilio-credentials/:twilio_account_sid/:twilio_chat_service_sid/:twilio_api_key_sid/:twilio_api_key_secret/:twilio_auth_token/:twilio_number',
  )
  async twilioCredentials(
    @Param('twilio_account_sid') twilio_account_sid: string,
    @Param('twilio_chat_service_sid') twilio_chat_service_sid: string,
    @Param('twilio_api_key_sid') twilio_api_key_sid: string,
    @Param('twilio_api_key_secret') twilio_api_key_secret: string,
    @Param('twilio_auth_token') twilio_auth_token: string,
    @Param('twilio_number') twilio_number: string,
  ) {
    return this.twilioService.twilioCredentials(
      twilio_account_sid,
      twilio_chat_service_sid,
      twilio_api_key_sid,
      twilio_api_key_secret,
      twilio_auth_token,
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
