import type { ShoppingItemType, ShoppingItemUnitType } from '../../../entities/shoppingItemType'

export type UpdateParamsType = { id: string }
export type UpdateBodyType = {
  name?: string
  quantity?: number
  unit?: ShoppingItemUnitType
  category?: string
  purchased?: boolean
}
export type UpdateResponseType = ShoppingItemType
