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
  @Get('organization')
  @ApiOperation({ summary: 'List of Organization' })
  async getAllOrganization() {
    return this.service.getAllOrganization();
  }
  @Get('organization/:organization_id')
  @ApiOperation({ summary: 'Get Organization by Organization ID' })
  @ApiQuery({
    name: 'organization_id',
    description: 'Get Organization By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  async getOrganizationById(@Query('organization_id') organization_id: string) {
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
  @ApiOperation({ summary: 'Buy Number' })
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
  @Get('getAllinbox/:organization_id')
  @ApiQuery({
    name: 'organization_id',
    description: 'Get Inbox By Organization ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  @ApiOperation({ summary: 'List of Inbox' })
  async getAllInbox(@Query('organization_id') organization_id: string) {
    return this.service.getAllInbox(organization_id);
  }

  @Get('getinbox/:inbox_id')
  @ApiOperation({ summary: 'Get Inbox by inbox ID' })
  @ApiQuery({
    name: 'inbox_id',
    description: 'Get Inbox By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  async getInboxById(@Query('inbox_id') inbox_id: string) {
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
}
