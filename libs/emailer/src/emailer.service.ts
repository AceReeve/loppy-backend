import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import { join } from 'path';
@Injectable()
export class EmailerService {
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(EmailerService.name);

  private baseUrl = this.configService.get<string>('BASE_URL');

  private serviHeroTestEmail = this.configService.get<string>(
    'SERVICE_HERO_EMAIL_NOTIF_TESTING_ADDRESS',
  );

  private logo = path.join('src/config/mail/templates/logo.png');

  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<string> {
    const templatePath = join(
      __dirname,
      '../../../config/mail/templates',
      `${templateName}.hbs`,
    );
    const source = fs.readFileSync(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    return template(context);
  }

  async inviteUser(
    email: string,
    access_token: string,
    role_name?: string,
  ): Promise<any> {
    const link = `http://sandbox.servihero.com/auth/register?token=${access_token}`;
    try {
      await this.mailerService.sendMail({
        to: [email, this.serviHeroTestEmail],
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

  async sendOTP(email: string, otp: string) {
    const attachments = [
      {
        filename: 'logo.png',
        path: this.logo,
        cid: 'logo',
      },
    ];
    try {
      const context = {
        otp,
      };
      const html = await this.renderTemplate('otp-email-notification', {
        context,
      });

      const temp = await this.mailerService.sendMail({
        to: [email, this.serviHeroTestEmail],
        subject: `OTP Security code`,
        html,
        attachments,
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
        to: [email, this.serviHeroTestEmail],
        subject: `Reset your Password`,
        html: `We received a request to reset the password for your account. To proceed with the password reset, please follow the link below: <br><a href="${link}">Password Reset</a><br><br> If you did not request this change, you can safely ignore this email. Your password will remain unchanged.<br> Thank you.`,
      });
    } catch (error) {
      const errorMessage = 'Error Sending invite';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async sendEmailNotification(
    receiver: string,
    first_name: string,
    content: any,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: [receiver, this.serviHeroTestEmail],
        subject: content.subject,
        html: content.message,
      });
    } catch (error) {
      const errorMessage = 'Error Sending Email Notification';

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
      await this.mailerService.sendMail({
        to: [receiver, this.serviHeroTestEmail],
        subject: `Reminder`,
        html: finalContent,
      });
    } catch (error) {
      const errorMessage = 'Error Mesage';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async sendEmailWeatherReminder(
    receiver: string,
    first_name: string,
    content: any,
  ): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: [receiver, this.serviHeroTestEmail],
        subject: content.subject,
        html: content.message,
      });
    } catch (error) {
      const errorMessage = 'Error Weather Message';

      this.logger.error(errorMessage, error);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
