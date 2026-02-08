import { RecipeIngredientType } from './recipeIngredientType'
import type { UserType } from './userType'

export interface RecipeType {
  id: string
  familyId: string | null
  name: string
  imageUrl?: string
  category?: string
  servings: number
  emoji?: string // Эмодзи рецепта
  instructions?: string // Инструкции по приготовлению
  isPublic: boolean
  createdById: string
  createdBy?: UserType
  createdAt: string
  updatedAt: string
  ingredients?: RecipeIngredientType[]
}
