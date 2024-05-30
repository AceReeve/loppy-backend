import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { WeatherForecast } from "src/app/models/weatherforecast/weatherforecast.schema"

@Injectable()
export class WeatherForecastRepository {
    constructor(
        @InjectModel(WeatherForecast.name) private weatherForecastModel: Model<WeatherForecast & Document>,
    ) { }

    async addWeatherForecastNotificationData(user_id: string, temperature: string, notificationType: string
    ): Promise<any> {
        const isExisting = await this.weatherForecastModel.findOne({ user_id: user_id });
        if (isExisting) {
            const weatherforecastLocation = await this.weatherForecastModel.findOneAndUpdate(
                { user_id: user_id },
                {
                    $set:
                    {
                        temperature: temperature,
                        notificationType: notificationType
                    }
                })
            return weatherforecastLocation
        } else {
            const weatherForecastDataCreated = await this.weatherForecastModel.create({
                user_id: user_id,
                temperature: temperature,
                notificationType: notificationType,
            })
            return weatherForecastDataCreated;
        }
    }

    async addWeatherForecastNotificationLocation(
        user_id: string,
        updated_location: string,
    ): Promise<any> {
        const weatherforecastLocation = await this.weatherForecastModel.findOneAndUpdate(
            { user_id: user_id },
            {
                $set:
                {
                    updatedLocation: updated_location,
                }
            })
        return weatherforecastLocation
    }

}