import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  async create(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({ data })
  }

  async update(
    id: string,
    data: { name?: string; avatarEmoji?: string; avatarColor?: string },
  ): Promise<{
    id: string
    email: string
    name: string
    avatarEmoji: string | null
    avatarColor: string | null
    createdAt: Date
    updatedAt: Date
  }> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.avatarEmoji !== undefined && { avatarEmoji: data.avatarEmoji }),
        ...(data.avatarColor !== undefined && { avatarColor: data.avatarColor }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarEmoji: true,
        avatarColor: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return user
  }
}
