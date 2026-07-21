import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionEntity } from './position.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../user/role.enum';

@ApiTags('positions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('positions')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new position' })
  @ApiResponse({ status: 201, type: PositionEntity })
  create(@Body() dto: CreatePositionDto): Promise<PositionEntity> {
    return this.positionService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.HR_MANAGER, Role.VIEWER)
  @ApiOperation({ summary: 'Get all positions (flat list)' })
  @ApiResponse({ status: 200, type: [PositionEntity] })
  findAll(): Promise<PositionEntity[]> {
    return this.positionService.findAll();
  }

  @Get('tree')
  @Roles(Role.ADMIN, Role.HR_MANAGER, Role.VIEWER)
  @ApiOperation({ summary: 'Get positions as a hierarchy tree' })
  @ApiResponse({ status: 200, type: [PositionEntity] })
  findTree(): Promise<PositionEntity[]> {
    return this.positionService.findTree();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.HR_MANAGER, Role.VIEWER)
  @ApiOperation({ summary: 'Get a single position by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: PositionEntity })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PositionEntity> {
    return this.positionService.findOne(id);
  }

  @Get(':id/children')
  @Roles(Role.ADMIN, Role.HR_MANAGER, Role.VIEWER)
  @ApiOperation({ summary: 'Get all direct children of a position' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: [PositionEntity] })
  findChildren(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PositionEntity[]> {
    return this.positionService.findChildren(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a position' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 200, type: PositionEntity })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePositionDto,
  ): Promise<PositionEntity> {
    return this.positionService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a position (only if no children)' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.positionService.remove(id);
  }
}
