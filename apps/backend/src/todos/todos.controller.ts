import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { TodosService } from './todos.service'
import type {
  CreateBodyType,
  UpdateBodyType,
  ToggleBodyType,
} from '@family-business/types/modules/todos'

interface JwtUser {
  userId: string
  email: string
}

@ApiTags('todos')
@Controller('todos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get()
  @ApiOperation({ summary: 'List todos by family' })
  async findAll(@Request() req: { user: JwtUser }, @Query('familyId') familyId?: string) {
    return this.todosService.findAll(req.user.userId, familyId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get todo by id' })
  async findOne(@Request() req: { user: JwtUser }, @Param('id') id: string) {
    return this.todosService.findOne(req.user.userId, id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create todo' })
  async create(
    @Request() req: { user: JwtUser },
    @Body() data: CreateBodyType,
    @Query('familyId') familyId?: string,
  ) {
    return this.todosService.create(req.user.userId, data, familyId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update todo' })
  async update(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
    @Body() data: UpdateBodyType,
  ) {
    return this.todosService.update(req.user.userId, id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete todo' })
  async delete(@Request() req: { user: JwtUser }, @Param('id') id: string) {
    await this.todosService.delete(req.user.userId, id)
  }

  @Patch(':id/toggle')
  @ApiOperation({ summary: 'Toggle todo completed' })
  async toggle(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
    @Body() body: ToggleBodyType,
  ) {
    return this.todosService.toggle(req.user.userId, id, body.completed)
  }
}
