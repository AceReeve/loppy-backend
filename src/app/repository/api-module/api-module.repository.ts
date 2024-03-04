import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { AbstractApiModuleRepository } from 'src/app/interface/apimodule';
import { ApiModule } from 'src/app/models/api-module/api-module.schema';

@Injectable()
export class ApiModuleRepository implements AbstractApiModuleRepository {
  constructor(
    @InjectModel(ApiModule.name)
    private apiModuleModel: Model<ApiModule & Document>,
  ) {}

  async findOne(input: FilterQuery<ApiModule>): Promise<ApiModule | null> {
    return await this.apiModuleModel.findById(input);
  }

  findOneAndUpdate(
    input: FilterQuery<ApiModule>,
    update: UpdateQuery<ApiModule>,
  ): Promise<ApiModule | null> {
    throw new Error('Method not implemented.');
  }

  find(input: FilterQuery<ApiModule>): Promise<ApiModule[]> {
    throw new Error('Method not implemented.');
  }

  create(input: FilterQuery<ApiModule>): Promise<ApiModule | null> {
    throw new Error('Method not implemented.');
  }
}
