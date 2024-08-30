import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import {
  WorkFlow,
  WorkFlowDocument,
} from '../models/work-flow/work-flow.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from '../models/user/user.schema';
import { UserInfo, UserInfoDocument } from '../models/user/user-info.schema';
import * as moment from 'moment';
import { EmailerService } from '@util/emailer/emailer';
import { WorkFlowAction } from '../const/action';

@Injectable()
export class CronService {
  constructor(
    @InjectModel(WorkFlow.name)
    private workFlowModel: Model<WorkFlowDocument>,
    @InjectModel(UserInfo.name)
    private userInfoModel: Model<UserInfoDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private emailerService: EmailerService,
  ) {}

  async triggerData() {
    return await this.workFlowModel.find();
  }
  // @Cron('*/10 * * * * *')
  @Cron('0 0 * * *') // Runs every day at midnight
  async handleCron() {
    const workflows = await this.triggerData();

    for (const workflow of workflows) {
      const { trigger, action } = workflow;

      for (const trig of trigger) {
        if (trig.trigger_name === WorkFlowAction.BIRHTDAY_REMINDER) {
          // if (Array.isArray(trig.content) && trig.content.length > 0) {
          //   if (Array.isArray(trig.content)) {
          // Get today's date without the year
          const today = moment().format('MM-DD');
          // Find users whose birthday matches today's month and day
          const usersWithBirthdays = await this.userInfoModel.aggregate([
            {
              $addFields: {
                formattedBirthday: {
                  $dateToString: { format: '%m-%d', date: '$birthday' },
                },
              },
            },
            {
              $match: {
                formattedBirthday: today,
              },
            },
          ]);
          for (const act of action) {
            if (act.action_name === 'Send Email') {
              for (const user of usersWithBirthdays) {
                const receiver = await this.userModel.findOne({
                  _id: user.user_id,
                });
                await this.emailerService.sendEmailBirthdayReminder(
                  receiver.email,
                  user.first_name,
                  act.content,
                );
              }
            }
          }
          //   } else {
          //   }
        }
      }
    }
  }
}
