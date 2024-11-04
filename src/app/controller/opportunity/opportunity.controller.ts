import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiQueryOptions, ApiTags } from '@nestjs/swagger';
import { AbstractOpportunityService } from 'src/app/interface/opportunity';
import {
  CreateOpportunityDTO,
  UpdateOpportunitiesDTO,
  UpdateOpportunityDTO,
} from 'src/app/dto/opportunity';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';
import { JwtAuthGuard } from 'src/app/guard/auth';

@ApiTags('Stages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
@Controller('stages')
export class OpportunityController {
  constructor(
    private readonly opportunityService: AbstractOpportunityService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create stage' })
  async createOpportunity(
    @Body() createOpportunityDTO: CreateOpportunityDTO,
  ): Promise<Opportunity | null> {
    return await this.opportunityService.createOpportunity(
      createOpportunityDTO,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get stages' })
  async getAllOpportunities(): Promise<Opportunity[] | null> {
    return await this.opportunityService.getAllOpportunities();
  }

  @Put()
  @ApiOperation({ summary: 'Update stages' })
  async updateOpportunities(
    @Body() updateOpportunityDto: UpdateOpportunitiesDTO,
  ): Promise<Opportunity[]> {
    return await this.opportunityService.updateOpportunities(
      updateOpportunityDto,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update stage' })
  async updateOpportunity(
    @Param('id') id: string,
    @Body() updateOpportunityDto: UpdateOpportunityDTO,
  ): Promise<Opportunity | null> {
    return await this.opportunityService.updateOpportunity(
      id,
      updateOpportunityDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete stage' })
  async deleteOpportunity(
    @Param('id') id: string,
  ): Promise<Opportunity | null> {
    return await this.opportunityService.deleteOpportunity(id);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get stages paginated' })
  async getAllOpportunitiesPaginated(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<any> {
    return await this.opportunityService.getAllOpportunitiesPaginated(
      page,
      limit,
      search,
    );
  }
}
