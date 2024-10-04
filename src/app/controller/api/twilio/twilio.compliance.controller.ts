import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddSupportingDocumentsDTO, AssignBundleToPhoneNumberDTO, AssignPhoneNumberToSubAccountDTO, AssignToBundleDTO, CreateBundleDTO, CreateEndUserDTO, PurchaseNumberDTO, SubmitBundleDTO } from 'src/app/dto/api/stripe';
import { TwilioComplianceService } from 'src/app/services/api/twilio/twilio.compliance.service';

@ApiTags('Twilio')
@Controller('compliance')
@ApiBearerAuth('Bearer')
export class TwilioComplianceController {
    constructor(private readonly twilioComplianceService: TwilioComplianceService) { }

    // Step 1: Fetch Regulatory Policies for a Specific Country
    @Get('get-policies')
    async getRegulatoryPolicies(@Param('countryCode') countryCode: string) {
        return this.twilioComplianceService.getRegulatoryPolicies(countryCode);
    }

    // Step 2: Create a Compliance Bundle
    @Post('create-bundle')
    async createComplianceBundle(@Body() createBundleDTO: CreateBundleDTO) {
        return this.twilioComplianceService.createComplianceBundle(createBundleDTO);
    }

    // Step 2: Create a Compliance Bundle
    @Post('create-end-user')
    async createEndUser(@Body() createEndUserDTO: CreateEndUserDTO) {
        return this.twilioComplianceService.createEndUser(createEndUserDTO);
    }

    // Step 3: Add Supporting Documents to Bundle
    @Post('add-document')
    async addSupportingDocuments(@Body() addSupportingDocumentsDTO: AddSupportingDocumentsDTO) {
        return this.twilioComplianceService.addSupportingDocuments(addSupportingDocumentsDTO);
    }

    @Post('assign-document-to-bundle')
    async assignToBundle(@Body() assignToBundleDTO: AssignToBundleDTO) {
        return this.twilioComplianceService.createItemAssignment(assignToBundleDTO);
    }

    @Post('submit-bundle')
    async submitBundle(@Body() submitBundleDTO: SubmitBundleDTO) {
        return this.twilioComplianceService.updateBundle(submitBundleDTO);
    }

    @Post('assign-bundle-to-phone-number')
    async assignBundleToPhoneNumber(@Body() assignBundleToPhoneNumberDTO: AssignBundleToPhoneNumberDTO) {
        return this.twilioComplianceService.assignBundleToPhoneNumber(assignBundleToPhoneNumberDTO);
    }

    // Step 4: Purchase a Phone Number after Regulatory Approval
    @Post('purchase-number')
    async purchasePhoneNumber(@Body() purchaseNumberDTO: PurchaseNumberDTO
    ) {
        return this.twilioComplianceService.purchasePhoneNumber(purchaseNumberDTO);
    }

    // Step 4: Purchase a Phone Number after Regulatory Approval
    @Post('assign-phone-number-to-subaccount')
    async assignPhoneNumberToSubAccount(@Body() assignPhoneNumberToSubAccountDTO: AssignPhoneNumberToSubAccountDTO
    ) {
        return this.twilioComplianceService.assignPhoneNumberToSubaccount(assignPhoneNumberToSubAccountDTO);
    }
}