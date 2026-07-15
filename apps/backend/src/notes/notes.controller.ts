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
import { NotesService } from './notes.service'
import type { CreateBodyType, UpdateBodyType } from '@family-business/types/modules/notes'

interface JwtUser {
  userId: string
  email: string
}

@ApiTags('notes')
@Controller('notes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'List notes by family' })
  async findAll(@Request() req: { user: JwtUser }, @Query('familyId') familyId?: string) {
    return this.notesService.findAll(req.user.userId, familyId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get note by id' })
  async findOne(@Request() req: { user: JwtUser }, @Param('id') id: string) {
    return this.notesService.findOne(req.user.userId, id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create note' })
  async create(
    @Request() req: { user: JwtUser },
    @Body() data: CreateBodyType,
    @Query('familyId') familyId?: string,
  ) {
    return this.notesService.create(req.user.userId, data, familyId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update note' })
  async update(
    @Request() req: { user: JwtUser },
    @Param('id') id: string,
    @Body() data: UpdateBodyType,
  ) {
    return this.notesService.update(req.user.userId, id, data)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete note' })
  async delete(@Request() req: { user: JwtUser }, @Param('id') id: string) {
    await this.notesService.delete(req.user.userId, id)
  }
}
