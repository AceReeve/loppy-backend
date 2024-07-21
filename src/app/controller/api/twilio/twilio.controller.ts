import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { TwilioService } from 'src/app/services/api/twilio/twilio.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  MessageDTO,
  TwilioCreateSubAccount,
  TwilioCredDTO,
} from 'src/app/dto/api/stripe';

@ApiTags('Messages')
@Controller('messages')
@ApiBearerAuth('Bearer')
export class TwilioController {
  constructor(private twilioService: TwilioService) {}

  @Post('twilio-credentials')
  async twilioCredentials(@Body() twilioCredDTO: TwilioCredDTO) {
    return this.twilioService.twilioCredentials(twilioCredDTO);
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

  @Get('get-twilio-credentials')
  async getTwilioCredentials() {
    return this.twilioService.getTwilioCredentials();
  }

  @Get('get-twilio-access-token')
  async getTwilioAccessToken() {
    return this.twilioService.getTwilioAccessToken();
  }

  @Post('create-subaccount')
  async createSubAccount(@Body('friendlyName') friendlyName: string) {
    return this.twilioService.createSubAccount(friendlyName);
  }

  @Get('subaccount/:id')
  async getSubAccount(@Param('id') id: string) {
    return this.twilioService.getSubAccount(id);
  }

  @Get('subaccounts')
  async getAllSubAccounts() {
    return this.twilioService.getAllSubAccounts();
  }

  @Get('get-all-subaccounts-database')
  async getAllSubAccountsInDatabase() {
    return this.twilioService.getAllSubAccountsInDatabase();
  }
  @Delete('subaccount/:sid')
  async deleteSubAccount(@Param('sid') sid: string) {
    return this.twilioService.deleteSubAccount(sid);
  }
}
