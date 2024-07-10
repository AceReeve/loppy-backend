import { Injectable } from "@nestjs/common";
import { WeatherForecastRepository } from "src/app/repository/weatherforecast/weatherforecast.repository";
import { UserService } from "../user/user.service";
import { WeatherForecastService } from "./weatherforecast.service";

@Injectable()
export class WeatherForecastNotificationService {

    constructor(
        private readonly repository: WeatherForecastRepository,
        private weatherForecastService: WeatherForecastService,
        private userService: UserService
    ) { }


    async addWeatherForecastNotificationData(user_id: string, temperature: string, notificationType: string
    ): Promise<any> {
        try {
            const weatherDataResponse = await this.repository.addWeatherForecastNotificationData(user_id, temperature, notificationType);
            this.userService.updateWeatherInfoId(weatherDataResponse._id, user_id);
            return weatherDataResponse;
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }

    }

    async addWeatherForecastNotificationLocation(user_id: string, location: string
    ): Promise<any> {
        try {
            const responseOnTimeZone = await this.weatherForecastService.weatherAPITimezone(location);
            console.log("1231231212", responseOnTimeZone)
            const updatedLocation = await this.repository.addWeatherForecastNotificationLocation(user_id, responseOnTimeZone.location.name);
            return updatedLocation;
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }

    }


    async getWeatherNotificationData(user_id: string
    ): Promise<any> {
        try {
            const updatedLocation = await this.repository.getWeatherNotificationData(user_id);
            return updatedLocation;
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }

    }
}
