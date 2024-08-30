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
import { CreateWorkflowDto } from 'src/app/dto/work-flow';
import { AbstractWorkFlowService } from 'src/app/interface/react-flow';

@ApiTags('React Flow')
@Controller('react-flow')
@ApiBearerAuth('Bearer')
export class WorkFlowController {
  constructor(private service: AbstractWorkFlowService) {}

  @Post('workflow')
  @ApiOperation({ summary: 'Create Workflow' })
  @ApiQuery({
    name: 'id',
    description: 'folder id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async workflow(@Query('id') id: string, @Body() dto: CreateWorkflowDto) {
    return this.service.workFlow(id, dto);
  }

  @Get('workflows')
  @ApiOperation({ summary: 'List of WorkFlow' })
  @ApiQuery({
    name: 'folder_id',
    description: 'folder id',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  async getAllWorkFlow(@Query('folder_id') folder_id: string) {
    return this.service.getAllWorkFlow(folder_id);
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

  //folder
  @Post('folder')
  @ApiOperation({ summary: 'Create folder' })
  @ApiQuery({
    name: 'folder_name',
    description: 'Create folder',
    example: 'my flows',
    required: true,
  })
  async folder(@Query('folder_name') folder_name: string) {
    return this.service.folder(folder_name);
  }

  @Get('folders')
  @ApiOperation({ summary: 'List of folder' })
  async getAllFolder() {
    return this.service.getAllFolder();
  }

  @Get('folder/:id')
  @ApiOperation({ summary: 'Get folder by ID' })
  @ApiQuery({
    name: 'id',
    description: 'Get folder By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  async getFolderById(@Query('id') id: string) {
    return this.service.getFolderById(id);
  }

  @Put('folder/:id')
  @ApiOperation({ summary: 'Update folder by ID' })
  @ApiQuery({
    name: 'id',
    description: 'Update folder By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  @ApiQuery({
    name: 'folder_name',
    description: 'Update folder By ID',
    example: 'My WorkFlows',
    required: true,
  })
  async updateFolderById(
    @Query('id') id: string,
    @Query('folder_name') folder_name: string,
  ) {
    return this.service.updateFolderById(id, folder_name);
  }
}
