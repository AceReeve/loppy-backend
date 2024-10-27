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
import { JwtAuthGuard } from 'src/app/guard/auth';
import { CreateLeadTriggerDTO } from 'src/app/dto/lead-trigger';
import { LeadTrigger } from 'src/app/models/lead-trigger/lead-trigger.schema';
import { AbstractLeadTriggerService } from 'src/app/interface/lead-trigger';

@ApiTags('Opportunity Triggers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Bearer')
@Controller('opportunity-triggers')
export class LeadTriggerController {
  constructor(private readonly leadService: AbstractLeadTriggerService) {}

  @Post()
  @ApiOperation({ summary: 'Create opportunity trigger' })
  async createLeadTrigger(
    @Body() createLeadTriggerDTO: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null> {
    return await this.leadService.createLeadTrigger(createLeadTriggerDTO);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity trigger by id' })
  async getLeadTriggerById(
    @Param('id') id: string,
  ): Promise<LeadTrigger | null> {
    return await this.leadService.getLeadTriggerById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update opportunity trigger' })
  async updateLeadTrigger(
    @Param('id') id: string,
    @Body() updateLeadTriggerDTO: CreateLeadTriggerDTO,
  ): Promise<LeadTrigger | null> {
    return await this.leadService.updateLeadTrigger(id, updateLeadTriggerDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete opportunity trigger' })
  async deleteLeadTrigger(
    @Param('id') id: string,
  ): Promise<LeadTrigger | null> {
    return await this.leadService.deleteLeadTrigger(id);
  }
}
