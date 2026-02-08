import type { TodoType } from '../../../entities/todoType'

export type UpdateParamsType = { id: string }
export type UpdateBodyType = {
  title?: string
  description?: string
  isImportant?: boolean
  dueDate?: string
  completed?: boolean
  assignedToId?: string | null
}
export type UpdateResponseType = TodoType
