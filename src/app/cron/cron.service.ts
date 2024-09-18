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
import {
  WorkFlowAction,
  WorkFlowStatus,
  WorkFlowTrigger,
} from '../const/action';
import { SmsService } from 'src/config/sms/sms.service';

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
    private smsService: SmsService,
  ) {}

  async triggerData() {
    return await this.workFlowModel.find();
  }
  // @Cron('*/10 * * * * *')
  @Cron('0 0 * * *') // Runs every day at midnight
  async handleCron() {
    const workflows = await this.triggerData();

    for (const workflow of workflows) {
      if (workflow.status === WorkFlowStatus.PUBLISHED) {
        const { trigger, action } = workflow;

        for (const trig of trigger) {
          for (const act of action) {
            if (
              trig.trigger_name ===
              WorkFlowTrigger.WORKFLOW_TRIGGER_BIRHTDAY_REMINDER
            ) {
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
                    const receiverUser = await this.userModel.findOne({
                      _id: user.user_id,
                    });
                    const receiverUserInfo = await this.userInfoModel.findOne({
                      user_id: receiverUser._id,
                    });
                    if (
                      act.action_name === WorkFlowAction.WORKFLOW_ACTION_EMAIL
                    ) {
                      await this.emailerService.sendEmailBirthdayReminder(
                        receiverUser.email,
                        user.first_name,
                        act.content,
                      );
                    } else if (
                      act.action_name === WorkFlowAction.WORKFLOW_ACTION_SMS
                    ) {
                      await this.smsService.sendSmsBirthdayReminder(
                        receiverUserInfo.contact_no,
                        user.first_name,
                        act.content,
                      );
                    }
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
  }
}
