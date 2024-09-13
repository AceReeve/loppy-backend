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
import { CreateWorkflowDto, UpdateWorkflowDto } from 'src/app/dto/work-flow';
import { JwtAuthGuard } from 'src/app/guard/auth';
import { AbstractWorkFlowService } from 'src/app/interface/react-flow';

@ApiTags('React Flow')
@Controller('react-flow')
@UseGuards(JwtAuthGuard)
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
  @ApiQuery({
    name: 'template_id',
    description: 'template_id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async workflow(
    @Query('id') id: string,
    @Query('template_id') template_id: string,
  ) {
    return this.service.workFlow(id, template_id);
  }

  @Put('workflow')
  @ApiOperation({ summary: 'Update Workflow' })
  @ApiQuery({
    name: 'id',
    description: 'id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async updateWorkflow(
    @Query('id') id: string,
    @Body() dto: UpdateWorkflowDto,
  ) {
    return this.service.updateWorkFlow(id, dto);
  }
  @Put('workflow-published')
  @ApiOperation({ summary: 'Published Workflow' })
  @ApiQuery({
    name: 'id',
    description: 'id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async publishedWorkFlow(@Query('id') id: string) {
    return this.service.publishedWorkFlow(id);
  }

  @Get('workflows')
  @ApiOperation({ summary: 'List of WorkFlow' })
  @ApiQuery({
    name: 'folder_id',
    description: 'folder id',
    example: '66b462060e61af2e685d6e55',
    required: false,
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
    name: 'name',
    description: 'Update WorkFlow By ID',
    example: 'My 1st WorkFlow',
    required: true,
  })
  async updateWorkFlowById(
    @Query('id') id: string,
    @Query('name') name: string,
  ) {
    return this.service.updateWorkFlowById(id, name);
  }

  //folder
  @Post('folder')
  @ApiOperation({ summary: 'Create folder' })
  @ApiQuery({
    name: 'name',
    description: 'Create folder',
    example: 'my flows',
    required: true,
  })
  async folder(@Query('name') name: string) {
    return this.service.folder(name);
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

  @Put('/:id')
  @ApiOperation({ summary: 'Update folder or Workflow by ID' })
  @ApiQuery({
    name: 'id',
    description: 'Update folder or Workflow By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  @ApiQuery({
    name: 'name',
    description: 'Update folder or Workflow By ID',
    example: 'My WorkFlows',
    required: true,
  })
  async updateFolderById(@Query('id') id: string, @Query('name') name: string) {
    return this.service.updateFolderById(id, name);
  }

  @Delete('folder/:id')
  @ApiOperation({ summary: 'Delete folder by ID' })
  @ApiQuery({
    name: 'id',
    description: 'Delete folder By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  async deleteFolderById(@Query('id') id: string) {
    return this.service.deleteFolderById(id);
  }
}
