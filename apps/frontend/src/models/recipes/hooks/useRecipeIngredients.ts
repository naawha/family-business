import { useGetRecipeByIdQuery } from '../api/recipesService'

const useRecipeIngredients = (recipeId: string) => {
  const {
    data: recipe,
    isLoading,
    refetch,
  } = useGetRecipeByIdQuery({ id: recipeId }, { skip: !recipeId })

  const ingredients = recipe?.ingredients ?? []

  return { ingredients, isLoading, refetch }
}

export default useRecipeIngredients
