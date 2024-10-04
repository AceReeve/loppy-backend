import { Global, Module } from "@nestjs/common";
import { TwilioComplianceController } from "src/app/controller/api/twilio/twilio.compliance.controller";
import { TwilioComplianceService } from "src/app/services/api/twilio/twilio.compliance.service";

@Global()
@Module({
    imports: [
    ],
    controllers: [TwilioComplianceController],
    providers: [
        TwilioComplianceService
    ],

    exports: [
    ],
})
export class TwilioComplianceModule { }