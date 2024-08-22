import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  AbstractRoleRepository,
  AbstractRoleService,
} from 'src/app/interface/role';
import { CreateRoleDTO } from 'src/app/dto/role';
import { Role } from 'src/app/models/role/role.schema';
import { UpdateResult } from 'src/app/interface';
import { AbstractPermissionRepository } from 'src/app/interface/permission';
import * as _ from 'lodash';
import { AbstractApiModuleRepository } from 'src/app/interface/api-module';
@Injectable()
export class RoleService implements AbstractRoleService {
  constructor(private readonly repository: AbstractRoleRepository) {}

  async getAllRoles(): Promise<Role[] | null> {
    return await this.repository.getAllRoles();
  }
  async createRole(createRoleDto: CreateRoleDTO): Promise<Role | null> {
    return await this.repository.createRole(createRoleDto);
  }
}
