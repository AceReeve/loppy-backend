import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AddSupportingDocumentsDTO, AssignBundleToPhoneNumberDTO, AssignPhoneNumberToSubAccountDTO, AssignToBundleDTO, CreateBundleDTO, CreateEndUserDTO, PurchaseNumberDTO, SubmitBundleDTO } from 'src/app/dto/api/stripe';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioComplianceService {
    private client: Twilio.Twilio;

    constructor() {
        this.client = Twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN,
        );
    }
    // Step 1: Check Regulatory Compliance for a Country
    async getRegulatoryPolicies(countryCode: string) {
        try {
            const policies = await this.client.numbers.v2.regulatoryCompliance.regulations.list({
                isoCountry: countryCode,
            });
            return policies;
        } catch (error) {
            console.error('Error fetching regulatory policies:', error.message);
            throw error;
        }
    }

    // Step 2: Create a Regulatory Compliance Bundle
    async createComplianceBundle(createBundleDTO: CreateBundleDTO) {
        try {
            const type = createBundleDTO.endUserType === 'individual' ? 'individual' : 'business';
            const bundle = await this.client.numbers.v2.regulatoryCompliance.bundles.create({
                email: createBundleDTO.email,
                endUserType: type,
                friendlyName: createBundleDTO.friendlyName,
                isoCountry: createBundleDTO.isoCountry,
                numberType: createBundleDTO.numberType,
                statusCallback: "https://my.status.callback.com",
            });
            return bundle;
        } catch (error) {
            console.error('Error creating regulatory bundle:', error);
            throw error;
        }
    }

    async createEndUser(createEndUserDTO: CreateEndUserDTO) {
        const type = createEndUserDTO.endUserType === 'individual' ? 'individual' : 'business';
        const endUser = await this.client.numbers.v2.regulatoryCompliance.endUsers.create({
            friendlyName: createEndUserDTO.friendlyName,
            type: type,
        });

        console.log(endUser.sid);
    }

    // Step 3: Submit Supporting Documents to the Bundle
    async addSupportingDocuments(addSupportingDocumentsDTO: AddSupportingDocumentsDTO) {
        try {
            const supportingDocument =
                await this.client.numbers.v2.regulatoryCompliance.supportingDocuments.create({
                    attributes: {
                        registered_seat_of_business:
                            addSupportingDocumentsDTO.registeredAddress,
                        document_number: addSupportingDocumentsDTO.documentNumber,
                        issue_date: addSupportingDocumentsDTO.issuanceDate,
                    },
                    friendlyName: addSupportingDocumentsDTO.friendlyName,
                    type: addSupportingDocumentsDTO.documentType,
                });

            // Attach document to the bundle
            const bundleDocument = await this.client.numbers.v2.regulatoryCompliance.bundles(addSupportingDocumentsDTO.bundleSid)
                .itemAssignments.create({
                    objectSid: supportingDocument.sid,
                });

            return bundleDocument;
        } catch (error) {
            console.error('Error adding supporting document:', error);
            throw error;
        }
    }

    async createItemAssignment(assignToBundleDTO: AssignToBundleDTO) {
        const itemAssignment = await this.client.numbers.v2.regulatoryCompliance
            .bundles(assignToBundleDTO.bundleSID)
            .itemAssignments.create({
                objectSid: assignToBundleDTO.documentId,
            });

        console.log(itemAssignment.bundleSid);
    }

    async updateBundle(submitBundleDTO: SubmitBundleDTO) {
        const bundle = await this.client.numbers.v2.regulatoryCompliance
            .bundles(submitBundleDTO.bundleSID)
            .update({ status: "pending-review" });

        console.log(bundle.sid);
    }

    // Method to assign a regulatory compliance bundle to a phone number
    async assignBundleToPhoneNumber(assignBundleToPhoneNumberDTO: AssignBundleToPhoneNumberDTO) {
        try {
            const phoneNumber = await this.client.incomingPhoneNumbers(assignBundleToPhoneNumberDTO.phoneNumberSID)
                .update({
                    bundleSid: assignBundleToPhoneNumberDTO.bundleSID,
                });

            return phoneNumber;
        } catch (error) {
            console.error('Error assigning bundle to phone number:', error);
            throw error;
        }
    }

    // Step 4: Purchase Phone Number and Assign to Subaccount
    async purchasePhoneNumber(purchaseNumberDTO: PurchaseNumberDTO) {
        const phoneNumber = purchaseNumberDTO.phoneNumber;
        try {
            const purchasedNumber = await this.client.api.accounts(purchaseNumberDTO.subAccountSid).incomingPhoneNumbers.create({
                phoneNumber
            });

            return purchasedNumber;
        } catch (error) {
            console.error('Error purchasing phone number:', error);
            throw error;
        }
    }

    // Step 5: Assign Phone Number to Subaccount
    async assignPhoneNumberToSubaccount(assignPhoneNumberToSubAccountDTO: AssignPhoneNumberToSubAccountDTO) {
        try {
            const phoneNumber = await this.client.api.accounts(assignPhoneNumberToSubAccountDTO.subAccountSid).incomingPhoneNumbers(assignPhoneNumberToSubAccountDTO.phoneNumberSid).update({
                accountSid: assignPhoneNumberToSubAccountDTO.subAccountSid,
            });

            return phoneNumber;
        } catch (error) {
            console.error('Error assigning phone number to subaccount:', error);
            throw error;
        }
    }
}
