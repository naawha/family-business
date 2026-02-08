import type { UserType } from '../../../entities/userType'

export type LoginBodyType = {
  email: string
  password: string
}

export type LoginResponseType = {
  user: UserType
  token: string
}
