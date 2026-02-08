export interface InviteType {
  id: string
  familyId: string
  email: string
  role: string
  status: string
  expiresAt: string
  createdAt: string
}

export interface QrInviteType {
  token: string
  expiresAt: string
  familyId: string
}

export interface InviteInfoType {
  familyId: string
  familyName: string
  expiresAt: string
  inviterName?: string
}
