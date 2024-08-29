import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AbstractWorkFlowService } from 'src/app/interface/react-flow';

@ApiTags('React Flow')
@Controller('react-flow')
@ApiBearerAuth('Bearer')
export class WorkFlowController {
  constructor(private service: AbstractWorkFlowService) {}

  @Post('workflow')
  @ApiOperation({ summary: 'Create Workflow' })
  async organization() {
    return this.service.workFlow();
  }

  @Get('workflows')
  @ApiOperation({ summary: 'List of WorkFlow' })
  async getAllWorkFlow() {
    return this.service.getAllWorkFlow();
  }

  @Get('workflow/:id')
  @ApiOperation({ summary: 'Get Workflow by ID' })
  @ApiQuery({
    name: 'id',
    description: 'Get WorkFlow By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  async getWorkFlowById(@Query('id') id: string) {
    return this.service.getWorkFlowById(id);
  }

  @Put('workflow/:id')
  @ApiOperation({ summary: 'Update Workflow by ID' })
  @ApiQuery({
    name: 'id',
    description: 'Update WorkFlow By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  @ApiQuery({
    name: 'work_flow_name',
    description: 'Update WorkFlow By ID',
    example: 'My 1st WorkFlow',
    required: true,
  })
  async updateWorkFlowById(
    @Query('id') id: string,
    @Query('work_flow_name') work_flow_name: string,
  ) {
    return this.service.updateWorkFlowById(id, work_flow_name);
  }
}
