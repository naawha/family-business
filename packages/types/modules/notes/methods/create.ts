import type { NoteType } from '../../../entities/noteType'

export type CreateBodyType = {
  title: string
  body?: string
}
export type CreateResponseType = NoteType
