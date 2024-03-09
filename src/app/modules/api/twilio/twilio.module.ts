import { Module, Global } from '@nestjs/common';
import { TwilioService } from 'src/app/services/api/twilio/twilio.service';
import { Twilio } from 'twilio';
import { TwilioClient } from 'src/app/const';
import { TwilioController } from 'src/app/controller/api/twilio/twilio.controller';

@Global()
@Module({
  providers: [
    {
      provide: TwilioClient.TWILIO_CLIENT,
      useFactory: () => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        if (!accountSid || !authToken) {
          throw new Error('Twilio account SID and auth token must be provided');
        }
        return new Twilio(accountSid, authToken);
      },
    },
    TwilioService,
  ],
  controllers: [TwilioController],
  exports: [TwilioService],
})
export class TwilioModule {}
