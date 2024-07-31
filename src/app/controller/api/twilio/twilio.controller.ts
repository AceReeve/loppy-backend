import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  Query,
} from '@nestjs/common';
import { TwilioService } from 'src/app/services/api/twilio/twilio.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
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

  @Get('subaccount/:sid')
  async getSubAccount(@Param('sid') sid: string) {
    return this.twilioService.getSubAccount(sid);
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
  @Get('get-all-subaccounts-numbers')
  async getPhoneNumbersForSubAccounts() {
    return this.twilioService.getPhoneNumbersForSubAccounts();
  }

  ///////////
  @Get('available-numbers')
  @ApiQuery({
    name: 'countryCode',
    description: 'The country code for which to fetch available phone numbers.',
    example: 'US, CA, GB, AU, DE, FR, ES, IT, IN, JP, CN, MX, BR, ZA, NZ',
    required: true,
  })
  @ApiQuery({
    name: 'type',
    description: 'local or tollFree.',
    example: 'local',
    required: true,
  })
  @ApiQuery({
    name: 'areaCode',
    description: 'The area code to filter available phone numbers.',
    example: '510',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'The limit on the number of phone numbers to fetch.',
    example: '10',
    required: false,
  })
  async fetchAvailableNumbers(
    @Query('countryCode') countryCode: string,
    @Query('type') type: 'local' | 'tollFree',
    @Query('areaCode') areaCode?: string,
    @Query('limit') limit?: string,
  ) {
    return this.twilioService.fetchAvailableNumbers(countryCode, type, areaCode, limit);
  }

  @Post('buy-number')
  async buyNumber(
    @Query('phoneNumber') phoneNumber: string,
    @Query('subAccountSid') subAccountSid: string,
    @Query('authToken') authToken: string,
  ) {
    return this.twilioService.buyNumber(phoneNumber, subAccountSid, authToken);
  }

  @Get('purchased-numbers')
  async fetchPurchasedNumbers(
    @Query('subAccountSid') subAccountSid: string,
    @Query('authToken') authToken: string,
  ) {
    return this.twilioService.fetchPurchasedNumbers(subAccountSid, authToken);
  }

  @Get('all-purchased-numbers')
  async fetchAllPurchasedNumbers() {
      return await this.twilioService.fetchAllPurchasedNumbers();
  }
}
