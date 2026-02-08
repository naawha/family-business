import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const familyInclude = {
  members: {
    include: {
      user: {
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
    },
  },
} as const

@Injectable()
export class FamiliesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.family.findMany({
      where: {
        members: { some: { userId } },
      },
      include: familyInclude,
    })
  }

  async findOne(id: string) {
    const family = await this.prisma.family.findUnique({
      where: { id },
      include: familyInclude,
    })
    
    // Отладочное логирование (можно убрать позже)
    if (family?.members) {
      console.log('Family members with avatars:', 
        family.members.map(m => ({
          name: m.user?.name,
          avatarEmoji: m.user?.avatarEmoji,
          avatarColor: m.user?.avatarColor,
        }))
      )
    }
    
    return family
  }

  async findOneForUser(userId: string, familyId: string) {
    const family = await this.findOne(familyId)
    if (!family) throw new NotFoundException('Family not found')
    const isMember = family.members.some((m) => m.userId === userId)
    if (!isMember) throw new ForbiddenException('No access to this family')
    return family
  }

  async create(userId: string, name: string) {
    return this.prisma.family.create({
      data: {
        name,
        members: {
          create: { userId, role: 'admin' },
        },
      },
      include: familyInclude,
    })
  }

  async update(userId: string, familyId: string, data: { name?: string }) {
    await this.ensureAdmin(userId, familyId)
    return this.prisma.family.update({
      where: { id: familyId },
      data: { name: data.name },
      include: familyInclude,
    })
  }

  async removeMember(
    userId: string,
    familyId: string,
    memberId: string,
  ): Promise<void> {
    const family = await this.findOneForUser(userId, familyId)
    const target = family.members.find((m) => m.id === memberId)
    if (!target) throw new NotFoundException('Member not found')

    const requester = family.members.find((m) => m.userId === userId)
    const isAdmin = requester?.role === 'admin'
    const isSelf = target.userId === userId

    if (!isAdmin && !isSelf) {
      throw new ForbiddenException('Only admin can remove other members')
    }
    await this.prisma.familyMember.delete({
      where: { id: memberId },
    })
  }

  async ensureMember(userId: string, familyId: string): Promise<void> {
    await this.findOneForUser(userId, familyId)
  }

  async ensureAdmin(userId: string, familyId: string): Promise<void> {
    const family = await this.findOneForUser(userId, familyId)
    const member = family.members.find((m) => m.userId === userId)
    if (member?.role !== 'admin') {
      throw new ForbiddenException('Admin role required')
    }
  }

  async isMember(userId: string, familyId: string): Promise<boolean> {
    const count = await this.prisma.familyMember.count({
      where: { familyId, userId },
    })
    return count > 0
  }
}
