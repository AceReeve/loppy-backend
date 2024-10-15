import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

@Injectable()
export class GmailService {
  private gmail = google.gmail('v1');
  private oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI, // Ensure this is correctly set
  );

  constructor() {}

  // Generate the authentication URL
  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // Important for obtaining a refresh token
      scope: ['https://www.googleapis.com/auth/gmail.readonly'], 
      redirect_uri: process.env.TEST_GOOGLE_REDIRECT_URI,
    });
  }

  // Handle the callback to obtain tokens
  async handleCallback(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
  }

  private getAuth() {
    const auth = new google.auth.OAuth2(
      process.env.TEST_GOOGLE_CLIENT_ID,
      
      process.env.TEST_GOOGLE_CLIENT_SECRET,
      process.env.TEST_GOOGLE_REDIRECT_URI,
    );

    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    
    return auth;
  }

  async watchMailbox() {
    const auth = this.getAuth();
    const response = await this.gmail.users.watch({
      userId: 'me',
      requestBody: {
        labelIds: ['INBOX'],
        topicName: process.env.PUBSUB_TOPIC,
      },
      auth,
    });
    return response.data;
  }

  async getReply(emailId: string) {
    const auth = this.getAuth();
    const response = await this.gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      auth,
    });
    return response.data;
  }

  async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587, // Change if necessary
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_NO_REPLY_ADDRESS,
      to,
      subject,
      text,
    });

    return info;
  }
}
