import { MainService, RTK_TAGS } from '@/shared/api'
import type * as Recipes from '@family-business/types/modules/recipes'

const recipesService = MainService.injectEndpoints({
  endpoints: (builder) => ({
    recipesList: builder.query<Recipes.ListResponseType, Recipes.ListParamsType | undefined>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params?.familyId) searchParams.append('familyId', params?.familyId)
        if (params?.search) searchParams.append('search', params?.search)
        const query = searchParams.toString()
        return {
          url: `/recipes${query ? `?${query}` : ''}`,
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({ type: RTK_TAGS.Recipe, id })),
              { type: RTK_TAGS.Recipe, id: 'LIST' } as const,
            ]
          : [{ type: RTK_TAGS.Recipe, id: 'LIST' } as const],
    }),

    getRecipeById: builder.query<Recipes.GetByIdResponseType, Recipes.GetByIdParamsType>({
      query: ({ id }) => ({ url: `/recipes/${id}` }),
      providesTags: (_, __, { id }) => [{ type: RTK_TAGS.Recipe, id }],
    }),

    createRecipe: builder.mutation<Recipes.CreateResponseType, Recipes.CreateBodyType>({
      query: (body) => ({
        url: '/recipes',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [{ type: RTK_TAGS.Recipe, id: 'LIST' } as const],
    }),

    updateRecipe: builder.mutation<
      Recipes.UpdateResponseType,
      Recipes.UpdateParamsType & { body: Recipes.UpdateBodyType }
    >({
      query: ({ id, body }) => ({
        url: `/recipes/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RTK_TAGS.Recipe, id },
        { type: RTK_TAGS.Recipe, id: 'LIST' },
      ],
    }),

    deleteRecipe: builder.mutation<Recipes.DeleteResponseType, Recipes.DeleteParamsType>({
      query: ({ id }) => ({
        url: `/recipes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RTK_TAGS.Recipe, id },
        { type: RTK_TAGS.Recipe, id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useRecipesListQuery,
  useGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipesService
