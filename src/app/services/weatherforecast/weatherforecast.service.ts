import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class WeatherForecastService {
  private weatherAPI: AxiosInstance;

  private weatherAPIurl: string = 'http://api.weatherapi.com/v1/';

  constructor(private configService: ConfigService) {
    this.weatherAPI = axios.create({
      baseURL: this.weatherAPIurl,
      params: {
        key: this.configService.get<string>('WEATHERAPI_KEY'),
      },
    });
  }

  async weatherAPIforecast(city: string, days: number) {
    try {
      const response = await this.weatherAPI.get('forecast.json', {
        params: {
          q: city,
          days: days,
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

  async weatherAPITimezone(city: string) {
    try {
      const response = await this.weatherAPI.get('timezone.json', {
        params: {
          q: city,
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
