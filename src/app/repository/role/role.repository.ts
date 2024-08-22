import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { CreateRoleDTO } from 'src/app/dto/role';
import { AbstractRoleRepository, ROLE_STATUS } from 'src/app/interface/role';
import { Role } from 'src/app/models/role/role.schema';
import { Permission } from 'src/app/models/permission/permission.schema';

import * as _ from 'lodash';
import { UpdateResult } from 'src/app/interface';
@Injectable()
export class RoleRepository implements AbstractRoleRepository {
  constructor(
    @InjectModel(Role.name) private roleModel: Model<Role & Document>,
  ) { }

  async getAllRoles(): Promise<Role[] | null> {
    return await this.roleModel.find({});
  }
  async createRole(createRoleDto: CreateRoleDTO): Promise<Role | null> {
    return await this.roleModel.create(createRoleDto);
  }
}
