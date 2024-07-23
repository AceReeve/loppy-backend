import { Module } from "@nestjs/common";
import { ConfigService } from "aws-sdk";
import { ServiceTitanController } from "src/app/controller/servicetitan/servicetitan.controller";
import { ServiceTitanService } from "src/app/services/servicetitan/servicetitan.service";

@Module({
    imports: [ServiceTitanModule],
    controllers: [ServiceTitanController],
    providers: [ServiceTitanService, ConfigService],
})
export class ServiceTitanModule { }	