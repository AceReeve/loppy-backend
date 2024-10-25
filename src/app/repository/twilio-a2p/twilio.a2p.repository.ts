import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { stringMap } from "aws-sdk/clients/backup";
import { Model, ObjectId } from "mongoose";
import { CreateA2PTwilioEntryDTO } from "src/app/dto/api/stripe";
import { TwilioA2P } from "src/app/models/twilio/twilio.a2p.schema";


@Injectable()
export class TwilioA2PRepository {

    constructor(
        @InjectModel(TwilioA2P.name) private twilioA2PModel: Model<TwilioA2P & Document>,
    ) { }

    async createTwilioA2PEntry(customerProfileSID: string, accountSID: string
    ): Promise<any> {
        const twilioA2PEntry = await this.twilioA2PModel.create({ secondary_customer_profile_sid: customerProfileSID, account_sid: accountSID })
        return twilioA2PEntry
    }

    async updateTwilioA2PEntry(createTwilioA2PEntryDTO: CreateA2PTwilioEntryDTO
    ): Promise<any> {
        const twilioA2PEntry = await this.twilioA2PModel.findOneAndUpdate(
            { secondary_customer_profile_sid: createTwilioA2PEntryDTO.secondaryCustomerProfileSID },
            {
                $set:
                {
                    account_sid: createTwilioA2PEntryDTO.accountSID,
                    secondary_customer_profile_sid: createTwilioA2PEntryDTO.secondaryCustomerProfileSID,
                    end_user_customer_profile_sid: createTwilioA2PEntryDTO.endUserCustomerProfileSID,
                    end_user_authorized_representative_sid: createTwilioA2PEntryDTO.endUserAuthorizedRepresentativeSID,
                    supporting_document_sid: createTwilioA2PEntryDTO.supportinDocumentSID,
                    secondary_customer_profile_status: createTwilioA2PEntryDTO.secondaryCustomerProfileStatus,
                    trust_product_sid: createTwilioA2PEntryDTO.trustProductSID,
                    trust_product_end_user_sid: createTwilioA2PEntryDTO.trustProductEndUserSID,
                    trust_product_status: createTwilioA2PEntryDTO.trustProductStatus,
                    messaging_service_sid: createTwilioA2PEntryDTO.messagingServiceSID,
                    brand_sid: createTwilioA2PEntryDTO.brandSID,
                    campaign_sid: createTwilioA2PEntryDTO.campaignSID,
                    full_name: createTwilioA2PEntryDTO.fullName,
                    email: createTwilioA2PEntryDTO.email,
                    overall_status: createTwilioA2PEntryDTO.overAllStatus,
                }
            })
        return twilioA2PEntry;
    }

    async findByCustomerProfileSID(customerProfileSID: string) {
        const twilioA2Pdetails = await this.twilioA2PModel.findOne({ secondary_customer_profile_sid: customerProfileSID })
        return twilioA2Pdetails;
    }

    async findByAccountSID(accountSID: string) {
        const twilioA2Pdetails = await this.twilioA2PModel.findOne({ account_sid: accountSID })
        return twilioA2Pdetails;
    }
}
