import { useRecipesListQuery } from '../api/recipesService'

const useRecipes = (search?: string) => {
  const {
    data: recipes = [],
    isLoading,
    refetch,
  } = useRecipesListQuery(search ? { search } : undefined)

  return { recipes, isLoading, refetch }
}

export default useRecipes
