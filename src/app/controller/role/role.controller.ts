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
import { JwtAuthGuard } from 'src/app/guard/auth';
import { AbstractRoleService } from 'src/app/interface/role';
import { Role } from 'src/app/models/role/role.schema';

@ApiTags('role')
@Controller('role')
// @UseGuards(JwtAuthGuard)
export class RoleController {
    constructor(private readonly roleService: AbstractRoleService) { }

    @Post()
    @ApiOperation({ summary: 'Create role' })
    // @ApiBearerAuth('Bearer')
    async createRole(@Body() createRoleDTO: CreateRoleDTO): Promise<Role | null> {
        return await this.roleService.createRole(createRoleDTO);
    }

    @Get()
    @ApiOperation({ summary: 'Get roles' })
    // @ApiBearerAuth('Bearer')
    async getAllRoles(): Promise<Role[] | null> {
        return await this.roleService.getAllRoles();
    }
}
