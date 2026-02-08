import type { ShoppingItemUnitType } from './shoppingItemType'

export type RecipeIngredientUnitType =
  | ShoppingItemUnitType // 'шт' | 'г' | 'кг' | 'л' | 'мл'
  | 'ст.л.' // Столовая ложка
  | 'ч.л.' // Чайная ложка
  | 'стакан' // Стакан
  | 'щепотка' // Щепотка
  | 'по вкусу' // По вкусу (без количества)

export const RECIPE_INGREDIENT_UNIT = {
  PIECE: 'шт',
  GRAM: 'г',
  KILOGRAM: 'кг',
  LITER: 'л',
  MILLILITER: 'мл',
  TABLESPOON: 'ст.л.',
  TEASPOON: 'ч.л.',
  CUP: 'стакан',
  PINCH: 'щепотка',
  TO_TASTE: 'по вкусу',
} as const satisfies Record<string, RecipeIngredientUnitType>

export interface RecipeIngredientType {
  id: string
  recipeId: string
  name: string
  quantity: number // Количество на одну порцию
  unit?: RecipeIngredientUnitType
  notes?: string // Дополнительные заметки
  order: number // Порядок отображения
  createdAt: string
  updatedAt: string
}
