import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DashboardSchemaModule } from 'src/app/models/dashboard/dashboard.schema.module';
import { DashboardController } from 'src/app/controller/dashboard/dashboard.controller';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Dashboard, DashboardSchema } from 'src/app/models/dashboard/dashboard.schema';
import { AbstractDashboardService } from 'src/app/interface/dashboard';
@Module({
    imports: [
        DashboardSchemaModule,
        MongooseModule.forFeature([{ name: Dashboard.name, schema: DashboardSchema }]),
    ],
    controllers: [DashboardController],
    providers: [
        {
            provide: AbstractDashboardService,
            useClass: DashboardService,
        },
        JwtService,
    ],

    exports: [
        {
            provide: AbstractDashboardService,
            useClass: DashboardService,
        },
        JwtService,
    ],
})
export class DashboardModule { }
