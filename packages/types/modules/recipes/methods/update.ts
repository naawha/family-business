import type { RecipeType, RecipeCategoryType } from '../../../entities/recipeType'
import type { RecipeIngredientUnitType } from '../../../entities/recipeIngredientType'

export type UpdateIngredientInput = {
  name: string
  quantity: number
  unit?: RecipeIngredientUnitType
  notes?: string
  order?: number
}

export type UpdateParamsType = { id: string }
export type UpdateBodyType = {
  name?: string
  imageUrl?: string
  category?: RecipeCategoryType
  servings?: number
  emoji?: string
  instructions?: string
  isPublic?: boolean
  ingredients?: UpdateIngredientInput[]
}
export type UpdateResponseType = RecipeType
