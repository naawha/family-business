import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { EventsGateway } from '../websocket/events.gateway'
import type { CreateBodyType, UpdateBodyType } from '@family-business/types/modules/shopping'
import { FamiliesService } from '../families/families.service'

@Injectable()
export class ShoppingService {
  constructor(
    private prisma: PrismaService,
    private families: FamiliesService,
    private events: EventsGateway,
  ) {}

  async findAll(userId: string, familyId?: string) {
    // Если familyId не передан, берем первую семью пользователя
    let targetFamilyId = familyId
    if (!targetFamilyId) {
      const userFamilies = await this.families.findAll(userId)
      if (userFamilies.length > 0) {
        targetFamilyId = userFamilies[0].id
      }
    }

    await this.families.ensureMember(userId, targetFamilyId)

    return this.prisma.shoppingItem.findMany({
      where: { familyId: targetFamilyId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatarEmoji: true, avatarColor: true },
        },
        recipe: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(userId: string, data: CreateBodyType) {
    const item = await this.prisma.shoppingItem.create({
      data: {
        ...data,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatarEmoji: true, avatarColor: true },
        },
        recipe: {
          select: { id: true, name: true },
        },
      },
    })
    this.events.emitShoppingCreated(data.familyId, item)
    return item
  }

  async update(id: string, data: UpdateBodyType) {
    const item = await this.prisma.shoppingItem.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true, avatarEmoji: true, avatarColor: true },
        },
        recipe: {
          select: { id: true, name: true },
        },
      },
    })
    this.events.emitShoppingUpdated(item.familyId, item)
    return item
  }

  async delete(id: string) {
    const item = await this.prisma.shoppingItem.findUnique({ where: { id } })
    const deleted = await this.prisma.shoppingItem.delete({ where: { id } })
    if (item) {
      this.events.emitShoppingDeleted(item.familyId, id)
    }
    return deleted
  }
}
