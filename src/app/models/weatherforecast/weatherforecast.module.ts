import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WeatherForecastController } from 'src/app/controller/weatherforecast/weatherforecast.controller';
import { AbstractUserRepository } from 'src/app/interface/user';
import { WeatherForecastSchemaModule } from 'src/app/models/weatherforecast/weatherforecast.schema.module';
import { UserModule } from 'src/app/modules/user/user.module';
import { WeatherForecastRepository } from 'src/app/repository/weatherforecast/weatherforecast.repository';
import { UserService } from 'src/app/services/user/user.service';
import { WeatherForecastNotificationService } from 'src/app/services/weatherforecast/weatherforecast.notification.service';
import { WeatherForecastService } from 'src/app/services/weatherforecast/weatherforecast.service';

@Module({
  imports: [WeatherForecastModule, WeatherForecastSchemaModule, UserModule],
  controllers: [WeatherForecastController],
  providers: [
    WeatherForecastService,
    ConfigService,
    WeatherForecastNotificationService,
    WeatherForecastRepository,
    UserService,
  ],
})
export class WeatherForecastModule {}
