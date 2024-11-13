import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';
const gmail = google.gmail('v1');
@Injectable()
export class GmailService {
  private gmail = google.gmail('v1');
  private oauth2Client = new google.auth.OAuth2(
    process.env.TEST_GOOGLE_CLIENT_ID,
    process.env.TEST_GOOGLE_CLIENT_SECRET,
    process.env.TEST_GOOGLE_REDIRECT_URI, // Ensure this is correctly set
  );

  constructor() {}

  // Generate the authentication URL for user consent
  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline', // Important for obtaining a refresh token
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/pubsub'
      ],
      redirect_uri: process.env.TEST_GOOGLE_REDIRECT_URI,
    });
  }

  // Exchange authorization code for tokens
  async handleCallback(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);

    // Log tokens or save refresh_token securely
    console.log('Access Token:', tokens.access_token);

    console.log('Refresh Token:', tokens.refresh_token);
    
    // Optionally save the refresh token to environment or secure storage
    process.env.GOOGLE_REFRESH_TOKEN = tokens.refresh_token;
  }

  // Configure authentication with refresh token
  private getAuth() {

    const auth = new google.auth.OAuth2(
      process.env.TEST_GOOGLE_CLIENT_ID,
      process.env.TEST_GOOGLE_CLIENT_SECRET,
      process.env.TEST_GOOGLE_REDIRECT_URI,
    );
    // Set stored refresh token to obtain new access tokens as needed
    auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
    return auth;
  }

  // Watch Gmail mailbox for new emails
  async watchMailbox() {
    const auth = this.getAuth();
    try {
      const response = await this.gmail.users.watch({
        userId: 'me',
        requestBody: {
          labelIds: ['INBOX'],
          topicName: 'projects/prefab-passage-438215-n8/topics/customer-replied'
        },
        auth,
      });
      return response.data;
    } catch (error) {
      console.error('Error in watchMailbox:', error);
      console.error('Request body:', {
        labelIds: ['INBOX'],
        topicName: 'projects/prefab-passage-438215-n8/topics/customer-replied'
      });
      throw error; // This will allow the error to propagate to your AllExceptionsFilter
    }
  }
  

  // Retrieve replies to specific emails by emailId
  async getReply(emailId: string) {
    const auth = this.getAuth();
    const response = await this.gmail.users.messages.get({
      userId: 'me',
      id: emailId,
      auth,
    });
    return response.data;
  }

  // Send email via SMTP using Nodemailer
  async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587, // Adjust if necessary
      secure: false, // Use true for port 465, false for others
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

  async listMessages() {
    const auth = this.getAuth();
    const response = await this.gmail.users.messages.list({
      userId: 'me',
      labelIds: ['INBOX'],
      maxResults: 10, // Limit the number of messages for testing
      auth,
    });
  
    const messages = response.data.messages || []; // returns an array of { id, threadId }
    const messagesWithSubject = [];
  
    // Fetch the subject for each message
    for (const message of messages) {
      try {
        const messageDetails = await this.gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'full', // Get the full message including headers
          auth,
        });
  
        const subjectHeader = messageDetails.data.payload.headers.find(header => header.name === 'Subject');
        const subject = subjectHeader ? subjectHeader.value : 'No Subject';
  
        messagesWithSubject.push({
          id: message.id,
          threadId: message.threadId,
          subject: subject,
        });
      } catch (error) {
        console.error(`Error fetching message ${message.id}:`, error);
      }
    }
  
    return messagesWithSubject;
  }

  async replyToEmailWithGmailAPI(
    receiver: string,
    content: any,
    originalMessageId: string,
    threadId: string
  ) {
    const auth = this.getAuth();
    const emailLines = [
      `To: ${receiver}`,
      `Subject: ${content.subject}`,
      `Message-ID: <${originalMessageId}>`,
      `In-Reply-To: <${originalMessageId}>`,
      `References: <${originalMessageId}>`,
      'Content-Type: text/html; charset=UTF-8',
      'MIME-Version: 1.0',
      '',
      content.message,
    ];
    
    const email = emailLines.join('\n');
  
    const base64EncodedEmail = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
      console.log(receiver)
      console.log(originalMessageId)
      console.log(threadId)
      console.log(base64EncodedEmail)
    await gmail.users.messages.send({
      auth,
      userId: 'me',
      requestBody: {
        raw: base64EncodedEmail,
        threadId: threadId, 
      },
    });
  }
}
