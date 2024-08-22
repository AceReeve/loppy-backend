import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Dashboard } from 'src/app/models/dashboard/dashboard.schema';

import * as _ from 'lodash';
@Injectable()
export class DashboardRepository {
  constructor(
    @InjectModel(Dashboard.name) private dashboardModel: Model<Dashboard & Document>,
  ) { }

  async getAllUsers(): Promise<Dashboard[] | null> {
    return await this.dashboardModel.find({});
  }
}
