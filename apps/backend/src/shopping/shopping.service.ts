import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import type { CreateBodyType, UpdateBodyType } from '@family-business/types/modules/shopping'
import { FamiliesService } from 'src/families/families.service'

@Injectable()
export class ShoppingService {
  constructor(
    private prisma: PrismaService,
    private families: FamiliesService,
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
    return this.prisma.shoppingItem.create({
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
  }

  async update(id: string, data: UpdateBodyType) {
    return this.prisma.shoppingItem.update({
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
  }

  async delete(id: string) {
    return this.prisma.shoppingItem.delete({ where: { id } })
  }
}
