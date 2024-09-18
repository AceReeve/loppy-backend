import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailerService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(EmailerService.name);

  private baseUrl = this.configService.get<string>('BASE_URL');

  // private userType = {
  //   default: 1,
  // };

  // private nodeEnv = process.env.NODE_ENV;
  // private append =
  //   this.nodeEnv === 'dev' || this.nodeEnv === 'local' ? ' **TEST ONLY**' : '';

  private serviHeroTestEmail = this.configService.get<string>(
    'SERVICE_HERO_EMAIL_NOTIF_TESTING_ADDRESS',
  );
  // private sendEmail(
  //   email: string[] | string | undefined,
  //   type?: number,
  // ): string | string[] {
  //   if (this.nodeEnv === 'local' || this.nodeEnv === 'dev') {
  //     let testEmailToSend: string = '';
  //     switch (type) {
  //       case this.userType.default:
  //         if (!this.serviHeroTestEmail) {
  //           throw new Error('Invalid test email address');
  //         }
  //         testEmailToSend = this.serviHeroTestEmail;
  //         break;
  //       default:
  //         break;
  //     }
  //     return testEmailToSend;
  //   }
  // }

  async inviteUser(
    email: string,
    access_token: string,
    role_name?: string,
  ): Promise<any> {
    const link = `http://sandbox.servihero.com/auth/register?token=${access_token}`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `You are invited testing`,
        html: `Hello, <br><br> You are invited to join our platform as a ${role_name}. Please click on the link below to accept your invitation:
                      <br><a href="${link}">Accept Invitation</a><br><br> If you did not request this invitation, please ignore this email.`,
      });
    } catch (error) {
      const errorMessage = 'Error Sending invite';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async sendOTP(email: string, otp: string): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Your OTP Code`,
        html: `Your OTP code is ${otp}`,
      });
    } catch (error) {
      const errorMessage = 'Error Sending code';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async forgotPassword(email: string, access_token: string): Promise<any> {
    const link = `${this.baseUrl}/auth/reset-password?token=${access_token}`;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Reset your Password`,
        html: `We received a request to reset the password for your account. To proceed with the password reset, please follow the link below: <br><a href="${link}">Password Reset</a><br><br> If you did not request this change, you can safely ignore this email. Your password will remain unchanged.<br> Thank you.`,
      });
    } catch (error) {
      const errorMessage = 'Error Sending invite';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async sendEmailBirthdayReminder(
    receiver: string,
    first_name: string,
    content: string,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: receiver,
        subject: `Happy Birthday ${first_name}`,
        html: `Happy Birthday ${first_name} <br>
        ${content}
        `,
      });
    } catch (error) {
      const errorMessage = 'Error BirthDay Mesage';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async sendEmailCustomDateRemider(
    receiver: string,
    additionalDetails: string,
    recipientName: string,
    yourName: string,
  ): Promise<any> {
    try {
      const content = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reminder</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f8f9fa;
                  margin: 0;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: auto;
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #333;
              }
              p {
                  color: #555;
                  line-height: 1.6;
              }
              .footer {
                  margin-top: 20px;
                  font-size: 0.9em;
                  color: #777;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Reminder Notification</h1>
              <p>Dear ${recipientName},</p>
              <p>This is a friendly reminder:</p>
              <p>${additionalDetails}</p>
              <p>Thank you!</p>
              <p>Best regards,<br>${yourName}</p>
              <div class="footer">
                  <p>If you have any questions, feel free to contact us.</p>
              </div>
          </div>
      </body>
      </html>
      `;
      const finalContent = content
        .replace('${recipientName}', recipientName)
        .replace('${additionalDetails}', content)
        .replace('${yourName}', yourName);
      const serviHeroTestEmail = this.configService.get<string>(
        'SERVICE_HERO_EMAIL_NOTIF_TESTING_ADDRESS',
      );
      await this.mailerService.sendMail({
        to: [receiver, serviHeroTestEmail],
        subject: `Reminder`,
        html: finalContent,
      });
    } catch (error) {
      const errorMessage = 'Error Mesage';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
