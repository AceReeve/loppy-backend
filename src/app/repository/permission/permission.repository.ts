import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { Permission } from 'src/app/models/permission/permission.schema';
import { AbstractPermissionRepository } from 'src/app/interface/permission';

@Injectable()
export class PermissionRepository implements AbstractPermissionRepository {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: Model<Permission & Document>,
  ) { }
  async findOne(input: FilterQuery<Permission>): Promise<Permission | null> {
    return await this.permissionModel.findOne(input);
  }
  findOneAndUpdate(
    input: FilterQuery<Permission>,
    update: UpdateQuery<Permission>,
  ): Promise<Permission | null> {
    throw new Error('Method not implemented.');
  }
  find(input: FilterQuery<Permission>): Promise<Permission[]> {
    throw new Error('Method not implemented.');
  }
  async create(input: Permission): Promise<Permission | null> {
    return await this.permissionModel.create(input);
  }
}
