import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { randomBytes } from 'crypto'
import { PrismaService } from '../prisma/prisma.service'
import { FamiliesService } from '../families/families.service'
import type {
  InviteType,
  QrInviteType,
  InviteInfoType,
  FamilyMemberType,
  UserType,
} from '@family-business/types/entities'
import type { InvitesListResponseType } from '@family-business/types/modules/accounts'

const INVITE_TTL_DAYS = 7
const TOKEN_BYTES = 32

@Injectable()
export class InvitesService {
  constructor(
    private prisma: PrismaService,
    private families: FamiliesService,
  ) {}

  private token(): string {
    return randomBytes(TOKEN_BYTES).toString('hex')
  }

  private expiresAt(): Date {
    const d = new Date()
    d.setDate(d.getDate() + INVITE_TTL_DAYS)
    return d
  }

  async inviteByEmail(
    userId: string,
    familyId: string,
    email: string,
    role: string = 'member',
  ): Promise<InviteType> {
    await this.families.ensureAdmin(userId, familyId)
    const family = await this.families.findOne(familyId)
    if (!family) throw new NotFoundException('Family not found')

    const existing = await this.prisma.familyMember.findFirst({
      where: { familyId, user: { email } },
    })
    if (existing) {
      throw new ConflictException('User already in family')
    }

    const pending = await this.prisma.invite.findFirst({
      where: {
        familyId,
        email,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
    })
    if (pending) {
      throw new ConflictException('Invite for this email already exists')
    }

    const invite = await this.prisma.invite.create({
      data: {
        familyId,
        token: this.token(),
        email,
        role,
        kind: 'email',
        status: 'pending',
        expiresAt: this.expiresAt(),
        inviterId: userId,
      },
    })
    return this.toInviteType(invite)
  }

  async createQrInvite(
    userId: string,
    familyId: string,
    role: string = 'member',
  ): Promise<QrInviteType> {
    await this.families.ensureAdmin(userId, familyId)

    const invite = await this.prisma.invite.create({
      data: {
        familyId,
        token: this.token(),
        role,
        kind: 'qr',
        status: 'pending',
        expiresAt: this.expiresAt(),
        inviterId: userId,
      },
    })
    return {
      token: invite.token,
      expiresAt: invite.expiresAt.toISOString(),
      familyId: invite.familyId,
    }
  }

  async getPendingForUser(email: string): Promise<InvitesListResponseType> {
    const invites = await this.prisma.invite.findMany({
      where: {
        email,
        status: 'pending',
        expiresAt: { gt: new Date() },
      },
      include: { family: { select: { name: true } } },
    })
    const result: InvitesListResponseType = []
    for (const invite of invites) {
      const inviter = invite.inviterId
        ? await this.prisma.user.findUnique({
            where: { id: invite.inviterId },
            select: { name: true },
          })
        : null
      result.push({
        token: invite.token,
        familyId: invite.familyId,
        familyName: invite.family.name,
        expiresAt: invite.expiresAt.toISOString(),
        inviterName: inviter?.name ?? undefined,
      })
    }
    return result
  }

  async getByToken(token: string): Promise<InviteInfoType> {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: { family: true },
    })
    if (!invite || invite.status !== 'pending' || invite.expiresAt <= new Date()) {
      throw new NotFoundException('Invite not found or expired')
    }
    const inviter = invite.inviterId
      ? await this.prisma.user.findUnique({
          where: { id: invite.inviterId },
          select: { name: true },
        })
      : null
    return {
      familyId: invite.familyId,
      familyName: invite.family.name,
      expiresAt: invite.expiresAt.toISOString(),
      inviterName: inviter?.name,
    }
  }

  async accept(
    token: string,
    userId: string | null,
    name: string | null,
  ): Promise<{ user: UserType; token: string } | FamilyMemberType> {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: { family: true },
    })
    if (!invite || invite.status !== 'pending' || invite.expiresAt <= new Date()) {
      throw new NotFoundException('Invite not found or expired')
    }

    if (userId) {
      const already = await this.families.isMember(userId, invite.familyId)
      if (already) throw new ConflictException('Already in family')
      const member = await this.prisma.familyMember.create({
        data: {
          familyId: invite.familyId,
          userId,
          role: invite.role,
        },
        include: {
          user: {
            select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
          },
        },
      })
      await this.prisma.invite.update({
        where: { id: invite.id },
        data: { status: 'accepted' },
      })
      return this.toFamilyMemberType(member)
    }

    if (!name?.trim()) {
      throw new BadRequestException('Name required for guest join')
    }
    throw new BadRequestException('Passwordless registration not implemented')
  }

  private async toInviteType(invite: {
    id: string
    familyId: string
    email: string | null
    role: string
    status: string
    expiresAt: Date
    createdAt: Date
  }): Promise<InviteType> {
    return {
      id: invite.id,
      familyId: invite.familyId,
      email: invite.email ?? '',
      role: invite.role,
      status: invite.status,
      expiresAt: invite.expiresAt.toISOString(),
      createdAt: invite.createdAt.toISOString(),
    }
  }

  private toFamilyMemberType(member: {
    id: string
    familyId: string
    userId: string
    role: string
    joinedAt: Date
    user: { id: string; email: string; name: string; createdAt: Date; updatedAt: Date }
  }): FamilyMemberType {
    return {
      id: member.id,
      familyId: member.familyId,
      userId: member.userId,
      role: member.role as 'admin' | 'member',
      joinedAt: member.joinedAt.toISOString(),
      user: {
        id: member.user.id,
        email: member.user.email,
        name: member.user.name,
        createdAt: member.user.createdAt,
        updatedAt: member.user.updatedAt,
      },
    }
  }
}
