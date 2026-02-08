import type { UserType } from '../../../entities/userType'

export type UpdateMeBodyType = {
  name?: string
  avatarEmoji?: string | null
  avatarColor?: string | null
}
export type UpdateMeResponseType = UserType
