import type { ShoppingItemType, ShoppingItemUnitType } from '../../../entities/shoppingItemType'

export type CreateBodyType = {
  familyId: string
  name: string
  quantity?: number
  unit?: ShoppingItemUnitType
  category?: string
  recipeId?: string
}
export type CreateResponseType = ShoppingItemType
