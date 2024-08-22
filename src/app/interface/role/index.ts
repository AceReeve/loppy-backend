import { User } from 'src/app/models/user/user.schema';
import { GenericInterfaceRepoistory } from '../generic.interface.repository';
import { GenericAbstractRepository } from 'src/app/interface/generic.abstract.repository';
import { CreateRoleDTO } from 'src/app/dto/role';
import { Role } from 'src/app/models/role/role.schema';

export type UserRepositoryInterface = GenericInterfaceRepoistory<User>;

export abstract class AbstractRoleRepository {
  abstract createRole(createRoleDto: CreateRoleDTO): Promise<Role | null>;
  abstract getAllRoles(): Promise<Role[] | null>;
}

export abstract class AbstractRoleService {
  abstract createRole(createRoleDto: CreateRoleDTO): Promise<Role | null>;
  abstract getAllRoles(): Promise<Role[] | null>;
}

export type AcceptedRoleStatus = ['ACTIVE', 'INACTIVE'];
export enum ROLE_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
