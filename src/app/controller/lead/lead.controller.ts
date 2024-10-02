import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../decorators/public.decorator';
import { AbstractLeadService } from 'src/app/interface/lead';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { Lead } from 'src/app/models/lead/lead.schema';

@ApiTags('Leads')
@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: AbstractLeadService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create lead' })
  async createLead(@Body() createLeadDTO: CreateLeadDTO): Promise<Lead | null> {
    return await this.leadService.createLead(createLeadDTO);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get leads' })
  async getAllLeads(): Promise<Lead[] | null> {
    return await this.leadService.getAllLeads();
  }
}
