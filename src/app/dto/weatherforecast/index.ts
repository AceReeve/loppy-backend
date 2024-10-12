import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WeatherForecastNotificationDTO {
  @ApiProperty({
    description: 'Temperature set for notification',
  })
  @IsString()
  temperature?: string;

  @ApiProperty({})
  @IsString()
  notificationType?: 'daily' | 'weekly';
}

export class WeatherForecastUpdateDTO {
  @ApiProperty({
    description: 'Location you wanted to get the weather data',
  })
  @IsString()
  updated_location?: string;
}
