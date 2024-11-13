import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  Query,
  Put,
  Request,
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
import {
  AddMemberDTO,
  InboxesDTO,
  OrganizationDTO,
} from 'src/app/dto/messaging-twilio';
import { MessagingTwilioService } from 'src/app/services/messaging-twilio/messaging-twilio.service';
import { AbstractMessagingTwilioService } from 'src/app/interface/messaging-twilio';
import { AdminAuthGuard, JwtAuthGuard } from 'src/app/guard/auth';
import { UserInterface } from 'src/app/interface/user';

@ApiTags('Twilio Messaging')
@Controller('twilio-messaging')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('Bearer')
export class MessagingTwilioController {
  constructor(private service: AbstractMessagingTwilioService) {}

  @Post('organization')
  @ApiOperation({ summary: 'Create Organization' })
  async organization(
    @Request() req: UserInterface,
    @Body('friendlyName') friendlyName: string,
    @Body() organizationDTO: OrganizationDTO,
  ) {
    return this.service.organization(req, organizationDTO, friendlyName);
  }
  @Get('organizations')
  @ApiOperation({ summary: 'List of Organization' })
  async getAllOrganization(@Request() req: UserInterface) {
    return this.service.getAllOrganization(req);
  }
  @Get('organization/:organization_id')
  @ApiOperation({ summary: 'Get Organization by Organization ID' })
  async getOrganizationById(@Param('organization_id') organization_id: string) {
    return this.service.getOrganizationById(organization_id);
  }
  @Get('available-numbers')
  @ApiOperation({ summary: 'Check Available Numbers' })
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
    return this.service.fetchAvailableNumbers(
      countryCode,
      type,
      areaCode,
      limit,
    );
  }

  @Post('buy-number')
  @ApiOperation({
    summary: 'Buy Number',
    description: `
      Use the following test phone numbers for testing purposes:
      
      - +15005550000: This phone number is unavailable (Error: 21422).
      - +15005550001: This phone number is invalid (Error: 21421).
      - +15005550006: This phone number is valid and available (No error).
    `,
  })
  async buyNumber(@Request() req: UserInterface, @Query('phoneNumber') phoneNumber: string) {
    return this.service.buyNumber(req, phoneNumber);
  }

  @Post('inbox')
  @ApiOperation({ summary: 'Create Inbox' })
  async inbox(@Request() req: UserInterface, @Body() inboxDTO: InboxesDTO) {
    return this.service.inbox(req, inboxDTO);
  }
  @Get('inboxes')
  @ApiOperation({ summary: 'List of Inbox' })
  async getAllInbox(@Request() req: UserInterface, ) {
    return this.service.getAllInbox(req);
  }

  @Get('inbox/:inbox_id')
  @ApiOperation({ summary: 'Get Inbox by inbox ID' })
  async getInboxById(@Param('inbox_id') inbox_id: string) {
    return this.service.getInboxById(inbox_id);
  }

  @Post('add-member')
  @ApiOperation({ summary: 'Add Member to an Organization' })
  async addMemberToAnOrganization(@Request() req: UserInterface, @Body() addMemberDTO: AddMemberDTO) {
    return this.service.addMemberToAnOrganization(req, addMemberDTO);
  }

  @Get('getCred')
  @ApiQuery({
    name: 'password',
    description: 'password to get credentials',
    example: 'Password',
    required: true,
  })
  @ApiOperation({ summary: 'getcred' })
  async getCred(@Query('password') password: string) {
    return this.service.getCred(password);
  }

  @Get('get-twilio-access-token')
  async getTwilioAccessToken(@Request() req: UserInterface, ) {
    return this.service.getTwilioAccessToken(req);
  }

  @Get('get-purchased-numbers')
  async getPurchasedNumber(@Request() req: UserInterface, ) {
    return this.service.getPurchasedNumber(req);
  }

  @Put('activate-organization')
  @ApiOperation({ summary: 'Activate WorkSpace' })
  @ApiQuery({
    name: 'id',
    description: 'id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async activateWorkSpace(@Request() req: UserInterface, @Query('id') id: string) {
    return this.service.activateWorkSpace(req,id);
  }

  @Put('activate-inbox')
  @ApiOperation({ summary: 'Activate Inbox' })
  @ApiQuery({
    name: 'id',
    description: 'id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async activateInbox(@Request() req: UserInterface, @Query('id') id: string) {
    return this.service.activateInbox(req, id);
  }

  @Get('get-activated-inbox')
  async getActivatedInbox(@Request() req: UserInterface, ) {
    return this.service.getActivatedInbox(req);
  }

  @Get('get-activated-organization')
  async getActivatedWorkSpace(@Request() req: UserInterface, ) {
    return this.service.getActivatedWorkSpace(req);
  }
}
