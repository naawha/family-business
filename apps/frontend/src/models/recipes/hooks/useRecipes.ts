import { RecipeType } from '@family-business/types/entities'
import { useRecipesListQuery } from '../api/recipesService'
import { useMemo } from 'react'

const filterRecipes = (recipes: RecipeType[], query?: string): RecipeType[] => {
  return recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(query?.trim().toLowerCase() ?? ''),
  )
}

const useRecipes = (query?: string) => {
  const { data: recipes = [], isLoading, refetch } = useRecipesListQuery()

  const filteredRecipes: RecipeType[] = useMemo(
    () => filterRecipes(recipes, query),
    [recipes, query],
  )

  return { recipes: filteredRecipes, isLoading, refetch }
}

export default useRecipes
