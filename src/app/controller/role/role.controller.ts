import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateRoleDTO } from 'src/app/dto/role';
import { AbstractRoleService } from 'src/app/interface/role';
import { Role } from 'src/app/models/role/role.schema';
import { Public } from '../../decorators/public.decorator';

@ApiTags('role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: AbstractRoleService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create role' })
  async createRole(@Body() createRoleDTO: CreateRoleDTO): Promise<Role | null> {
    return await this.roleService.createRole(createRoleDTO);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get roles' })
  async getAllRoles(): Promise<Role[] | null> {
    return await this.roleService.getAllRoles();
  }
}
