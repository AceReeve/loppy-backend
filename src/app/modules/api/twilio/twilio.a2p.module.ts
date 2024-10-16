import { Global, Module } from "@nestjs/common";
import { TwilioA2PController } from "src/app/controller/api/twilio/twilio.a2p.controller";
import { TwilioA2PSchemaModule } from "src/app/models/twilio/twilio.a2p.schema.module";
import { TwilioA2PRepository } from "src/app/repository/twilio-a2p/twilio.a2p.repository";
import { TwilioA2PService } from "src/app/services/api/twilio/twilio.a2p.service";

@Global()
@Module({
    imports: [
        TwilioA2PSchemaModule
    ],
    controllers: [TwilioA2PController],
    providers: [
        TwilioA2PRepository,
        TwilioA2PService
    ],

    exports: [
    ],
})
export class TwilioA2PModule { }