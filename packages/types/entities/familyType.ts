import type { UserType } from './userType'

export interface FamilyType {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface FamilyMemberType {
  id: string
  familyId: string
  userId: string
  user?: UserType
  role: 'admin' | 'member'
  joinedAt: string
}

export interface FamilyWithMembersType extends FamilyType {
  members: FamilyMemberType[]
}
