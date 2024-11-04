import { Controller, Post, Body , Get, Query, Res} from '@nestjs/common';
import { Public } from 'src/app/decorators/public.decorator';
import { GmailService } from 'src/app/services/gmail/gmail.service';

@Public()
@Controller('google')
  export class GmailController {
    constructor(private readonly gmailService: GmailService) {}
  
    // Route to generate Google OAuth2 authorization URL
    @Get('generate-auth-url')
    generateAuthUrl() {
      const authUrl = this.gmailService.generateAuthUrl();
      console.log('Visit this URL to authorize:', authUrl);
      return { url: authUrl };
    }
  
    // Route to handle callback after authorization
    @Get('auth/callback')
    async handleCallback(@Query('code') code: string) {
      await this.gmailService.handleCallback(code);
      return { message: 'Tokens obtained and printed in the console.' };
    }
  
    // Route to send a test email
    @Get('send-email')
    async sendTestEmail(@Query('to') to: string) {
      const subject = 'Test Email from NestJS';
      const text = 'Hello! This is a test email from your NestJS app.';
      await this.gmailService.sendEmail(to, subject, text);
      return { message: 'Email sent successfully' };
    }
  
    // Route to watch Gmail inbox for new messages
    @Get('watch-mailbox')
    async watchMailbox() {
      const response = await this.gmailService.watchMailbox();
      console.log('Watch mailbox response:', response);
      return response;
    }
  
    // Route to check replies to a specific email by email ID
    @Get('get-reply')
    async getReply(@Query('emailId') emailId: string) {
      const response = await this.gmailService.getReply(emailId);
      console.log('Reply details:', response);
      return response;
    }

    @Get('list-messages')
async listMessages() {
  const messages = await this.gmailService.listMessages();
  console.log('Messages:', messages);
  return messages;
}
}
