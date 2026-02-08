import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FamiliesService } from '../families/families.service'
import type { CreateBodyType, UpdateBodyType } from '@family-business/types/modules/recipes'

const recipeInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarEmoji: true,
      avatarColor: true,
    },
  },
  ingredients: {
    orderBy: { order: 'asc' },
  },
} as const

@Injectable()
export class RecipesService {
  constructor(
    private prisma: PrismaService,
    private families: FamiliesService,
  ) {}

  async findAll(userId: string, familyId?: string, category?: string, search?: string) {
    // Если familyId не передан, берем первую семью пользователя
    let targetFamilyId = familyId
    if (!targetFamilyId) {
      const userFamilies = await this.families.findAll(userId)
      if (userFamilies.length > 0) {
        targetFamilyId = userFamilies[0].id
      }
    }

    // Строим условие where
    const where: {
      OR?: Array<{ familyId: string | null; isPublic: boolean }>
      category?: string
      name?: { contains: string; mode?: 'insensitive' }
    } = {}

    // Если есть familyId, показываем рецепты семьи и публичные
    if (targetFamilyId) {
      await this.families.ensureMember(userId, targetFamilyId)
      where.OR = [
        { familyId: targetFamilyId, isPublic: false },
        { familyId: null, isPublic: true },
      ]
    } else {
      // Если нет семьи, показываем только публичные
      where.OR = [{ familyId: null, isPublic: true }]
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    return this.prisma.recipe.findMany({
      where,
      include: recipeInclude,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: recipeInclude,
    })
    if (!recipe) throw new NotFoundException('Recipe not found')

    // Проверяем доступ: рецепт должен быть либо публичным, либо принадлежать семье пользователя
    if (recipe.familyId) {
      await this.families.ensureMember(userId, recipe.familyId)
    } else if (!recipe.isPublic) {
      throw new NotFoundException('Recipe not found')
    }

    return recipe
  }

  async create(userId: string, data: CreateBodyType) {
    let targetFamilyId = data.familyId

    // Если familyId не передан, берем первую семью пользователя
    if (targetFamilyId === undefined) {
      const userFamilies = await this.families.findAll(userId)
      if (userFamilies.length > 0) {
        targetFamilyId = userFamilies[0].id
      }
    }

    // Если familyId указан, проверяем доступ
    if (targetFamilyId) {
      await this.families.ensureMember(userId, targetFamilyId)
    }

    const createData: {
      familyId: string | null
      name: string
      imageUrl?: string
      category?: string
      servings: number
      emoji?: string
      instructions?: string
      isPublic: boolean
      createdById: string
      ingredients?: {
        create: Array<{
          name: string
          quantity: number
          unit?: string
          notes?: string
          order: number
        }>
      }
    } = {
      familyId: targetFamilyId ?? null,
      name: data.name,
      servings: data.servings ?? 4,
      isPublic: data.isPublic ?? false,
      createdById: userId,
    }

    if (data.imageUrl !== undefined) createData.imageUrl = data.imageUrl
    if (data.category !== undefined) createData.category = data.category
    if (data.emoji !== undefined) createData.emoji = data.emoji
    if (data.instructions !== undefined) createData.instructions = data.instructions

    // Добавляем ингредиенты, если они есть
    if (data.ingredients && data.ingredients.length > 0) {
      createData.ingredients = {
        create: data.ingredients.map((ing, index) => ({
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          notes: ing.notes,
          order: ing.order ?? index,
        })),
      }
    }

    return this.prisma.recipe.create({
      data: createData,
      include: recipeInclude,
    })
  }

  async update(userId: string, id: string, data: UpdateBodyType) {
    const recipe = await this.findOne(userId, id)

    // Проверяем, что пользователь может редактировать рецепт
    if (recipe.familyId) {
      await this.families.ensureMember(userId, recipe.familyId)
    } else if (recipe.createdById !== userId) {
      throw new NotFoundException('Recipe not found')
    }

    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.category !== undefined) updateData.category = data.category
    if (data.servings !== undefined) updateData.servings = data.servings
    if (data.emoji !== undefined) updateData.emoji = data.emoji
    if (data.instructions !== undefined) updateData.instructions = data.instructions
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic

    // Обновляем ингредиенты, если они переданы
    if (data.ingredients !== undefined) {
      // Удаляем все существующие ингредиенты и создаем новые
      await this.prisma.recipeIngredient.deleteMany({
        where: { recipeId: id },
      })

      if (data.ingredients.length > 0) {
        updateData.ingredients = {
          create: data.ingredients.map((ing, index) => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes,
            order: ing.order ?? index,
          })),
        }
      }
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateData,
      include: recipeInclude,
    })
  }

  async delete(userId: string, id: string) {
    const recipe = await this.findOne(userId, id)

    // Проверяем, что пользователь может удалить рецепт
    if (recipe.familyId) {
      await this.families.ensureMember(userId, recipe.familyId)
    } else if (recipe.createdById !== userId) {
      throw new NotFoundException('Recipe not found')
    }

    return this.prisma.recipe.delete({ where: { id } })
  }
}
