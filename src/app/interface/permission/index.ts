import { GenericInterfaceRepoistory } from '../generic.interface.repository';
import { GenericAbstractRepository } from 'src/app/interface/generic.abstract.repository';
import { Permission } from 'src/app/models/permission/permission.schema';

export abstract class AbstractPermissionRepository extends GenericAbstractRepository<Permission> {}

export abstract class AbstractPermissionService {}
