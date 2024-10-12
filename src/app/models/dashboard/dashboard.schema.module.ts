import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from './dashboard.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dashboard.name, schema: DashboardSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DashboardSchemaModule {}
