import {
    Controller,
    Get,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiQueryOptions, ApiTags } from '@nestjs/swagger';
import { Dashboard } from 'src/app/models/dashboard/dashboard.schema';
import { Query as ExpressQuery } from 'express-serve-static-core'
import { PageDto} from 'src/app/utils/pagination';
import { AbstractDashboardService } from 'src/app/interface/dashboard';

@ApiTags('dashboard')
@Controller('dashboard')
// @UseGuards(JwtAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: AbstractDashboardService) { }

    @Get('/users')
    @ApiOperation({ summary: 'Get Dashboard Users' })
    @ApiQuery({
        name: 'limit',
        required: false,
        default: 10
    } as ApiQueryOptions)
    @ApiQuery({
        name: 'page',
        required: false,
        default: 1
    } as ApiQueryOptions)
    async getDashboardPaginatedMongooseDTO(@Query() request: ExpressQuery): Promise<PageDto<Dashboard>> {
        return await this.dashboardService.getDashboardUsersPaginated(request);
    }
}
