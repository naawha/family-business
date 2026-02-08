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
import { RecipesService } from './recipes.service'
import type {
  CreateBodyType,
  UpdateBodyType,
} from '@family-business/types/modules/recipes'

interface JwtUser {
  userId: string
  email: string
}

@ApiTags('recipes')
@Controller('recipes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  @ApiOperation({ summary: 'List recipes' })
  async findAll(
    @Request() req: { user: JwtUser },
    @Query('familyId') familyId?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.recipesService.findAll(req.user.userId, familyId, category, search)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by id' })
  async findOne(@Request() req: { user: JwtUser }, @Param('id') id: string) {
    return this.recipesService.findOne(req.user.userId, id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create recipe' })
  async create(@Request() req: { user: JwtUser }, @Body() data: CreateBodyType) {
    return this.recipesService.create(req.user.userId, data)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update recipe' })
  async update(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
    @Body() data: UpdateBodyType,
  ) {
    return this.recipesService.update(req.user.userId, id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete recipe' })
  async delete(@Request() req: { user: JwtUser }, @Param('id') id: string) {
    await this.recipesService.delete(req.user.userId, id)
  }
}
