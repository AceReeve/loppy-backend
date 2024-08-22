// import { forwardRef } from '@nestjs/common';
// import { TwilioService } from 'src/app/services/api/twilio/twilio.service';
// import { Twilio } from 'twilio';
// import { TwilioClient } from 'src/app/const';

// export const twilioClientProvider = {
//     provide: TwilioClient.TWILIO_CLIENT,
//     useFactory: async (twilioService: TwilioService) => {
//         const twilioInfo = await twilioService.getTwilioInfo();
//         console.log('twilioInfo', twilioInfo);

//         if (!twilioInfo) {
//             throw new Error('Twilio information not found');
//         }
//         const accountSid = twilioInfo.ssid;
//         const authToken = twilioInfo.auth_token;
//         console.log('accountSid', accountSid);
//         console.log('authToken', authToken);

//         if (!accountSid || !authToken) {
//             throw new Error('Twilio account SID and auth token must be provided');
//         }
//         return new Twilio(accountSid, authToken);
//     },
//     inject: [forwardRef(() => TwilioService)] as any[],
// } as const;
