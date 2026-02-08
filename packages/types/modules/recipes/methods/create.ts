import type { RecipeType, RecipeCategoryType } from '../../../entities/recipeType'
import type { RecipeIngredientUnitType } from '../../../entities/recipeIngredientType'

export type CreateIngredientInput = {
  name: string
  quantity: number
  unit?: RecipeIngredientUnitType
  notes?: string
  order?: number
}

export type CreateBodyType = {
  familyId?: string | null
  name: string
  imageUrl?: string
  category?: RecipeCategoryType
  servings?: number
  emoji?: string
  instructions?: string
  isPublic?: boolean
  ingredients?: CreateIngredientInput[]
}
export type CreateResponseType = RecipeType
