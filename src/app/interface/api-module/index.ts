import { GenericAbstractRepository } from 'src/app/interface/generic.abstract.repository';
import { ApiModule } from 'src/app/models/api-module/api-module.schema';

export abstract class AbstractApiModuleRepository extends GenericAbstractRepository<ApiModule> {}

export abstract class AbstractApiModuleService {}
