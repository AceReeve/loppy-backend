import { Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiQueryOptions, ApiTags } from "@nestjs/swagger";
import { ServiceTitanService } from "src/app/services/servicetitan/servicetitan.service";
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Public } from "src/app/decorators/public.decorator";
import { ServiceTitanTokenDTO } from "src/app/dto/servicetitan";

@ApiTags('servicetitan')
@Controller('servicetitan')
export class ServiceTitanController {

    constructor(
        private readonly serviceTitanService: ServiceTitanService,
    ) { }


    @Get('/token')
    @Public()
    async getServiceTitanToken(): Promise<object> {
        const response = await this.serviceTitanService.requestToken();
        let token = new ServiceTitanTokenDTO;
        token.token = response;
        return token;
    }

    @Get('/customers')
    @Public()
    @ApiQuery({
        name: 'page',
        required: true,
        default: 1,
    } as ApiQueryOptions)
    @ApiQuery({
        name: 'pageSize',
        required: false,
        default: 1,
    } as ApiQueryOptions)
    @ApiQuery({
        name: 'token',
        required: true,
    } as ApiQueryOptions)
    async getServiceTitanCustomers(
        @Query() queries: ExpressQuery): Promise<object> {
        const response = await this.serviceTitanService.getServiceTitanCustomers(Number(queries.page), Number(queries.pageSize), String(queries.token));

        return response;
    }
}
