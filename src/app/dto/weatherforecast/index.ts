import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class WeatherForecastNotificationDTO {
    @ApiProperty({
        description: 'Temperature set for notification',
    })
    @IsString()
    temperature?: string;

    @ApiProperty({
        example: 'essential',
        description:
            'Type of subscription. Can be `essential`, `professional`, or `corporate`',
    })
    @IsString()
    notificationType?: 'daily' | 'weekly';

    @ApiProperty({
        description: 'Location you wanted to get the weather data',
    })
    @IsString()
    updated_location?: string;
}