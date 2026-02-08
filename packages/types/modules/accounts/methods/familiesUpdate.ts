import type { FamilyWithMembersType } from '../../../entities/familyType'

export type FamiliesUpdateParamsType = { id: string }
export type FamiliesUpdateBodyType = { name?: string }
export type FamiliesUpdateResponseType = FamilyWithMembersType
