// src/gmail/gmail.module.ts
import { Module } from '@nestjs/common';
import { GmailController } from 'src/app/controller/gmail/gmail.controller';
import { GmailService } from 'src/app/services/gmail/gmail.service';

@Module({
  controllers: [GmailController],
  providers: [GmailService],
})
export class GmailModule {}
