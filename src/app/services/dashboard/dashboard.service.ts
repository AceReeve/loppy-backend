import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
  } from '@nestjs/common';

  import { Dashboard } from 'src/app/models/dashboard/dashboard.schema';

  import * as _ from 'lodash';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core'
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/app/utils/pagination';
import { AbstractDashboardService } from 'src/app/interface/dashboard';
  @Injectable()
  export class DashboardService implements AbstractDashboardService {
    constructor( @InjectModel(Dashboard.name) private dashboardModel: mongoose.Model<Dashboard>) {}

    async getDashboardUsersPaginated(query?: Query) {
      const pageOptionsDto = new PageOptionsDto
      pageOptionsDto.limit = Number(query.limit)
      pageOptionsDto.page = Number(query.page)
      const dashBoardUsers =  await this.dashboardModel.find().limit(pageOptionsDto.limit).skip(pageOptionsDto.skip);

      const itemCount = await this.dashboardModel.countDocuments();
      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

      return new PageDto(dashBoardUsers,pageMetaDto);
    }

  }
  