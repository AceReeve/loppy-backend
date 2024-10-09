import { Global, Module } from "@nestjs/common";
import { TwilioA2PController } from "src/app/controller/api/twilio/twilio.a2p.controller";
import { TwilioA2PService } from "src/app/services/api/twilio/twilio.a2p.service";

@Global()
@Module({
    imports: [
    ],
    controllers: [TwilioA2PController],
    providers: [
        TwilioA2PService
    ],

    exports: [
    ],
})
export class TwilioA2PModule { }