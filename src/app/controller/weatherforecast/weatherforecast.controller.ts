import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiQueryOptions, ApiTags } from "@nestjs/swagger";
import { Public } from "src/app/decorators/public.decorator";
import { Query as ExpressQuery } from 'express-serve-static-core';
import { WeatherForecastService } from "src/app/services/weatherforecast/weatherforecast.service";
import { WeatherForecastNotificationService } from "src/app/services/weatherforecast/weatherforecast.notification.service";
import { WeatherForecastNotificationDTO, WeatherForecastUpdateDTO } from "src/app/dto/weatherforecast";


@ApiTags('weather')
@Controller('weather')
export class WeatherForecastController {
    constructor(
        private readonly weatherService: WeatherForecastService,
        private readonly weatherNotificationService: WeatherForecastNotificationService
    ) { }

    @ApiBearerAuth('Bearer')
    @Post('/create/user/notification/data')
    @ApiOperation({ summary: 'add weather notification details' })
    async addWeatherForecastNotificationData(@Req() request, @Body() weatherForecastDTO: WeatherForecastNotificationDTO) {
        const userId = request.user.sub;
        const response = await this.weatherNotificationService.addWeatherForecastNotificationData(
            userId,
            weatherForecastDTO.temperature,
            weatherForecastDTO.notificationType);
        return response;
    }

    @ApiBearerAuth('Bearer')
    @Post('/update/user/location')
    @ApiOperation({ summary: 'update location to be notified' })
    async updateWeatherForecastNotificationLocation(@Req() request, @Body() weatherForecastUpdateDTO: WeatherForecastUpdateDTO) {
        const userId = request.user.sub;
        const response = await this.weatherNotificationService.addWeatherForecastNotificationLocation(
            userId,
            weatherForecastUpdateDTO.updated_location
        );
        return response;
    }

    @ApiBearerAuth('Bearer')
    @Get('/notification/data')
    async getNotificationData(@Req() request): Promise<object> {
        const userId = request.user.sub;
        const response = await this.weatherNotificationService.getWeatherNotificationData(userId);

        return response;
    }

    @Public()
    @Get('/forecast')
    @ApiQuery({
        name: 'city',
        required: true,
        default: 'London',
    } as ApiQueryOptions)
    @ApiQuery({
        name: 'days',
        required: false,
        default: 1,
    } as ApiQueryOptions)
    async getWeatherAPIforecast(
        @Query() queries: ExpressQuery): Promise<object> {
        const response = await this.weatherService.weatherAPIforecast(String(queries.city), Number(queries.days));

        return response;
    }
}