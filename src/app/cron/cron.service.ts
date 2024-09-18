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
import { UserRepository } from '../repository/user/user.repository';
import {
  InvitedUser,
  InvitedUserDocument,
} from '../models/invited-users/invited-users.schema';

@Injectable()
export class CronService {
  constructor(
    @InjectModel(WorkFlow.name)
    private workFlowModel: Model<WorkFlowDocument>,
    @InjectModel(UserInfo.name)
    private userInfoModel: Model<UserInfoDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(InvitedUser.name)
    private invitedUserModel: Model<InvitedUserDocument>,
    private emailerService: EmailerService,
    private smsService: SmsService,
    protected readonly userRepository: UserRepository,
  ) {}

  async triggerData() {
    return await this.workFlowModel.find();
  }
  // @Cron('*/10 * * * * *')
  @Cron('0 0 * * *') // Runs every day at midnight
  async handleCron() {
    const workflows = await this.triggerData();
    console.log('1111', workflows);
    for (const workflow of workflows) {
      console.log('workflow', workflow);

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

            if (
              trig.trigger_name ===
              WorkFlowTrigger.WORKFLOW_TRIGGER_CUSTOM_DATE_REMINDER
            ) {
              // Get today's date without the year
              const triggerDate = trig.content.find((item) => item.date)?.date;
              if (triggerDate) {
                const formattedTriggerDate =
                  moment(triggerDate).format('MM-DD');
                const today = moment().format('MM-DD');

                if (formattedTriggerDate === today) {
                  const invitedUsers = await this.invitedUserModel.find({
                    invited_by: workflow.created_by,
                  });
                  const allFilteredEmail = invitedUsers.flatMap((invitedUser) =>
                    invitedUser.users.map((user) => user.email),
                  );
                  const users = await this.userModel.find({
                    email: { $in: allFilteredEmail },
                  });

                  for (const act of action) {
                    if (
                      act.action_name === WorkFlowAction.WORKFLOW_ACTION_EMAIL
                    ) {
                      await this.emailerService.sendEmailCustomDateRemider(
                        'RyuunosukeIchijo@gmail.com',
                        act.content,
                      );
                      for (const user of users) {
                        await this.emailerService.sendEmailCustomDateRemider(
                          user.email,
                          act.content,
                        );
                      }
                    }
                  }
                }
              }
              return 'success test';
            }
          }
        }
      }
    }
  }
}
