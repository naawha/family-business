import type { UserType } from './userType'

export interface TodoType {
  id: string
  familyId: string
  title: string
  description?: string
  completed: boolean
  isImportant: boolean
  dueDate?: string
  createdById: string
  createdBy?: UserType
  assignedToId?: string
  assignedTo?: UserType
  createdAt: string
  updatedAt: string
  completedAt?: string
}
