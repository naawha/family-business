import type { TodoType } from '../../../entities/todoType'

export type ToggleParamsType = { id: string }
export type ToggleBodyType = { completed: boolean }
export type ToggleResponseType = TodoType
