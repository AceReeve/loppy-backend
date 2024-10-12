import { GenericInterfaceRepoistory } from '../generic.interface.repository';
import { Dashboard } from 'src/app/models/dashboard/dashboard.schema';
import { Query } from 'express-serve-static-core';

export type DashboardRepositoryInterface =
  GenericInterfaceRepoistory<Dashboard>;

export abstract class AbstractDashboardService {
  abstract getDashboardUsersPaginated(query?: Query);
}
