import { Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiQueryOptions, ApiTags } from "@nestjs/swagger";
import { ServiceTitanService } from "src/app/services/servicetitan/servicetitan.service";
import { Query as ExpressQuery } from 'express-serve-static-core';
import { Public } from "src/app/decorators/public.decorator";

@ApiTags('servicetitan')
@Controller('servicetitan')
export class ServiceTitanController {

    constructor(
        private readonly serviceTitanService: ServiceTitanService,
    ) { }


    @Post('/token')
    @Public()
    @ApiOperation({ summary: 'getToken' })
    async updateWeatherForecastNotificationLocation() {
        const axios = require('axios');
        const qs = require('qs');
        let data = qs.stringify({
            'grant_type': 'client_credentials',
            'client_id': 'cid.1fw0fulndbc2wdvdy2o7zueof',
            'client_secret': 'cs1.kplsyupeyqdmhp05f2la86aw82h5xo9jpn4bne7z6s686527kr'
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://auth.servicetitan.io/connect/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                console.log("1231231231234563534", JSON.stringify(response.data));
                return response;
            })
            .catch((error) => {
                console.log(error);
                return error;
            });
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
