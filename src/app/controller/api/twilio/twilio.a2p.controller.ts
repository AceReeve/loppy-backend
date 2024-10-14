import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateAddressDTO, CreateBrandRegistrationDTO, CreateBrandRegistrationsOTP, CreateCustomerProfileDTO, CreateCustomerProfileEntityAssignmentDTO, CreateCustomerProfileEvaluationDTO, CreateLowAndStandardEndUserBusninessProfileDTO, CreateLowAndStandardEndUserRepresentativeDTO, CreateLowAndStandardEndUserTrustHubDTO, CreateSoleProprietorEndUserDTO, CreateSoleProprietorEndUserTrustHubDTO, CreateSupportingDocumentDTO, CreateTrustProductDTO, CreateTrustProductEntityAssignmentDTO, CreateTrustProductEvaluationDTO, FetchBrandRegistrationsDTO, UpdateCustomerProfileDTO, UpdateTrustProductDTO } from "src/app/dto/api/stripe";
import { TwilioA2PService } from "src/app/services/api/twilio/twilio.a2p.service";

@ApiTags('Twilio')
@Controller('A2P')
@ApiBearerAuth('Bearer')
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

    @Post('create-end-user-sole-proprietor-trust-hub')
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