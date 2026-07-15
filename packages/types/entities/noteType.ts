import type { UserType } from './userType'

export interface NoteType {
  id: string
  familyId: string
  title: string
  body?: string
  createdById: string
  createdBy?: UserType
  createdAt: string
  updatedAt: string
}
