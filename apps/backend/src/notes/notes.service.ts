import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { FamiliesService } from '../families/families.service'
import type { CreateBodyType, UpdateBodyType } from '@family-business/types/modules/notes'

const noteInclude = {
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
} as const

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private families: FamiliesService,
  ) {}

  async findAll(userId: string, familyId?: string) {
    let targetFamilyId = familyId

    if (!targetFamilyId) {
      const userFamilies = await this.families.findAll(userId)
      if (userFamilies.length === 0) {
        return []
      }
      targetFamilyId = userFamilies[0].id
    }

    await this.families.ensureMember(userId, targetFamilyId)
    return this.prisma.note.findMany({
      where: { familyId: targetFamilyId },
      include: noteInclude,
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
      include: noteInclude,
    })
    if (!note) throw new NotFoundException('Note not found')
    await this.families.ensureMember(userId, note.familyId)
    return note
  }

  async create(userId: string, data: CreateBodyType, familyId?: string) {
    let targetFamilyId = familyId

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
      body?: string
      createdById: string
    } = {
      familyId: targetFamilyId,
      title: data.title,
      createdById: userId,
    }
    if (data.body != null) createData.body = data.body

    return this.prisma.note.create({
      data: createData,
      include: noteInclude,
    })
  }

  async update(userId: string, id: string, data: UpdateBodyType) {
    await this.findOne(userId, id)
    const updateData: Record<string, unknown> = {}
    if (data.title !== undefined) updateData.title = data.title
    if (data.body !== undefined) updateData.body = data.body

    return this.prisma.note.update({
      where: { id },
      data: updateData,
      include: noteInclude,
    })
  }

  async delete(userId: string, id: string) {
    await this.findOne(userId, id)
    return this.prisma.note.delete({ where: { id } })
  }
}
