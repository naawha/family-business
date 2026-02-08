import { Injectable } from '@nestjs/common'
import { AuthService } from '../auth/auth.service'
import { UsersService } from '../users/users.service'
import { FamiliesService } from '../families/families.service'
import { InvitesService } from './invites.service'
import type {
  RegisterBodyType,
  RegisterResponseType,
  LoginBodyType,
  LoginResponseType,
  UpdateMeBodyType,
  FamiliesCreateBodyType,
  FamiliesUpdateBodyType,
  FamiliesInviteMemberBodyType,
  FamiliesCreateQrInviteBodyType,
  InvitesAcceptBodyType,
} from '@family-business/types/modules/accounts'

@Injectable()
export class AccountsService {
  constructor(
    private auth: AuthService,
    private users: UsersService,
    private families: FamiliesService,
    private invites: InvitesService,
  ) {}

  async register(body: RegisterBodyType): Promise<RegisterResponseType> {
    return this.auth.register(body)
  }

  async login(body: LoginBodyType): Promise<LoginResponseType> {
    return this.auth.login(body)
  }

  async getMe(userId: string) {
    const user = await this.users.findById(userId)
    if (!user) return null
    const { password: _, ...rest } = user
    return rest
  }

  async updateMe(userId: string, body: UpdateMeBodyType) {
    return this.users.update(userId, body)
  }

  async familiesList(userId: string) {
    return this.families.findAll(userId)
  }

  async familiesGetById(userId: string, familyId: string) {
    return this.families.findOneForUser(userId, familyId)
  }

  async familiesCreate(userId: string, body: FamiliesCreateBodyType) {
    return this.families.create(userId, body.name)
  }

  async familiesUpdate(userId: string, familyId: string, body: FamiliesUpdateBodyType) {
    return this.families.update(userId, familyId, body)
  }

  async familiesInviteMember(userId: string, familyId: string, body: FamiliesInviteMemberBodyType) {
    return this.invites.inviteByEmail(userId, familyId, body.email, 'member')
  }

  async familiesCreateQrInvite(
    userId: string,
    familyId: string,
    body?: FamiliesCreateQrInviteBodyType,
  ) {
    return this.invites.createQrInvite(userId, familyId, body?.role ?? 'member')
  }

  async familiesRemoveMember(userId: string, familyId: string, memberId: string): Promise<void> {
    return this.families.removeMember(userId, familyId, memberId)
  }

  async invitesList(userId: string) {
    const user = await this.users.findById(userId)
    if (!user?.email) return []
    return this.invites.getPendingForUser(user.email)
  }

  async invitesGetByToken(token: string) {
    return this.invites.getByToken(token)
  }

  async invitesAccept(token: string, userId: string | null, body?: InvitesAcceptBodyType) {
    return this.invites.accept(token, userId, body?.name ?? null)
  }
}
