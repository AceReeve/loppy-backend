import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { TwilioA2P } from "src/app/models/twilio/twilio.a2p.schema";


@Injectable()
export class TwilioA2PRepository {

    constructor(
        @InjectModel(TwilioA2P.name) private twilioA2PModel: Model<TwilioA2P & Document>,
    ) { }

    async createTwilioA2PEntry(customerProfileSID: string
    ): Promise<any> {
        const twilioA2PEntry = await this.twilioA2PModel.create({ customer_profile_sid: customerProfileSID })
        return twilioA2PEntry
    }

    async updateTwilioA2PEntry(
        customerProfileSID: string,
        accountSID: string,
        endUserSID: string,
        endUserType: string,
        fullName: string,
        email: string,
        status: string,
    ): Promise<any> {
        const twilioA2PEntry = await this.twilioA2PModel.findOneAndUpdate(
            { customer_profile_sid: customerProfileSID },
            {
                $set:
                {
                    customer_profile_sid: customerProfileSID,
                    account_sid: accountSID,
                    end_user_sid: endUserSID,
                    end_user_type: endUserType,
                    full_name: fullName,
                    email: email,
                    status: status
                }
            })
        return twilioA2PEntry;
    }

    async findByCustomerProfileSID(customerProfileSID: string) {
        const twilioA2Pdetails = await this.twilioA2PModel.findOne({ customer_profile_sid: customerProfileSID })
        return twilioA2Pdetails;
    }
}
