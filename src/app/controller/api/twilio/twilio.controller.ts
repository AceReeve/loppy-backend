import { Controller, Post, Body, Get } from '@nestjs/common';
import { TwilioService } from 'src/app/services/api/twilio/twilio.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Messages')
@Controller('messages')
export class TwilioController {
  constructor(private twilioService: TwilioService) {}

  @Post()
  async sendMessage(@Body() messageDto: { to: string; body: string }) {
    return this.twilioService.sendMessage(messageDto.to, messageDto.body);
  }

  @Get('messageStatus')
  async getMessageStatus(@Body() messageStatusDto: { sId: string }) {
    return this.twilioService.getMessageStatus(messageStatusDto.sId);
  }
}
