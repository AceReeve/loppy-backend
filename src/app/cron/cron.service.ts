import { Inject, Injectable } from '@nestjs/common';
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
import { AxiosInstance } from 'axios';
import { Opportunity } from '../models/opportunity/opportunity.schema';
import { Pipeline } from '../models/pipeline/pipeline.schema';
import { Lead } from '../models/lead/lead.schema';
import { PipelineRepository } from '../repository/pipeline/pipeline.repository';
import { GmailService } from '../services/gmail/gmail.service';
import { CustomerReplied, CustomerRepliedDocument } from '../models/email/gmail.schema';
import { REQUEST } from '@nestjs/core';
import { UserInterface } from '../interface/user';
import { Tags, TagsDocument } from '../models/tags/tags.schema';

@Injectable()
export class CronService {
  private openWeatherAPI: AxiosInstance;

  constructor(
    @InjectModel(WorkFlow.name)
    private workFlowModel: Model<WorkFlowDocument>,
    @InjectModel(UserInfo.name)
    private userInfoModel: Model<UserInfoDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(InvitedUser.name)
    private invitedUserModel: Model<InvitedUserDocument>,
    @InjectModel(Opportunity.name)
    private opportunityModel: Model<Opportunity & Document>,
    @InjectModel(Pipeline.name)
    private pipelineModel: Model<Pipeline & Document>,
    @InjectModel(Lead.name)
    private leadModel: Model<Lead & Document>,
    @InjectModel(CustomerReplied.name)
    private tagModel: Model<TagsDocument>,
    @InjectModel(Tags.name)
    private customerRepliedModel: Model<CustomerRepliedDocument>,
    private emailerService: EmailerService,
    private smsService: SmsService,
    protected readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly pipelineRepository: PipelineRepository,
    private readonly gmailService: GmailService,
  ) {}

  async triggerData() {
    return await this.workFlowModel.find();
  }
  private applyFilters(userBirthday: Date, filters: any[]): boolean {
    const today = moment();
    const birthday = moment(userBirthday);
    let dayFilter = null;
    let monthFilter = null;

    for (const filtercontent of filters) {
      const { filter: filter, value } = filtercontent;
      if (filter === 'Before') {
        const daysBefore = parseInt(value, 10);
        const beforeDate = today.clone().add(daysBefore, 'days');
        if (birthday.isBefore(beforeDate, 'day')) {
          return true;
        }
      }

      if (filter === 'After') {
        const daysAfter = parseInt(value, 10);
        const afterDate = today.clone().subtract(daysAfter, 'days');
        if (birthday.isAfter(afterDate, 'day')) {
          return true;
        }
      }

      if (filter === 'Day') {
        dayFilter = parseInt(value, 10);
      }
      if (filter === 'Month') {
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
  private async applyFiltersOpportunityStatusChange(filters: any[]): Promise<any> {
    let matchedLeads = [];
  
    for (const filtercontent of filters) {
      const { filter: filter, value } = filtercontent;
  
      if (filter === 'In Pipeline') {
          const pipeline = await this.pipelineRepository.getPipeline(value);
          if (pipeline && pipeline.opportunities) {
            for (const opportunity of pipeline.opportunities) {
              matchedLeads = matchedLeads.concat(opportunity.leads);
            }
          }
      }
      if (filter === 'Has a Tag') {
        const tags = await this.tagModel.findOne({id: value})
        matchedLeads = matchedLeads.filter(lead => lead.tags && lead.tags.includes(tags.name));
      }
  
      if (filter === 'Lead Value') {
        matchedLeads = matchedLeads.filter(lead => lead.opportunity_value >= Number(value));
      }
  
      if (filter === 'Moved from status') {
        matchedLeads = matchedLeads.filter(lead => lead.old_status === value);
      }
  
      if (filter === 'Moved to status') {
        matchedLeads = matchedLeads.filter(lead => lead.status === value);
      }
    }
    return matchedLeads.length > 0 ? matchedLeads : false;
  }

  private applyFiltersCustomerReplied(identifier: string, filters: any[]): boolean {
    const today = moment();
    for (const filtercontent of filters) {
      const { filter: filter, value } = filtercontent;
      if (filter === 'Replied to Workflow') {
              if(identifier.toString() === value.toString()){
                return true;
              }
            }
    }

    return false;
  }
  
  private applyFiltersContactCreated(filters: any[]): boolean {
    for (const filtercontent of filters) {
      const { filter: filter, value } = filtercontent;
      if (filter === 'Has a Tag') {
      }
    }
    return false;
  }
  private applyWeatherFilters(city: string, filters: any[]): boolean {
    // get user's location
    try {
      const response: any = this.openWeatherAPI.get('weather', {
        params: {
          q: city,
          units: 'metric',
        },
      });

      // check if filter conditions are all true
      for (const filtercontent of filters) {
        const { filter: filter, value } = filtercontent;
        // WEATHER TYPE
        if (filter === 'Weather Type') {
          if (!(response.data.weather[0].main === value)) {
            return false;
          }
        }

        // ABOVE TEMP
        if (filter === 'Above Temp') {
          if (!(response.data.main.temp >= parseInt(value, 10))) {
            return false;
          }
        }

        // BELOW TEMP
        if (filter === 'Below Temp') {
          if (!(response.data.main.temp <= parseInt(value, 10))) {
            return false;
          }
        }

        // ABOVE PRESSURE
        if (filter === 'Above Pressure') {
          if (!(response.data.main.pressure >= parseInt(value, 10))) {
            return false;
          }
        }

        // BELOW PRESSURE
        if (filter === 'Below Pressure') {
          if (!(response.data.main.pressure <= parseInt(value, 10))) {
            return false;
          }
        }

        // ABOVE HUMIDITY
        if (filter === 'Above Humidity') {
          if (!(response.data.main.humidity >= parseInt(value, 10))) {
            return false;
          }
        }

        // BELOW HUMIDITY
        if (filter === 'Below Humidity') {
          if (!(response.data.main.humidity <= parseInt(value, 10))) {
            return false;
          }
        }

        // ABOVE WIND SPEED
        if (filter === 'Above Wind Speed') {
          if (!(response.data.wind.speed >= parseInt(value, 10))) {
            return false;
          }
        }

        // BELOW WIND SPEED
        if (filter === 'Below Wind Speed') {
          if (!(response.data.wind.speed <= parseInt(value, 10))) {
            return false;
          }
        }
      }
    } catch (error) {
      return false;
    }

    return true;
  }

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
              WorkFlowTrigger.WORKFLOW_TRIGGER_BIRTHDAY_REMINDER
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
                      await this.emailerService.sendEmailNotification(
                        receiverUser.email,
                        act.content,
                        user.first_name,
                        workflow._id,
                      );
                    }
                  } else if (
                    act.node_name === WorkFlowAction.WORKFLOW_ACTION_SMS
                  ) {
                    const receiverUserInfo = await this.userInfoModel.findOne({
                      user_id: user.user_id,
                    });
                    await this.smsService.sendSms(
                      receiverUserInfo.contact_no,
                      act.content.message,
                      user.first_name,
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

                 
                    for (const user of users) {
                      const userInfo = await this.userInfoModel.findOne({
                        user_id: user._id,
                      });
                      if (act.node_name === WorkFlowAction.WORKFLOW_ACTION_EMAIL) {
                      
                      const ownerUserInfo = await this.userInfoModel.findOne({
                        user_id: workflow.created_by,
                      });
                      await this.emailerService.sendEmailCustomDateRemider(
                        user.email,
                        act.content,
                        userInfo.first_name,
                        ownerUserInfo.first_name,
                      );
                    }else if (
                      act.node_name === WorkFlowAction.WORKFLOW_ACTION_SMS
                    ) {
                      await this.smsService.sendSms(
                        userInfo.contact_no,
                        act.content.message,
                        userInfo.first_name,
                      );
                    }
                  }
                }
              }
            }

            // WORKFLOW_TRIGGER_WEATHER_REMINDER
            if (
              trig.node_name ===
              WorkFlowTrigger.WORKFLOW_TRIGGER_WEATHER_REMINDER
            ) {
              const users = await this.userInfoModel.find();
              for (const user of users) {
                // Apply the filters to the user's birthday
                if (this.applyWeatherFilters(user.city, trig.content.filters)) {
                  // If filters are valid, send the notifications
                  if (act.node_name === WorkFlowAction.WORKFLOW_ACTION_EMAIL) {
                    const receiverUser = await this.userModel.findOne({
                      _id: user.user_id,
                    });
                    if (receiverUser) {
                      await this.emailerService.sendEmailWeatherReminder(
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
                    await this.smsService.sendSms(
                      receiverUserInfo.contact_no,
                      act.content.message,
                      user.first_name,

                    );
                  }
                }
              }
            }

            // ACTIONS, ANY TRIGGER
            // WORKFLOW_ACTION_CREATE_NEW_OPPORTUNITY
            if (
              act.node_name ===
              WorkFlowAction.WORKFLOW_ACTION_CREATE_NEW_OPPORTUNITY
            ) {
              const leadData = {
                owner_id: act.content?.owner_id,
                stage_id: act.content?.stage_id,
                pipeline_id: act.content?.pipeline_id,
                primary_contact_name_id: act.content?.primary_contact_name_id,
                opportunity_name: act.content?.opportunity_name,
                opportunity_source: act.content?.opportunity_source,
                status: act.content?.status,
                opportunity_value: act.content?.opportunity_value,
              };

              const isExisting = await this.leadModel.findOne({
                owner_id: act.content?.owner_id,
                stage_id: act.content?.stage_id,
                pipeline_id: act.content?.pipeline_id,
                primary_contact_name_id: act.content?.primary_contact_name_id,
                opportunity_name: act.content?.opportunity_name,
                opportunity_source: act.content?.opportunity_source,
                status: act.content?.status,
                opportunity_value: act.content?.opportunity_value,
              });

              if (!isExisting) {
                const stage_id = act.content?.stage_id;

                if (!act.content?._id) {
                  // Create a new lead
                  const lead = await this.leadModel.create(leadData);

                  if (!lead) {
                    throw new Error('Opportunity creation failed');
                  }

                  // Update the opportunity by pushing the new lead's _id into the leads array
                  const updatedOpportunity =
                    await this.opportunityModel.findByIdAndUpdate(
                      stage_id,
                      { $push: { leads: lead._id } },
                      { new: true }, // Return the updated document
                    );

                  if (!updatedOpportunity) {
                    throw new Error(`Stage with id ${stage_id} not found`);
                  }
                } else {
                  // update lead
                  await this.leadModel.findByIdAndUpdate(
                    act.content?._id,
                    leadData,
                    {
                      new: true,
                    },
                  );
                }
              } else {
                // update lead
                await this.leadModel.findByIdAndUpdate(
                  isExisting._id,
                  leadData,
                  {
                    new: true,
                  },
                );
              }
            }
            if(WorkFlowTrigger.WORKFLOW_TRIGGER_CONTACT_CREATED){
              if(this.applyFiltersContactCreated(trig.content.filters)){
                
              }
            }
          }
        }
      }
    }
  }

  async oppportunityStatusChange(req: UserInterface) {
    const user = await this.userRepository.getLoggedInUserDetails(req)
    const workflows = await this.workFlowModel.find({'trigger.node_name': WorkFlowTrigger.WORKFLOW_TRIGGER_OPPORTUNITY_STATUS_CHANGED, created_by: user._id});
    for (const workflow of workflows) {
      if (workflow.status === WorkFlowStatus.PUBLISHED) {
        const { trigger, action } = workflow;

        for (const trig of trigger) {
          for (const act of action) {
            if(trig.node_name === WorkFlowTrigger.WORKFLOW_TRIGGER_OPPORTUNITY_STATUS_CHANGED){
              console.log('Im inside of opportunity status changed')
              const datas = await this.applyFiltersOpportunityStatusChange(trig.content.filters)
              if(datas?.length){
                for(const data of datas){
                if (act.node_name === WorkFlowAction.WORKFLOW_ACTION_EMAIL) {
                    await this.emailerService.sendEmailNotification(
                      data.primary_email,
                      act.content,
                      '',
                      workflow._id,
                    );
                } else if (
                  act.node_name === WorkFlowAction.WORKFLOW_ACTION_SMS
                ) {
                console.log('Im inside of ACTION SMS')
                  await this.smsService.sendSms(
                    data.primary_phone,
                    act.content.message,
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

  async customerRepliedWorkFlow(customer_replied_id: string) {
    const customerRepliedData = await this.customerRepliedModel.findOne({_id: new Types.ObjectId(customer_replied_id)})
    const workflows = await this.workFlowModel.find({'trigger.node_name': WorkFlowTrigger.WORKFLOW_TRIGGER_CUSTOMER_REPLIED});
    for(const workflow of workflows){
      if (workflow.status === WorkFlowStatus.PUBLISHED) {
        const { trigger, action } = workflow;
        for (const trig of trigger) {
          for (const act of action) {
            if (
              trig.node_name ===
              WorkFlowTrigger.WORKFLOW_TRIGGER_CUSTOMER_REPLIED
            ) {

              if (this.applyFiltersCustomerReplied(customerRepliedData.topicIdentifier, trig.content.filters)) {
                // If filters are valid, send the notifications
                const receiverUser = await this.userModel.findOne({
                  email: customerRepliedData.email, 
                });
                if (act.node_name === WorkFlowAction.WORKFLOW_ACTION_EMAIL) {
                  const originalMessageId = customerRepliedData.emailId;
                  const threadId = customerRepliedData.threadId;
                  if (receiverUser) {
                    await this.gmailService.replyToEmailWithGmailAPI(
                      receiverUser.email,
                      act.content,
                      originalMessageId,
                      threadId
                    );
                  }
                } else if (
                  act.node_name === WorkFlowAction.WORKFLOW_ACTION_SMS
                ) {
                  const receiverUserInfo = await this.userInfoModel.findOne({
                    user_id: receiverUser._id,
                  });
                  // await this.smsService.sendSms(
                  //   receiverUserInfo.contact_no,
                  //   act.content.message,
                  //   user.first_name,
                  // );
                }
              }
            }
          }
        }
      }
    }
  }

  ///////////
  @Cron('*/10 * * * * *')
  async saveCustomerReplies() {
      const messages = await this.gmailService.listMessages();
      for (const message of messages) {
        const emailData = await this.gmailService.getReply(message.id);
  
        const inReplyToHeader = emailData.payload.headers.find(
          (header) => header.name === 'In-Reply-To'
        );
        const fromHeader = emailData.payload.headers.find(
          (header) => header.name === 'From'
        );
        const senderEmail = fromHeader ? this.extractEmailAddress(fromHeader.value) : 'unknown';
        if (inReplyToHeader) {
          const emailBody = this.extractMessageBody(emailData);
          const topicIdentifier = this.extractTopicIdentifier(emailBody);
          await this.saveReplyToDatabase({
            email: senderEmail,
            emailId: message.id,
            threadId: message.threadId,
            topicIdentifier,
            subject: message.subject,
            body: emailBody,
          });
        }
      }
  }

  private extractEmailAddress(fromValue: string): string {
    const emailMatch = fromValue.match(/<(.+)>/); 
    return emailMatch ? emailMatch[1] : fromValue;
  }

  private extractTopicIdentifier(emailBody: string): string {
    const match = emailBody.match(/Topic-ID:\s*([a-zA-Z0-9]+)/i);
    return match ? match[1] : 'unknown';
  }

  private extractMessageBody(emailData: any): string {
    const bodyPart = emailData.payload.parts?.find(part => part.mimeType === 'text/plain');
    return bodyPart ? Buffer.from(bodyPart.body.data, 'base64').toString('utf-8') : '';
  }

  private async saveReplyToDatabase(replyData: any) {
      const existingReply = await this.customerRepliedModel.findOne({
        emailId: replyData.emailId,
      });
  
      if (existingReply) {
        return; 
      }
  
      const newReply = new this.customerRepliedModel(replyData);
      await newReply.save();
      await this.customerRepliedWorkFlow(newReply._id.toString())
  }
}
