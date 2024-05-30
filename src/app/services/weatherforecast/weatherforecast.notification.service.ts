import { Injectable } from "@nestjs/common";
import { WeatherForecastRepository } from "src/app/repository/weatherforecast/weatherforecast.repository";
import { UserService } from "../user/user.service";

@Injectable()
export class WeatherForecastNotificationService {

    constructor(
        private readonly repository: WeatherForecastRepository,
        private userService: UserService
    ) { }


    async addWeatherForecastNotificationData(user_id: string, temperature: string, notificationType: string
    ): Promise<any> {
        const weatherDataResponse = await this.repository.addWeatherForecastNotificationData(user_id, temperature, notificationType);
        this.userService.updateWeatherInfoId(weatherDataResponse._id, user_id);
        return weatherDataResponse;
    }

    async addWeatherForecastNotificationLocation(user_id: string, location: string
    ): Promise<any> {
        const updatedLocation = await this.repository.addWeatherForecastNotificationLocation(user_id, location);
        return updatedLocation;
    }
}
