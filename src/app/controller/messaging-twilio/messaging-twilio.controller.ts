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

@ApiTags('Twilio Messaging')
@Controller('twilio-messaging')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('Bearer')
export class MessagingTwilioController {
  constructor(private service: AbstractMessagingTwilioService) {}

  @Post('organization')
  @ApiOperation({ summary: 'Create Organization' })
  async organization(
    @Body('friendlyName') friendlyName: string,
    @Body() organizationDTO: OrganizationDTO,
  ) {
    return this.service.organization(organizationDTO, friendlyName);
  }
  @Get('organizations')
  @ApiOperation({ summary: 'List of Organization' })
  async getAllOrganization() {
    return this.service.getAllOrganization();
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
  async buyNumber(
    @Query('phoneNumber') phoneNumber: string,
    @Query('organization_id') organization_id: string,
  ) {
    return this.service.buyNumber(phoneNumber, organization_id);
  }

  @Post('inbox')
  @ApiOperation({ summary: 'Create Inbox' })
  async inbox(@Body() inboxDTO: InboxesDTO) {
    return this.service.inbox(inboxDTO);
  }
  @Get('inboxes/:organization_id')
  @ApiOperation({ summary: 'List of Inbox' })
  async getAllInbox(@Param('organization_id') organization_id: string) {
    return this.service.getAllInbox(organization_id);
  }

  @Get('inbox/:inbox_id')
  @ApiOperation({ summary: 'Get Inbox by inbox ID' })
  async getInboxById(@Param('inbox_id') inbox_id: string) {
    return this.service.getInboxById(inbox_id);
  }

  @Post('add-member/:organization_id')
  @ApiOperation({ summary: 'Add Member to an Organization' })
  @ApiQuery({
    name: 'organization_id',
    description: 'Organization ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  async addMemberToAnOrganization(
    @Query('organization_id') organization_id: string,
    @Body() addMemberDTO: AddMemberDTO,
  ) {
    return this.service.addMemberToAnOrganization(
      organization_id,
      addMemberDTO,
    );
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

  @Get('get-twilio-access-token/:id')
  async getTwilioAccessToken(@Param('id') id: string) {
    return this.service.getTwilioAccessToken(id);
  }

  @Get('get-purchased-numbers/:organization_id')
  async getPurchasedNumber(@Param('organization_id') organization_id: string) {
    return this.service.getPurchasedNumber(organization_id);
  }

  @Put('activate-workspace')
  @ApiOperation({ summary: 'Activate WorkSpace' })
  @ApiQuery({
    name: 'id',
    description: 'id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async activateWorkSpace(@Query('id') id: string) {
    return this.service.activateWorkSpace(id);
  }

  @Put('activate-inbox')
  @ApiOperation({ summary: 'Activate Inbox' })
  @ApiQuery({
    name: 'id',
    description: 'id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async activateInbox(@Query('id') id: string) {
    return this.service.activateInbox(id);
  }

  @Get('get-activated-inbox')
  async getActivatedInbox() {
    return this.service.getActivatedInbox();
  }

  @Get('get-activated-workspace')
  async getActivatedWorkSpace() {
    return this.service.getActivatedWorkSpace();
  }
}
