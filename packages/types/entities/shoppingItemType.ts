import type { UserType } from './userType'

export type ShoppingItemUnitType = 'шт' | 'г' | 'кг' | 'л' | 'мл'

export const SHOPPING_ITEM_UNIT = {
  PIECE: 'шт',
  GRAM: 'г',
  KILOGRAM: 'кг',
  LITER: 'л',
  MILLILITER: 'мл',
} as const satisfies Record<string, ShoppingItemUnitType>

export interface ShoppingItemType {
  id: string
  familyId: string
  name: string
  quantity?: number
  unit?: ShoppingItemUnitType
  category?: string
  purchased: boolean
  createdById: string
  createdBy?: UserType
  recipeId?: string
  recipe?: { id: string; name: string }
  createdAt: string
  updatedAt: string
}
