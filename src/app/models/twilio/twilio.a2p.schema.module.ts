import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TwilioA2P, TwilioA2PSchema } from "./twilio.a2p.schema";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TwilioA2P.name, schema: TwilioA2PSchema }]),
    ],
    exports: [MongooseModule],
})
export class TwilioA2PSchemaModule { }
