import { Controller, Post, Body , Get, Query, Res} from '@nestjs/common';
import { Public } from 'src/app/decorators/public.decorator';
import { GmailService } from 'src/app/services/gmail/gmail.service';

@Public()
@Controller('webhook')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Post()
  async handleNotification(@Body() body: any) {
    const messageId = body.message?.data;
    if (messageId) {
      const reply = await this.gmailService.getReply(messageId);
      console.log('Received reply:', reply);
    }
    return { status: 'success' };
  }

  @Get('login')
  login(@Res() res) {
    const url = this.gmailService.generateAuthUrl();
    console.log('Generated Auth URL:', url);
    res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res) {
    await this.gmailService.handleCallback(code);
    res.send('Authentication successful! You can close this window.');
  }

}
