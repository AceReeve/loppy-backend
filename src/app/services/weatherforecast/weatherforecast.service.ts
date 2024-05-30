import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class WeatherForecastService {
    private openWeatherAPI: AxiosInstance;
    private accuWeatherAPI: AxiosInstance;
    private openWeatherAPIurl: string = "https://api.openweathermap.org/data/2.5/";
    private accuWeatherAPIurl: string = "http://dataservice.accuweather.com/";

    constructor(private configService: ConfigService) {
        this.openWeatherAPI = axios.create({
            baseURL: this.openWeatherAPIurl,
            // baseURL: this.accuweatherAPIurl,
            params: {
                APPID: this.configService.get<string>('WEATHERFORCAST_KEY'),
                // apikey: this.configService.get<string>('ACCUWEATHER_KEY'),
            },
        });

        this.accuWeatherAPI = axios.create({
            // baseURL: this.weatherAPIurl,
            baseURL: this.accuWeatherAPIurl,
            params: {
                // APPID: this.configService.get<string>('WEATHERFORCAST_KEY'),
                apikey: this.configService.get<string>('ACCUWEATHER_KEY'),
            },
        });

    }

    async openWeatherDay(city: string) {
        try {
            const response = await this.openWeatherAPI.get('weather', {
                params: {
                    q: city,
                    units: "metric",
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

    async openWeatherDaily(city: string) {
        try {
            const response = await this.openWeatherAPI.get('forecast', {
                params: {
                    q: city,
                    units: "metric",
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


    async accuweatherDaily(city: string) {
        try {
            const getCityKey = await this.accuWeatherAPI.get('/locations/v1/cities/search', {
                params: {
                    q: city,
                    language: "en-us",
                },
            });

            const getAccuweatherDaily = await this.accuWeatherAPI.get('/forecasts/v1/daily/5day/' + getCityKey.data[0].Key, {
                params: {
                    q: city,
                    language: "en-us",
                    metric: true
                },
            });
            return getAccuweatherDaily.data;
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    }

    async accuweatherHourly(city: string) {
        try {
            const getCityKey = await this.accuWeatherAPI.get('/locations/v1/cities/search', {
                params: {
                    q: city,
                    language: "en-us",
                },
            });

            const getAccuweatherDaily = await this.accuWeatherAPI.get('/forecasts/v1/hourly/12hour/' + getCityKey.data[0].Key, {
                params: {
                    q: city,
                    language: "en-us",
                    metric: true
                },
            });
            return getAccuweatherDaily.data;
        } catch (error) {
            return {
                success: false,
                message: error,
            };
        }
    }

}
