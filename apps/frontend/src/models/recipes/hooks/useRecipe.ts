import { useGetRecipeByIdQuery } from '../api/recipesService'

const useRecipe = (id: string) => {
  const { data: recipe, isLoading, refetch } = useGetRecipeByIdQuery({ id }, { skip: !id })

  return { recipe, isLoading, refetch }
}

export default useRecipe
