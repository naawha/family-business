import type { RecipeType } from '../../../entities/recipeType'

export type ListParamsType = {
  familyId?: string
  search?: string
}
export type ListResponseType = RecipeType[]
