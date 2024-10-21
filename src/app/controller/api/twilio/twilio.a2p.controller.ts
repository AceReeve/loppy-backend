import { Body, Controller, Get, Headers, Param, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiQueryOptions, ApiTags } from "@nestjs/swagger";
import { AddPhoneNumberToMessagingServiceDTO, CreateAddressDTO, CreateBrandRegistrationDTO, CreateBrandRegistrationsOTP, CreateCustomerProfileDTO, CreateCustomerProfileEntityAssignmentDTO, CreateCustomerProfileEvaluationDTO, CreateLowAndStandardEndUserBusninessProfileDTO, CreateLowAndStandardEndUserRepresentativeDTO, CreateLowAndStandardEndUserTrustHubDTO, CreateMessagingServiceDTO, CreateSoleProprietorEndUserDTO, CreateSoleProprietorEndUserTrustHubDTO, CreateSupportingDocumentDTO, CreateTrustProductDTO, CreateTrustProductEntityAssignmentDTO, CreateTrustProductEvaluationDTO, CreateUsAppToPersonDTO, FetchUsAppToPersonDTO, UpdateCustomerProfileDTO, UpdateTrustProductDTO } from "src/app/dto/api/stripe";
import RequestWithRawBody from "src/app/interface/stripe/requestWithRawBody.interface";
import { TwilioA2PService } from "src/app/services/api/twilio/twilio.a2p.service";
import { Query as ExpressQuery } from 'express-serve-static-core';
import { JwtAuthGuard } from "src/app/guard/auth";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
@ApiTags('Twilio')
@Controller('A2P')
export class TwilioA2PController {
    constructor(private readonly twilioA2PService: TwilioA2PService) { }


    @Get('fetch-policies')
    async fetchPolicies() {
        return this.twilioA2PService.fetchPolicies();
    }


    @Post('create-customer-profile')
    async createCustomerProfile(@Body() CreateCustomerProfileDTO: CreateCustomerProfileDTO) {
        return this.twilioA2PService.createCustomerProfile(CreateCustomerProfileDTO);
    }


    @Post('create-end-user-sole-proprietor')
    async createEndUserSoleProprietor(@Body() createEndUserDTO: CreateSoleProprietorEndUserDTO) {
        return this.twilioA2PService.createSoleProprietorEndUser(createEndUserDTO);
    }

    @Post('create-end-user-low-and-standard-business-profile')
    async createEndUserLowAndStandardBusinessProfile(@Body() createEndUserDTO: CreateLowAndStandardEndUserBusninessProfileDTO) {
        return this.twilioA2PService.createLowAndStandardEndUserBusinessProfile(createEndUserDTO);
    }

    @Post('create-end-user-low-and-standard-representative')
    async createEndUserLowAndStandardRepresentatibe(@Body() createEndUserDTO: CreateLowAndStandardEndUserRepresentativeDTO) {
        return this.twilioA2PService.createLowAndStandardEndUserRepresentative(createEndUserDTO);
    }

    @Post('create-address')
    async createAddress(@Body() createAddressDTO: CreateAddressDTO) {
        return this.twilioA2PService.createAddress(createAddressDTO);
    }

    @Post('create-supporting-document')
    async createSupportingDocument(@Body() createSupportingDocument: CreateSupportingDocumentDTO) {
        return this.twilioA2PService.createSupportingDocument(createSupportingDocument);
    }

    @Post('create-customer-profile-entity-assignment')
    async createCustomerProfileEntityAssignment(@Body() createCustomerProfileEntityAssignment: CreateCustomerProfileEntityAssignmentDTO) {
        return this.twilioA2PService.createCustomerProfileEntityAssignment(createCustomerProfileEntityAssignment);
    }

    @Post('customer-profile-evaluation')
    async customerProfileEvaluation(@Body() createCustomerProfileEvaluationDTO: CreateCustomerProfileEvaluationDTO) {
        return this.twilioA2PService.createCustomerProfileEvaluation(createCustomerProfileEvaluationDTO);
    }

    @Post('update-customer-profile')
    async updateCustomerProfile(@Body() updateCustomerProfileDTO: UpdateCustomerProfileDTO
    ) {
        return this.twilioA2PService.updateCustomerProfile(updateCustomerProfileDTO);
    }

    @Post('create-trust-product')
    async createTrustProduct(@Body() createTrustProductDTO: CreateTrustProductDTO
    ) {
        return this.twilioA2PService.createTrustProduct(createTrustProductDTO);
    }

    @Post('create-end-user-sole-proprietor-trust-hub')
    async createEndUserSoleProprietorTrustHub(@Body() createEndUserTrustHubDTO: CreateSoleProprietorEndUserTrustHubDTO
    ) {
        return this.twilioA2PService.createSoleProprietorEndUserTrustHub(createEndUserTrustHubDTO);
    }

    @Post('create-end-user-low-and-standard-trust-hub')
    async createEndUserLowAndStandardTrustHub(@Body() createEndUserTrustHubDTO: CreateLowAndStandardEndUserTrustHubDTO
    ) {
        return this.twilioA2PService.createLowAndStandardEndUserTrustHub(createEndUserTrustHubDTO);
    }

    @Post('create-trust-product-entity-assignment')
    async createTrustProductEntityAssignment(@Body() createTrustProductEntityAssignmentDTO: CreateTrustProductEntityAssignmentDTO
    ) {
        return this.twilioA2PService.createTrustProductEntityAssignment(createTrustProductEntityAssignmentDTO);
    }

    @Post('create-product-evaluation')
    async createTrustProductEvaluation(@Body() createTrustProductEvaluationDTO: CreateTrustProductEvaluationDTO
    ) {
        return this.twilioA2PService.createTrustProductEvaluation(createTrustProductEvaluationDTO);
    }

    @Post('update-trust-product')
    async updateTrustProduct(@Body() updateTrustProductDTO: UpdateTrustProductDTO
    ) {
        return this.twilioA2PService.updateTrustProduct(updateTrustProductDTO);
    }

    @Post('create-brand-registrations')
    async createBrandRegistrations(@Body() createBrandRegistrationDTO: CreateBrandRegistrationDTO
    ) {
        return this.twilioA2PService.createBrandRegistrations(createBrandRegistrationDTO);
    }

    @Get('fetch-brand-registrations')
    @ApiOperation({ summary: 'fetch brand registration' })
    @ApiQuery({
        name: 'brandRegistrationSID',
        required: true,
    } as ApiQueryOptions)
    async fetchBrandRegistrations(query: ExpressQuery
    ) {
        return this.twilioA2PService.fetchBrandRegistrations(query);
    }

    @Post('create-brand-registrations-otp')
    async createBrandRegistrationOtp(@Body() fetchBrandRegistrationsOTP: CreateBrandRegistrationsOTP
    ) {
        return this.twilioA2PService.createBrandRegistrationOtp(fetchBrandRegistrationsOTP);
    }

    @Post('create-messaging-service')
    async createMessagingService(@Body() createMessagingService: CreateMessagingServiceDTO
    ) {
        return this.twilioA2PService.createService(createMessagingService);
    }

    @Get('fetch-messaging-service-usecase')
    @ApiOperation({ summary: 'fetch messaging service usecase' })
    @ApiQuery({
        name: 'messagingServiceSID',
        required: true,
    } as ApiQueryOptions)
    @ApiQuery({
        name: 'brandRegistrationSID',
        required: true,
    } as ApiQueryOptions)
    async fetchUsAppToPersonUseCase(@Query() request: ExpressQuery,
    ) {
        return this.twilioA2PService.fetchUsAppToPersonUsecase(request);
    }

    @Post('create-us-app-to-person')
    async createUsAppToPerson(@Body() createUsAppToPersonDTO: CreateUsAppToPersonDTO
    ) {
        return this.twilioA2PService.createUsAppToPerson(createUsAppToPersonDTO);
    }

    @Get('fetch-us-app-to-person')
    @ApiOperation({ summary: 'fetch us app to person' })
    @ApiQuery({
        name: 'messagingServiceSID',
        required: true,
    } as ApiQueryOptions)
    @ApiQuery({
        name: 'usAppToPersonSID',
        required: true,
    } as ApiQueryOptions)
    async fetchUsAppToPerson(@Query() request: ExpressQuery
    ) {
        return this.twilioA2PService.fetchUsAppToPerson(request);
    }

    @Post('delete-us-app-to-person')
    async deleteUsAppToPerson(@Body() deleteUsAppToPerson: FetchUsAppToPersonDTO
    ) {
        return this.twilioA2PService.deleteUsAppToPerson(deleteUsAppToPerson);
    }

    @Post('add-phone-number-to-messaging-service')
    async addPhoneNumberToMessagingService(@Body() addPhoneNumberToMessagingServiceDTO: AddPhoneNumberToMessagingServiceDTO
    ) {
        return this.twilioA2PService.addPhoneNumberToMessagingService(addPhoneNumberToMessagingServiceDTO);
    }

    @Post('create-mock-brand-registrations')
    async createMockBrandRegistrations(@Body() createBrandRegistrationDTO: CreateBrandRegistrationDTO
    ) {
        return this.twilioA2PService.createMockBrandRegistrations(createBrandRegistrationDTO);
    }


    // @Post('webhook')
    // async handleIncomingEvents(
    //     @Headers('x-twilio-signature') signature: string,
    //     @Req() request: RequestWithRawBody,
    //     @Res() response: Response
    // ) {

    //     // Do something with the webhook data here
    //     return 'Webhook received';
    // }
}