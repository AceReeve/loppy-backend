import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/public.decorator';
import { AbstractOpportunityService } from 'src/app/interface/opportunity';
import {
  CreateOpportunityDTO,
  UpdateOpportunityDTO,
} from 'src/app/dto/opportunity';
import { Opportunity } from 'src/app/models/opportunity/opportunity.schema';

@ApiTags('Opportunities')
@Controller('opportunity')
export class OpportunityController {
  constructor(
    private readonly opportunityService: AbstractOpportunityService,
  ) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create opportunity' })
  async createOpportunity(
    @Body() createOpportunityDTO: CreateOpportunityDTO,
  ): Promise<Opportunity | null> {
    return await this.opportunityService.createOpportunity(
      createOpportunityDTO,
    );
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get opportunities' })
  async getAllOpportunities(): Promise<Opportunity[] | null> {
    return await this.opportunityService.getAllOpportunities();
  }

  @Public()
  @Put()
  @ApiOperation({ summary: 'Update opportunities' })
  async updateOpportunities(
    @Body() updateOpportunityDto: UpdateOpportunityDTO[],
  ): Promise<Opportunity[]> {
    return await this.opportunityService.updateOpportunities(
      updateOpportunityDto,
    );
  }
}
