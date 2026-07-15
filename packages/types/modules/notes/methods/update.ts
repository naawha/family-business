import type { NoteType } from '../../../entities/noteType'

export type UpdateParamsType = { id: string }
export type UpdateBodyType = {
  title?: string
  body?: string
}
export type UpdateResponseType = NoteType
