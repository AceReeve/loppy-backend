import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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
export class TwilioController {
  constructor(private twilioService: TwilioService) { }

  @Post()
  async sendMessage(
    @Body() messageDTO: MessageDTO
  ) {
    return this.twilioService.sendMessage(messageDTO);
  }

  @Get('messageStatus/:sId')
  async getMessageStatus(
    @Param('sId') sId: string
  ) {
    return this.twilioService.getMessageStatus(sId);
  }

  @Get('get-all')
  async getAllMessages() {
    return this.twilioService.getAllMessages();
  }
}
