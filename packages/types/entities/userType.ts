export interface UserType {
  id: string
  email: string
  name: string
  avatarEmoji?: string | null
  avatarColor?: string | null
  createdAt: string | Date
  updatedAt: string | Date
}
