import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAddressDTO, CreateBrandRegistrationDTO, CreateBrandRegistrationsOTP, CreateCustomerProfileDTO, CreateCustomerProfileEntityAssignmentDTO, CreateCustomerProfileEvaluationDTO, CreateEndUserDTO, CreateEndUserTrustHubDTO, CreateSupportingDocumentDTO, CreateTrustProductDTO, CreateTrustProductEntityAssignmentDTO, CreateTrustProductEvaluationDTO, FetchBrandRegistrationsDTO, UpdateCustomerProfileDTO, UpdateTrustProductDTO } from 'src/app/dto/api/stripe';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioA2PService {
    private client: Twilio.Twilio;

    constructor() {
        this.client = Twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN,
        );
    }

    async fetchPolicies() {
        const policy = await this.client.trusthub.v1
            .policies("RN806dd6cd175f314e1f96a9727ee271f4")
            .fetch();

        console.log(policy.sid);
        return policy;
    }

    async createCustomerProfile(createCustomerProfileDTO: CreateCustomerProfileDTO) {
        const customerProfile = await this.client.trusthub.v1.customerProfiles.create({
            email: createCustomerProfileDTO.email,
            friendlyName: createCustomerProfileDTO.friendlyName,
            policySid: "RN806dd6cd175f314e1f96a9727ee271f4",
        });

        console.log(customerProfile.sid);
        return customerProfile.sid;
    }

    async createEndUser(createEndUserDTO: CreateEndUserDTO) {
        const endUser = await this.client.trusthub.v1.endUsers.create({
            attributes: {
                email: createEndUserDTO.email,
                first_name: createEndUserDTO.firstName,
                last_name: createEndUserDTO.lastName,
                phone_number: createEndUserDTO.phoneNumber,
            },
            friendlyName: createEndUserDTO.friendlyName,
            type: "starter_customer_profile_information",
        });

        console.log(endUser.sid);
        return endUser.sid;
    }


    async createAddress(createAddress: createAddressDTO) {
        const address = await this.client.addresses.create({
            city: createAddress.city,
            customerName: createAddress.customerName,
            isoCountry: createAddress.isoCountry,
            postalCode: createAddress.postalCode,
            region: createAddress.region,
            street: createAddress.street,
            streetSecondary: createAddress.streetSecondary,
        });

        console.log(address.accountSid);
        return address.accountSid;
    }

    async createSupportingDocument(createSupportingDocumentDTO: CreateSupportingDocumentDTO) {
        const supportingDocument =
            await this.client.trusthub.v1.supportingDocuments.create({
                attributes: {
                    address_sids: createSupportingDocumentDTO.addressSIDs,
                },
                friendlyName: createSupportingDocumentDTO.friendlyName,
                type: "customer_profile_address",
            });

        console.log(supportingDocument.sid);
        return supportingDocument.sid;
    }

    async createCustomerProfileEntityAssignment(createCustomerProfileEntityAssignmentDTO: CreateCustomerProfileEntityAssignmentDTO) {
        const customerProfilesEntityAssignment = await this.client.trusthub.v1
            .customerProfiles(createCustomerProfileEntityAssignmentDTO.customerProfileSID)
            .customerProfilesEntityAssignments.create({
                objectSid: createCustomerProfileEntityAssignmentDTO.objectSID,
            });

        console.log(customerProfilesEntityAssignment.sid);
        return customerProfilesEntityAssignment.sid;
    }

    async createCustomerProfileEvaluation(createCustomerProfileEvaluationDTO: CreateCustomerProfileEvaluationDTO) {
        const customerProfilesEvaluation = await this.client.trusthub.v1
            .customerProfiles(createCustomerProfileEvaluationDTO.customerProfileSID)
            .customerProfilesEvaluations.create({
                policySid: "RN806dd6cd175f314e1f96a9727ee271f4",
            });

        console.log(customerProfilesEvaluation.sid);
        return customerProfilesEvaluation.sid;
    }

    async updateCustomerProfile(updateCustomerProfileDTO: UpdateCustomerProfileDTO) {
        const customerProfile = await this.client.trusthub.v1
            .customerProfiles(updateCustomerProfileDTO.customerProfileSID)
            .update({ status: "pending-review" });

        console.log(customerProfile.sid);
        return customerProfile.sid;
    }

    async createTrustProduct(createTrustProductDTO: CreateTrustProductDTO) {
        const trustProduct = await this.client.trusthub.v1.trustProducts.create({
            email: createTrustProductDTO.email,
            friendlyName: createTrustProductDTO.friendlyName,
            policySid: "RN670d5d2e282a6130ae063b234b6019c8",
        });

        console.log(trustProduct.sid);
        return trustProduct.sid;
    }

    async createEndUserTrustHub(createEndUserTrustHubDTO: CreateEndUserTrustHubDTO) {
        const endUser = await this.client.trusthub.v1.endUsers.create({
            attributes: {
                brand_name: createEndUserTrustHubDTO.brandName,
                vertical: createEndUserTrustHubDTO.vertical,
                mobile_phone_number: createEndUserTrustHubDTO.mobilePhoneNumber,
            },
            friendlyName: createEndUserTrustHubDTO.friendlyName,
            type: "sole_proprietor_information",
        });

        console.log(endUser.sid);
        return endUser.sid;
    }

    async createTrustProductEntityAssignment(createTrustProductEntityAssignmentDTO: CreateTrustProductEntityAssignmentDTO) {
        const trustProductsEntityAssignment = await this.client.trusthub.v1
            .trustProducts(createTrustProductEntityAssignmentDTO.customerProfileSID)
            .trustProductsEntityAssignments.create({
                objectSid: createTrustProductEntityAssignmentDTO.endUserSID,
            });

        console.log(trustProductsEntityAssignment.sid);
        return trustProductsEntityAssignment.sid;
    }


    async createTrustProductEvaluation(createTrustProductEvaluationDTO: CreateTrustProductEvaluationDTO) {
        const trustProductsEvaluation = await this.client.trusthub.v1
            .trustProducts(createTrustProductEvaluationDTO.customerProfileSID)
            .trustProductsEvaluations.create({
                policySid: "RN670d5d2e282a6130ae063b234b6019c8",
            });

        console.log(trustProductsEvaluation.sid);
        return trustProductsEvaluation.sid;
    }

    async updateTrustProduct(updateTrustProductDTO: UpdateTrustProductDTO) {
        const trustProduct = await this.client.trusthub.v1
            .trustProducts(updateTrustProductDTO.trustProductSID)
            .update({ status: "pending-review" });

        console.log(trustProduct.sid);
        return trustProduct.sid;
    }

    async createBrandRegistrations(createBrandRegistrationsDTO: CreateBrandRegistrationDTO) {
        const brandRegistration = await this.client.messaging.v1.brandRegistrations.create(
            {
                a2PProfileBundleSid: createBrandRegistrationsDTO.a2PProfileBundleSID,
                brandType: "SOLE_PROPRIETOR",
                customerProfileBundleSid: createBrandRegistrationsDTO.customerProfileBundleSID,
            }
        );

        console.log(brandRegistration.sid);
        return brandRegistration.sid;
    }

    async fetchBrandRegistrations(fetchBrandRegistrationDTO: FetchBrandRegistrationsDTO) {
        const brandRegistration = await this.client.messaging.v1
            .brandRegistrations(fetchBrandRegistrationDTO.brandRegistrationSID)
            .fetch();

        console.log(brandRegistration.sid);
        return brandRegistration.sid;
    }

    async createBrandRegistrationOtp(createBrandRegistrationOtp: CreateBrandRegistrationsOTP) {
        const brandRegistrationOtp = await this.client.messaging.v1
            .brandRegistrations(createBrandRegistrationOtp.brandRegistrationSID)
            .brandRegistrationOtps.create();

        console.log(brandRegistrationOtp.accountSid);
        return brandRegistrationOtp.accountSid;
    }

    async createUsAppToPerson() {
        const usAppToPerson = await this.client.messaging.v1
            .services("MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            .usAppToPerson.create({
                brandRegistrationSid: "BNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                description: "Send marketing messages about sales and offers",
                hasEmbeddedLinks: true,
                hasEmbeddedPhone: true,
                helpKeywords: ["HELP", "SUPPORT"],
                helpMessage:
                    "Acme Corporation: Please visit www.example.com to get support. To opt-out, reply STOP.",
                messageFlow:
                    "End users opt-in by visiting www.example.com and adding their phone number. They then check a box agreeing to receive text messages from Example Brand. Term and Conditions at www.example.com/tc. Privacy Policy at www.example.com/privacy",
                messageSamples: [
                    "Book your next OWL FLIGHT for just 1 EUR",
                    "Twilio draw the OWL event is ON",
                ],
                optOutKeywords: ["STOP", "END"],
                optOutMessage:
                    "You have successfully been unsubscribed from Acme Corporation. You will not receive any more messages from this number.",
                usAppToPersonUsecase: "SOLE_PROPRIETOR",
            });

        console.log(usAppToPerson.sid);
        return usAppToPerson.sid;
    }

    async fetchUsAppToPerson() {
        const usAppToPerson = await this.client.messaging.v1
            .services("MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            .usAppToPerson("QE2c6890da8086d771620e9b13fadeba0b")
            .fetch();

        console.log(usAppToPerson.sid);
        return usAppToPerson.sid;
    }

    async createMockBrandRegistrations(createBrandRegistrations: CreateBrandRegistrationDTO) {
        const brandRegistration = await this.client.messaging.v1.brandRegistrations.create(
            {
                a2PProfileBundleSid: createBrandRegistrations.a2PProfileBundleSID,
                brandType: "STANDARD",
                customerProfileBundleSid: createBrandRegistrations.customerProfileBundleSID,
                mock: true,
            }
        );

        console.log(brandRegistration.sid);
        return brandRegistration.sid;
    }
}