import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiQueryOptions, ApiTags } from "@nestjs/swagger";
import { Public } from "src/app/decorators/public.decorator";
import { Query as ExpressQuery } from 'express-serve-static-core';
import { WeatherForecastService } from "src/app/services/weatherforecast/weatherforecast.service";
import { WeatherForecastNotificationService } from "src/app/services/weatherforecast/weatherforecast.notification.service";
import { WeatherForecastNotificationDTO } from "src/app/dto/weatherforecast";


@ApiTags('weather')
@Controller('weather')
export class WeatherForecastController {
    constructor(
        private readonly weatherService: WeatherForecastService,
        private readonly weatherNotificationService: WeatherForecastNotificationService
    ) { }

    @ApiBearerAuth('Bearer')
    @Post('/create/user/notification')
    @ApiOperation({ summary: 'add weather notification details' })
    async addWeatherForecastNotificationData(@Req() request, @Body() weatherForecastDTO: WeatherForecastNotificationDTO) {
        const userId = request.user.sub;
        console.log()
        return await this.weatherNotificationService.addWeatherForecastNotificationData(
            userId,
            weatherForecastDTO.temperature,
            weatherForecastDTO.notificationType);
    }

    @ApiBearerAuth('Bearer')
    @Post('/create/user/notification/location')
    @ApiOperation({ summary: 'update location to be notified' })
    async updateWeatherForecastNotificationLocation(@Req() request, @Body() weatherForecastDTO: WeatherForecastNotificationDTO) {
        const userId = request.user.sub;
        console.log()
        return await this.weatherNotificationService.addWeatherForecastNotificationLocation(
            userId,
            weatherForecastDTO.updated_location
        );
    }

    @Public()
    @Get('/accuweather/daily')
    @ApiQuery({
        name: 'city',
        required: false,
        default: 'London',
    } as ApiQueryOptions)
    async getDailyAccuWeatherByCity(
        @Query() queries: ExpressQuery): Promise<object> {
        const response = await this.weatherService.accuweatherDaily(String(queries.city));

        return response;
    }

    @Public()
    @Get('/accuweather/hourly')
    @ApiQuery({
        name: 'city',
        required: false,
        default: 'London',
    } as ApiQueryOptions)
    async getHourlyAccuWeatherByCity(
        @Query() queries: ExpressQuery): Promise<object> {
        const response = await this.weatherService.accuweatherHourly(String(queries.city));

        return response;
    }


    @Public()
    @Get('/openweather/day')
    @ApiQuery({
        name: 'city',
        required: false,
        default: 'London',
    } as ApiQueryOptions)
    async getDailyyOpenweatherByCity(
        @Query() queries: ExpressQuery): Promise<object> {
        const response = await this.weatherService.openWeatherDay(String(queries.city));

        return response;
    }

    @Public()
    @Get('/openweather/daily')
    @ApiQuery({
        name: 'city',
        required: false,
        default: 'London',
    } as ApiQueryOptions)
    async getDayOpenweatherByCity(
        @Query() queries: ExpressQuery): Promise<object> {
        const response = await this.weatherService.openWeatherDaily(String(queries.city));

        return response;
    }
}