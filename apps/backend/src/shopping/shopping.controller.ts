import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ShoppingService } from './shopping.service'
import type { CreateBodyType, UpdateBodyType } from '@family-business/types/modules/shopping'

interface JwtUser {
  userId: string
  email: string
}

@ApiTags('shopping')
@Controller('shopping')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ShoppingController {
  constructor(private shoppingService: ShoppingService) {}

  @Get()
  @ApiOperation({ summary: 'List shopping items' })
  async findAll(@Request() req: { user: JwtUser }, @Query('familyId') familyId?: string) {
    return this.shoppingService.findAll(req.user.userId, familyId)
  }

  @Post()
  async create(@Request() req, @Body() data: CreateBodyType) {
    return this.shoppingService.create(req.user.userId, data)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateBodyType) {
    return this.shoppingService.update(id, data)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.shoppingService.delete(id)
  }
}
