import type { UserType } from '../../../entities/userType'

export type RegisterBodyType = {
  email: string
  password: string
  name: string
}

export type RegisterResponseType = {
  user: UserType
  token: string
}
