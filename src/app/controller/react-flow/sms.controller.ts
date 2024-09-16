import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SmsDto } from 'src/app/dto/work-flow';
import { SmsService } from 'src/config/sms/sms.service';

@Controller('sms')
@ApiBearerAuth('Bearer')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  async sendSms(@Body() dto: SmsDto): Promise<any> {
    const { to, message } = dto;
    await this.smsService.sendSms(to, message);
  }

  @Get('status/:sid')
  @ApiQuery({
    name: 'sid',
    description: 'folder id',
    example: '66b462060sade61af2e68dasd',
    required: false,
  })
  async getMessageStatus(@Query('sid') sid: string): Promise<any> {
    try {
      const status = await this.smsService.getMessageStatus(sid);
      return {
        success: true,
        data: status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
