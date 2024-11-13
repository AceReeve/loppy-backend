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
  Request,
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
import { UserInterface } from 'src/app/interface/user';

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
    @Request() req: UserInterface,
    @Query('id') id: string,
    @Query('template_id') template_id: string,
  ) {
    return this.service.workFlow(req, id, template_id);
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
    @Request() req: UserInterface,
    @Query('id') id: string,
    @Body() dto: UpdateWorkflowDto,
  ) {
    return this.service.updateWorkFlow(req, id, dto);
  }
  @Put('workflow-published')
  @ApiOperation({ summary: 'Published Workflow' })
  @ApiQuery({
    name: 'id',
    description: 'id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  @ApiQuery({
    name: 'published',
    description: 'published',
    example: 'true',
    required: false,
  })
  async publishedWorkFlow(
    @Request() req: UserInterface,
    @Query('id') id: string,
    @Query('published') published: Boolean,
  ) {
    return this.service.publishedWorkFlow(req, id, published);
  }

  @Get('workflows')
  @ApiOperation({ summary: 'List of WorkFlow' })
  @ApiQuery({
    name: 'folder_id',
    description: 'folder id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async getAllWorkFlow(@Request() req: UserInterface,@Query('folder_id') folder_id: string) {
    return this.service.getAllWorkFlow(req,folder_id);
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
    @Request() req: UserInterface,
    @Query('id') id: string,
    @Query('name') name: string,
  ) {
    return this.service.updateWorkFlowById(req, id, name);
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
  @ApiQuery({
    name: 'id',
    description: 'folder id',
    example: 'folder id',
    required: false,
  })
  async folder(@Request() req: UserInterface,@Query('name') name: string, @Query('id') id: string) {
    return this.service.folder(req, name, id);
  }

  @Get('folders')
  @ApiOperation({ summary: 'List of folder' })
  @ApiQuery({
    name: 'id',
    description: 'folder id',
    example: '66b462060e61af2e685d6e55',
    required: false,
  })
  async getAllFolder(@Request() req: UserInterface,@Query('id') id: string) {
    return this.service.getAllFolder(req, id);
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
  async updateFolderById(@Request() req: UserInterface,@Query('id') id: string, @Query('name') name: string) {
    return this.service.updateFolderById(req, id, name);
  }

  @Delete('folder/:id')
  @ApiOperation({ summary: 'Delete folder by ID' })
  @ApiQuery({
    name: 'id',
    description: 'Delete folder By ID',
    example: '66b462060e61af2e685d6e55',
    required: true,
  })
  async deleteFolderById(@Request() req: UserInterface,@Query('id') id: string) {
    return this.service.deleteFolderById(req, id);
  }

  @Get('workflows-dropdown-list')
  @ApiOperation({ summary: 'WorkFlow And Tags DropDown List' })
  async getAllWorkFlowDropDownList(@Request() req: UserInterface,) {
    return this.service.getAllWorkFlowDropDownList(req);
  }
}
