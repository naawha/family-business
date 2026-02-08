import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FamiliesService } from '../families/families.service'
import type { CreateBodyType, UpdateBodyType } from '@family-business/types/modules/todos'

const todoInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarEmoji: true,
      avatarColor: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  assignedTo: {
    select: {
      id: true,
      name: true,
      email: true,
      avatarEmoji: true,
      avatarColor: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const

@Injectable()
export class TodosService {
  constructor(
    private prisma: PrismaService,
    private families: FamiliesService,
  ) {}

  async findAll(userId: string, familyId?: string) {
    let targetFamilyId = familyId

    // Если familyId не передан, берем первую семью пользователя
    if (!targetFamilyId) {
      const userFamilies = await this.families.findAll(userId)
      if (userFamilies.length === 0) {
        return []
      }
      targetFamilyId = userFamilies[0].id
    }

    await this.families.ensureMember(userId, targetFamilyId)
    return this.prisma.todo.findMany({
      where: { familyId: targetFamilyId },
      include: todoInclude,
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
      include: todoInclude,
    })
    if (!todo) throw new NotFoundException('Todo not found')
    await this.families.ensureMember(userId, todo.familyId)
    return todo
  }

  async create(userId: string, data: CreateBodyType, familyId?: string) {
    let targetFamilyId = familyId

    // Если familyId не передан, берем первую семью пользователя
    if (!targetFamilyId) {
      const userFamilies = await this.families.findAll(userId)
      if (userFamilies.length === 0) {
        throw new NotFoundException('User has no families')
      }
      targetFamilyId = userFamilies[0].id
    }

    await this.families.ensureMember(userId, targetFamilyId)
    const createData: {
      familyId: string
      title: string
      description?: string
      isImportant: boolean
      createdById: string
      assignedToId?: string
      dueDate?: Date
    } = {
      familyId: targetFamilyId,
      title: data.title,
      isImportant: data.isImportant ?? false,
      createdById: userId,
    }
    if (data.description != null) createData.description = data.description
    if (data.assignedToId != null) createData.assignedToId = data.assignedToId
    if (data.dueDate != null) {
      createData.dueDate = typeof data.dueDate === 'string' ? new Date(data.dueDate) : data.dueDate
    }
    return this.prisma.todo.create({
      data: createData,
      include: todoInclude,
    })
  }

  async update(userId: string, id: string, data: UpdateBodyType) {
    await this.findOne(userId, id)
    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.isImportant !== undefined) updateData.isImportant = data.isImportant
    if (data.assignedToId !== undefined) updateData.assignedToId = data.assignedToId
    if (data.completed !== undefined) {
      updateData.completed = data.completed
      updateData.completedAt = data.completed ? new Date() : null
    }
    if (data.dueDate !== undefined) {
      updateData.dueDate = data.dueDate
        ? typeof data.dueDate === 'string'
          ? new Date(data.dueDate)
          : data.dueDate
        : null
    }
    return this.prisma.todo.update({
      where: { id },
      data: updateData,
      include: todoInclude,
    })
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id)
    return this.prisma.todo.delete({ where: { id } })
  }

  async toggle(userId: string, id: string, completed: boolean) {
    const todo = await this.findOne(userId, id)
    return this.prisma.todo.update({
      where: { id },
      data: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      include: todoInclude,
    })
  }
}
