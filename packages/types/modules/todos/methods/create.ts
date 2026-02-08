import type { TodoType } from '../../../entities/todoType'

export type CreateBodyType = {
  title: string
  description?: string
  isImportant?: boolean
  dueDate?: string
  assignedToId?: string
}
export type CreateResponseType = TodoType
