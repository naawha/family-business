import type { ShoppingItemType } from '../../../entities/shoppingItemType'

export type ToggleParamsType = { id: string }
export type ToggleBodyType = { purchased: boolean }
export type ToggleResponseType = ShoppingItemType
