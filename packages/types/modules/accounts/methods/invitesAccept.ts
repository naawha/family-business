import type { UserType } from '../../../entities/userType'
import type { FamilyMemberType } from '../../../entities/familyType'

export type InvitesAcceptParamsType = { token: string }
export type InvitesAcceptBodyType = { name?: string }
export type InvitesAcceptResponseType =
  | { user: UserType; token: string }
  | FamilyMemberType
