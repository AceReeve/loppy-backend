import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiQueryOptions, ApiTags } from '@nestjs/swagger';
import { AbstractLeadService } from 'src/app/interface/lead';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { Lead } from 'src/app/models/lead/lead.schema';
import { JwtAuthGuard } from 'src/app/guard/auth';
import { UserInterface } from 'src/app/interface/user';

@ApiTags('Opportunities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
@Controller('opportunities')
export class LeadController {
  constructor(private readonly leadService: AbstractLeadService) {}

  @Post()
  @ApiOperation({ summary: 'Create opportunity' })
  async createLead(@Body() createLeadDTO: CreateLeadDTO): Promise<Lead | null> {
    return await this.leadService.createLead(createLeadDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity by id' })
  async getLeadById(@Param('id') id: string): Promise<Lead | null> {
    return await this.leadService.getLeadById(id);
  }

  @Put('status-change')
  @ApiOperation({ summary: 'Update Opportunity status' })
  @ApiQuery({
    name: 'id',
    required: true,
  } as ApiQueryOptions)
  @ApiQuery({
    name: 'status',
    required: true,
  } as ApiQueryOptions)
  async updateOpportunityStatus(
    @Request() req: UserInterface,
    @Query('id') id: string,
    @Query('status') status: string,
  ): Promise<Lead | null> {
    return await this.leadService.updateOpportunityStatus(
      req,
      id,
      status,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get opportunities' })
  async getAllLeads(): Promise<Lead[] | null> {
    return await this.leadService.getAllLeads();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update opportunity' })
  async updateLead(
    @Request() req: UserInterface,
    @Param('id') id: string,
    @Body() updateLeadDTO: CreateLeadDTO,
  ): Promise<Lead | null> {
    return await this.leadService.updateLead(req, id, updateLeadDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete opportunity' })
  async deleteLead(@Param('id') id: string): Promise<Lead | null> {
    return await this.leadService.deleteLead(id);
  }
}
