import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AbstractLeadService } from 'src/app/interface/lead';
import { CreateLeadDTO } from 'src/app/dto/lead';
import { Lead } from 'src/app/models/lead/lead.schema';
import { JwtAuthGuard } from 'src/app/guard/auth';

@ApiTags('Leads')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: AbstractLeadService) {}

  @Post()
  @ApiOperation({ summary: 'Create lead' })
  async createLead(@Body() createLeadDTO: CreateLeadDTO): Promise<Lead | null> {
    return await this.leadService.createLead(createLeadDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get leads' })
  async getAllLeads(): Promise<Lead[] | null> {
    return await this.leadService.getAllLeads();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lead' })
  async updateLead(
    @Param('id') id: string,
    @Body() updateLeadDTO: CreateLeadDTO,
  ): Promise<Lead | null> {
    return await this.leadService.updateLead(id, updateLeadDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  async deleteLead(@Param('id') id: string): Promise<Lead | null> {
    return await this.leadService.deleteLead(id);
  }
}
