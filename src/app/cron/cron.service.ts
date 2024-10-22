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
import { ConfigService } from '@nestjs/config';
import { ServiceTitanService } from '../services/service-titan/service-titan.service';

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
    private readonly configService: ConfigService,
    private readonly serviceTitan: ServiceTitanService,
  ) {}

  async triggerData() {
    return await this.workFlowModel.find();
  }
  private applyFilters(userBirthday: Date, filters: any[]): boolean {
    const today = moment();
    const birthday = moment(userBirthday);
    let dayFilter = null;
    let monthFilter = null;

    for (const filter of filters) {
      const { filter: filterName, value } = filter;
      if (filterName === 'Before') {
        const daysBefore = parseInt(value, 10);
        const beforeDate = today.clone().add(daysBefore, 'days');
        if (birthday.isBefore(beforeDate, 'day')) {
          return true;
        }
      }

      if (filterName === 'After') {
        const daysAfter = parseInt(value, 10);
        const afterDate = today.clone().subtract(daysAfter, 'days');
        if (birthday.isAfter(afterDate, 'day')) {
          return true;
        }
      }

      if (filterName === 'Day') {
        dayFilter = parseInt(value, 10);
      }
      if (filterName === 'Month') {
        monthFilter = moment().month(value).month();
      }

      if (dayFilter !== null && monthFilter !== null) {
        if (birthday.date() === dayFilter && birthday.month() === monthFilter) {
          return true;
        }
      }

      if (dayFilter !== null) {
        if (birthday.date() === dayFilter && birthday.month() === monthFilter) {
          return true;
        }
      }

      if (monthFilter !== null) {
        if (
          birthday.month() === monthFilter &&
          birthday.isSameOrAfter(today, 'day')
        ) {
          return true;
        }
      }
    }

    return false;
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
            // WORKFLOW_TRIGGER_BIRHTDAY_REMINDER
            if (
              trig.node_name ===
              WorkFlowTrigger.WORKFLOW_TRIGGER_BIRHTDAY_REMINDER
            ) {
              const users = await this.userInfoModel.find();
              for (const user of users) {
                // Apply the filters to the user's birthday
                if (this.applyFilters(user.birthday, trig.content.filters)) {
                  // If filters are valid, send the notifications
                  if (act.node_name === WorkFlowAction.WORKFLOW_ACTION_EMAIL) {
                    const receiverUser = await this.userModel.findOne({
                      _id: user.user_id,
                    });
                    if (receiverUser) {
                      await this.emailerService.sendEmailBirthdayReminder(
                        receiverUser.email,
                        user.first_name,
                        act.content,
                      );
                    }
                  } else if (
                    act.node_name === WorkFlowAction.WORKFLOW_ACTION_SMS
                  ) {
                    const receiverUserInfo = await this.userInfoModel.findOne({
                      user_id: user.user_id,
                    });
                    await this.smsService.sendSmsBirthdayReminder(
                      receiverUserInfo.contact_no,
                      user.first_name,
                      act.content,
                    );
                  }
                }
              }
            }

            // WORKFLOW_TRIGGER_CUSTOM_DATE_REMINDER
            if (
              trig.node_name ===
              WorkFlowTrigger.WORKFLOW_TRIGGER_CUSTOM_DATE_REMINDER
            ) {
              // Get today's date without the year
              const triggerDate = trig.content.find((item) => item);
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

                  if (act.node_name === WorkFlowAction.WORKFLOW_ACTION_EMAIL) {
                    for (const user of users) {
                      const userInfo = await this.userInfoModel.findOne({
                        user_id: user._id,
                      });
                      const ownerUserInfo = await this.userInfoModel.findOne({
                        user_id: workflow.created_by,
                      });
                      await this.emailerService.sendEmailCustomDateRemider(
                        user.email,
                        act.content,
                        userInfo.first_name,
                        ownerUserInfo.first_name,
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
