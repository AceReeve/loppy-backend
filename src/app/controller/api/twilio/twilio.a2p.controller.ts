import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { createAddressDTO, CreateBrandRegistrationDTO, CreateBrandRegistrationsOTP, CreateCustomerProfileDTO, CreateCustomerProfileEntityAssignmentDTO, CreateCustomerProfileEvaluationDTO, CreateEndUserDTO, CreateEndUserTrustHubDTO, CreateSupportingDocumentDTO, CreateTrustProductDTO, CreateTrustProductEntityAssignmentDTO, CreateTrustProductEvaluationDTO, FetchBrandRegistrationsDTO, UpdateCustomerProfileDTO, UpdateTrustProductDTO } from "src/app/dto/api/stripe";
import { TwilioA2PService } from "src/app/services/api/twilio/twilio.a2p.service";

@ApiTags('Twilio')
@Controller('A2P')
@ApiBearerAuth('Bearer')
export class TwilioA2PController {
    constructor(private readonly twilioA2PService: TwilioA2PService) { }

    // Step 1: Fetch Regulatory Policies for a Specific Country
    @Get('fetch-policies')
    async fetchPolicies() {
        return this.twilioA2PService.fetchPolicies();
    }

    // Step 2: Create a Compliance Bundle
    @Post('create-customer-profile')
    async createCustomerProfile(@Body() CreateCustomerProfileDTO: CreateCustomerProfileDTO) {
        return this.twilioA2PService.createCustomerProfile(CreateCustomerProfileDTO);
    }

    // Step 2: Create a Compliance Bundle
    @Post('create-end-user')
    async createEndUser(@Body() createEndUserDTO: CreateEndUserDTO) {
        return this.twilioA2PService.createEndUser(createEndUserDTO);
    }

    // Step 3: Add Supporting Documents to Bundle
    @Post('create-address')
    async createAddress(@Body() createAddressDTO: createAddressDTO) {
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

    @Post('create-end-user-trust-hub')
    async createEndUserTrustHub(@Body() createEndUserTrustHubDTO: CreateEndUserTrustHubDTO
    ) {
        return this.twilioA2PService.createEndUserTrustHub(createEndUserTrustHubDTO);
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

    @Post('create-brand-registrations')
    async fetchBrandRegistrations(@Body() fetchBrandRegistrationDTO: FetchBrandRegistrationsDTO
    ) {
        return this.twilioA2PService.fetchBrandRegistrations(fetchBrandRegistrationDTO);
    }

    @Post('create-brand-registrations-otp')
    async createBrandRegistrationOtp(@Body() fetchBrandRegistrationsOTP: CreateBrandRegistrationsOTP
    ) {
        return this.twilioA2PService.createBrandRegistrationOtp(fetchBrandRegistrationsOTP);
    }

    @Post('create-mock-brand-registrations')
    async createMockBrandRegistrations(@Body() createBrandRegistrationDTO: CreateBrandRegistrationDTO
    ) {
        return this.twilioA2PService.createMockBrandRegistrations(createBrandRegistrationDTO);
    }

}