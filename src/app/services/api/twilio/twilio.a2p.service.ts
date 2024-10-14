import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateAddressDTO, CreateBrandRegistrationDTO, CreateBrandRegistrationsOTP, CreateCustomerProfileDTO, CreateCustomerProfileEntityAssignmentDTO, CreateCustomerProfileEvaluationDTO, CreateLowAndStandardEndUserBusninessProfileDTO, CreateLowAndStandardEndUserRepresentativeDTO, CreateLowAndStandardEndUserTrustHubDTO, CreateSoleProprietorEndUserDTO, CreateSoleProprietorEndUserTrustHubDTO, CreateSupportingDocumentDTO, CreateTrustProductDTO, CreateTrustProductEntityAssignmentDTO, CreateTrustProductEvaluationDTO, FetchBrandRegistrationsDTO, UpdateCustomerProfileDTO, UpdateTrustProductDTO } from 'src/app/dto/api/stripe';
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

    //Sole Proprietor 1.1
    async fetchPolicies() {
        const policy = await this.client.trusthub.v1
            .policies("RN806dd6cd175f314e1f96a9727ee271f4")
            .fetch();

        console.log(policy.sid);
        return policy;
    }

    //Low and Standard Step 1.1

    //Sole proprietor 1.2
    async createCustomerProfile(createCustomerProfileDTO: CreateCustomerProfileDTO) {
        const policySid = createCustomerProfileDTO.isSoleProprietor === true ? 'RN806dd6cd175f314e1f96a9727ee271f4' : 'RNdfbf3fae0e1107f8aded0e7cead80bf5';
        const customerProfile = await this.client.trusthub.v1.customerProfiles.create({
            email: createCustomerProfileDTO.email,
            friendlyName: createCustomerProfileDTO.friendlyName,
            policySid: policySid,
            statusCallback: "https://www.example.com/status-callback-endpoint",
        });

        console.log(customerProfile.sid);
        return customerProfile.sid;
    }

    //Sole proprietor 1.3
    async createSoleProprietorEndUser(createEndUserDTO: CreateSoleProprietorEndUserDTO) {
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

    //Low and Standard Step 1.2
    async createLowAndStandardEndUserBusinessProfile(createEndUserDTO: CreateLowAndStandardEndUserBusninessProfileDTO) {
        const endUser = await this.client.trusthub.v1.endUsers.create({
            attributes: {
                business_name: createEndUserDTO.businessName,
                social_media_profile_urls:
                    createEndUserDTO.socialMediaProfileURLs,
                website_url: createEndUserDTO.websiteURL,
                business_regions_of_operation: createEndUserDTO.businessRegionsOfOperation,
                business_type: createEndUserDTO.businessType,
                business_registration_identifier: createEndUserDTO.businessRegistrationIdentifier,
                business_identity: createEndUserDTO.businessIdentity,
                business_industry: createEndUserDTO.businessIndustry,
                business_registration_number: createEndUserDTO.businessRegistrationNumber,
            },
            friendlyName: createEndUserDTO.friendlyName,
            type: "starter_customer_profile_information",
        });

        console.log(endUser.sid);
        return endUser.sid;
    }

    //Low and standard 1.4
    async createLowAndStandardEndUserRepresentative(createEndUser: CreateLowAndStandardEndUserRepresentativeDTO) {
        const endUser = await this.client.trusthub.v1.endUsers.create({
            attributes: {
                job_position: createEndUser.jobPosition,
                last_name: createEndUser.lastName,
                phone_number: createEndUser.phoneNumber,
                first_name: createEndUser.firstName,
                email: createEndUser.email,
                business_title: createEndUser.businessTitle,
            },
            friendlyName: createEndUser.friendlyName,
            type: "authorized_representative_1",
        });

        console.log(endUser.sid);
        return endUser.sid;
    }

    //Low and Standard 1.6

    //Sole proprietor 1.4
    async createAddress(createAddress: CreateAddressDTO) {
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

    //Low and Standard 1.7

    //Sole proprietor 1.5
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

    //Low and Standard 1.3
    //sid of step 1.1 and object_sid of step 1.2

    //Low and Standard 1.5
    //sid of step 1.1 and object_sid of step 1.4

    //Low and Standard 1.8
    //sid of step 1.1 and object_sid of step 1.7

    //Sole proprietor 1.6.1
    //object_sid = end_user_sid from 1.3

    //Sole proprietor 1.6.2
    //object_sid = supporting document sid from 1.5

    //Sole proprietor 1.6.3
    //object_sid = Starter Customer Profile SID from step 1.2

    async createCustomerProfileEntityAssignment(createCustomerProfileEntityAssignmentDTO: CreateCustomerProfileEntityAssignmentDTO) {
        const customerProfilesEntityAssignment = await this.client.trusthub.v1
            .customerProfiles(createCustomerProfileEntityAssignmentDTO.customerProfileSID)
            .customerProfilesEntityAssignments.create({
                objectSid: createCustomerProfileEntityAssignmentDTO.objectSID,
            });

        console.log(customerProfilesEntityAssignment.sid);
        return customerProfilesEntityAssignment.sid;
    }

    //Low and Standard 1.9

    //Sole proprietor 1.7
    async createCustomerProfileEvaluation(createCustomerProfileEvaluationDTO: CreateCustomerProfileEvaluationDTO) {
        const policySid = createCustomerProfileEvaluationDTO.isSoleProprietor === true ? 'RN806dd6cd175f314e1f96a9727ee271f4' : 'RNdfbf3fae0e1107f8aded0e7cead80bf5';
        const customerProfilesEvaluation = await this.client.trusthub.v1
            .customerProfiles(createCustomerProfileEvaluationDTO.customerProfileSID)
            .customerProfilesEvaluations.create({
                policySid: policySid,
            });

        console.log(customerProfilesEvaluation.sid);
        return customerProfilesEvaluation.sid;
    }

    //Low and Standard 1.10
    //sid of the Secondary Customer Profile or 1.1

    //Sole proprietor 1.8
    async updateCustomerProfile(updateCustomerProfileDTO: UpdateCustomerProfileDTO) {
        const customerProfile = await this.client.trusthub.v1
            .customerProfiles(updateCustomerProfileDTO.customerProfileSID)
            .update({ status: "pending-review" });

        console.log(customerProfile.sid);
        return customerProfile.sid;
    }

    //Low and Standard 2.1

    //Sole proprietor 2.2
    async createTrustProduct(createTrustProductDTO: CreateTrustProductDTO) {
        const policySid = createTrustProductDTO.isSoleProprietor === true ? 'RN670d5d2e282a6130ae063b234b6019c8' : 'RNb0d4771c2c98518d916a3d4cd70a8f8b';
        const trustProduct = await this.client.trusthub.v1.trustProducts.create({
            email: createTrustProductDTO.email,
            friendlyName: createTrustProductDTO.friendlyName,
            policySid: policySid,
        });

        console.log(trustProduct.sid);
        return trustProduct.sid;
    }

    //Sole proprietor 2.3
    async createSoleProprietorEndUserTrustHub(createEndUser: CreateSoleProprietorEndUserTrustHubDTO) {
        const endUser = await this.client.trusthub.v1.endUsers.create({
            attributes: {
                brand_name: createEndUser.brandName,
                vertical: createEndUser.vertical,
                mobile_phone_number: createEndUser.mobilePhoneNumber,
            },
            friendlyName: createEndUser.friendlyName,
            type: "sole_proprietor_information",
        });

        console.log(endUser.sid);
        return endUser.sid;
    }

    //Low and Standard 2.2
    async createLowAndStandardEndUserTrustHub(createEndUser: CreateLowAndStandardEndUserTrustHubDTO) {
        const endUser = await this.client.trusthub.v1.endUsers.create({
            attributes: {
                company_type: createEndUser.companyType
            },
            friendlyName: createEndUser.friendlyName,
            type: "us_a2p_messaging_profile_information",
        });

        console.log(endUser.sid);
        return endUser.sid;
    }


    //Low and Standard 2.3
    //sid of the trust product and object_sid is the enduser 2.2

    //Low and Standard 2.4
    //sid of the trust product and object_sid is the enduser 1.1

    //Sole proprietor 2.4.1
    //customerProfileSID
    //object sid =  End-User Object SID from step 2.3

    //Sole proprietor 2.4.2
    //customerProfileSID
    //object sid = Starter Customer Profile Bundle SID from step 1.3
    async createTrustProductEntityAssignment(createTrustProductEntityAssignmentDTO: CreateTrustProductEntityAssignmentDTO) {
        const trustProductsEntityAssignment = await this.client.trusthub.v1
            .trustProducts(createTrustProductEntityAssignmentDTO.customerProfileSID)
            .trustProductsEntityAssignments.create({
                objectSid: createTrustProductEntityAssignmentDTO.endUserSID,
            });

        console.log(trustProductsEntityAssignment.sid);
        return trustProductsEntityAssignment.sid;
    }

    // Low and Standard 2.5

    // Sole proprietor 2.5
    async createTrustProductEvaluation(createTrustProductEvaluationDTO: CreateTrustProductEvaluationDTO) {
        const policySid = createTrustProductEvaluationDTO.isSoleProprietor === true ? 'RN670d5d2e282a6130ae063b234b6019c8' : 'RNb0d4771c2c98518d916a3d4cd70a8f8b';
        const trustProductsEvaluation = await this.client.trusthub.v1
            .trustProducts(createTrustProductEvaluationDTO.customerProfileSID)
            .trustProductsEvaluations.create({
                policySid: policySid,
            });

        console.log(trustProductsEvaluation.sid);
        return trustProductsEvaluation.sid;
    }

    // Low and Standard 2.6

    // Sole Proprietor 2.6
    async updateTrustProduct(updateTrustProductDTO: UpdateTrustProductDTO) {
        const trustProduct = await this.client.trusthub.v1
            .trustProducts(updateTrustProductDTO.trustProductSID)
            .update({ status: "pending-review" });

        console.log(trustProduct.sid);
        return trustProduct.sid;
    }

    // Low and Standard 3

    // Sole Proprietor 3
    async createBrandRegistrations(createBrandRegistrationsDTO: CreateBrandRegistrationDTO) {
        let brandRegistration;
        if (createBrandRegistrationsDTO.isSoleProprietor === false) {
            const skipAutomaticSecVet = createBrandRegistrationsDTO.isLowVolume === true ? true : false;
            brandRegistration = await this.client.messaging.v1.brandRegistrations.create(
                {
                    a2PProfileBundleSid: createBrandRegistrationsDTO.a2PProfileBundleSID,
                    customerProfileBundleSid: createBrandRegistrationsDTO.customerProfileBundleSID,
                    skipAutomaticSecVet: skipAutomaticSecVet // for low 
                }
            );
        } else {
            brandRegistration = await this.client.messaging.v1.brandRegistrations.create(
                {
                    a2PProfileBundleSid: createBrandRegistrationsDTO.a2PProfileBundleSID,
                    brandType: "SOLE_PROPRIETOR", // remove if low or standard
                    customerProfileBundleSid: createBrandRegistrationsDTO.customerProfileBundleSID,
                }
            );
        }
        console.log(brandRegistration.sid);
        return brandRegistration.sid;
    }

    // Sole proprietor 3.1
    async fetchBrandRegistrations(fetchBrandRegistrationDTO: FetchBrandRegistrationsDTO) {
        const brandRegistration = await this.client.messaging.v1
            .brandRegistrations(fetchBrandRegistrationDTO.brandRegistrationSID)
            .fetch();

        console.log(brandRegistration.sid);
        return brandRegistration.sid;
    }

    // Sole proprietor 3.2 [Optional] Retry OTP Verification for the submitted mobile number
    async createBrandRegistrationOtp(createBrandRegistrationOtp: CreateBrandRegistrationsOTP) {
        const brandRegistrationOtp = await this.client.messaging.v1
            .brandRegistrations(createBrandRegistrationOtp.brandRegistrationSID)
            .brandRegistrationOtps.create();

        console.log(brandRegistrationOtp.accountSid);
        return brandRegistrationOtp.accountSid;
    }

    //messaging service for standard and low-volume standard
    async createService() {
        const service = await this.client.messaging.v1.services.create({
            fallbackUrl: "https://www.example.com/fallback",
            friendlyName: "Acme, Inc.'s A2P 10DLC Messaging Service",
            inboundRequestUrl: "https://www.example.com/inbound-messages-webhook",
        });

        console.log(service.sid);
    }

    async fetchUsAppToPersonUsecase() {
        const usAppToPersonUsecase = await this.client.messaging.v1
            .services("MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
            .usAppToPersonUsecases.fetch({
                brandRegistrationSid: "BNXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
            });

        console.log(usAppToPersonUsecase.usAppToPersonUsecases);
    }

    // low and standard
    async createUsAppToPersonLowAndStandard() {
        const usAppToPerson = await this.client.messaging.v1
            .services("MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            .usAppToPerson.create({
                brandRegistrationSid: "BNaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                description: "Send marketing messages about sales and offers",
                hasEmbeddedLinks: true,
                hasEmbeddedPhone: true,
                messageFlow:
                    "End users opt in by visiting www.example.com, creating a new user account, consenting to receive marketing messages via text, and providing a valid mobile phone number.",
                messageSamples: ["Message Sample 1", "Message Sample 2"],
                usAppToPersonUsecase: "MARKETING",
            });

        console.log(usAppToPerson.sid);
    }

    //Sole proprietor 5
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

    //Sole proprietor 5.1
    async fetchUsAppToPerson() {
        const usAppToPerson = await this.client.messaging.v1
            .services("MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            .usAppToPerson("QE2c6890da8086d771620e9b13fadeba0b")
            .fetch();

        console.log(usAppToPerson.sid);
        return usAppToPerson.sid;
    }

    //Sole proprietor 5.2 DELETE A2P Messaging campaign use case
    async deleteUsAppToPerson() {
        await this.client.messaging.v1
            .services("MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
            .usAppToPerson("QE2c6890da8086d771620e9b13fadeba0b")
            .remove();
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