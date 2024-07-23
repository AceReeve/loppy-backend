import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class ServiceTitanService {
    private serviceTitanAPI: AxiosInstance;

    private serviceTitanUrl: string = "https://api.servicetitan.io/crm/v2";
    private serviceTitanTokenUrl: string = "https://auth.servicetitan.io/connect/token/";

    constructor(private configService: ConfigService) {

        this.serviceTitanAPI = axios.create({
            baseURL: this.serviceTitanUrl,
            headers: {
                'ST-App-Key': this.configService.get<string>('SERVICE_TITAN_APPLICATION_KEY')
            },
        });

    }



    async requestToken(): Promise<any> {
        try {
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

            const response = await axios.request(config);
            return response.data.requestToken;
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }


    async getServiceTitanCustomers(page: number, pageSize: number, token: string): Promise<any> {
        try {
            const response = await this.serviceTitanAPI.get('/tenant/' + this.configService.get<string>('SERVICE_TITAN_TENANT') + '/customers', {
                headers: {
                    Authorization: 'Bearer' + ' ' + token,
                },
                params: {
                    page: page,
                    pageSize: pageSize,
                },
            });
            return response.data;
        } catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }

}
