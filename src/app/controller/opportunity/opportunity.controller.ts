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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AbstractOpportunityService } from 'src/app/interface/opportunity';
import {
  CreateOpportunityDTO,
  UpdateOpportunitiesDTO,
  UpdateOpportunityDTO,
} from 'src/app/dto/opportunity';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';
import { JwtAuthGuard } from 'src/app/guard/auth';

@ApiTags('Opportunities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
@Controller('opportunity')
export class OpportunityController {
  constructor(
    private readonly opportunityService: AbstractOpportunityService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create opportunity' })
  async createOpportunity(
    @Body() createOpportunityDTO: CreateOpportunityDTO,
  ): Promise<Opportunity | null> {
    return await this.opportunityService.createOpportunity(
      createOpportunityDTO,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get opportunities' })
  async getAllOpportunities(): Promise<Opportunity[] | null> {
    return await this.opportunityService.getAllOpportunities();
  }

  @Put()
  @ApiOperation({ summary: 'Update opportunities' })
  async updateOpportunities(
    @Body() updateOpportunityDto: UpdateOpportunitiesDTO,
  ): Promise<Opportunity[]> {
    return await this.opportunityService.updateOpportunities(
      updateOpportunityDto,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update opportunity' })
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
  @ApiOperation({ summary: 'Delete opportunity' })
  async deleteOpportunity(
    @Param('id') id: string,
  ): Promise<Opportunity | null> {
    return await this.opportunityService.deleteOpportunity(id);
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Get opportunities paginated' })
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
