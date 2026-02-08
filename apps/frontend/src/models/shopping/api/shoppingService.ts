import { MainService, RTK_TAGS } from '@/shared/api'
import type * as Shopping from '@family-business/types/modules/shopping'

const shoppingService = MainService.injectEndpoints({
  endpoints: (builder) => ({
    shoppingList: builder.query<Shopping.ListResponseType, Shopping.ListParamsType | void>({
      query: () => ({
        url: `/shopping`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }: { id: string }) => ({ type: RTK_TAGS.ShoppingItem, id })),
              { type: RTK_TAGS.ShoppingItem, id: 'LIST' } as const,
            ]
          : [{ type: RTK_TAGS.ShoppingItem, id: 'LIST' } as const],
    }),

    getShoppingItemById: builder.query<Shopping.GetByIdResponseType, Shopping.GetByIdParamsType>({
      query: ({ id }) => ({ url: `/shopping/${id}` }),
      providesTags: (_, __, { id }) => [{ type: RTK_TAGS.ShoppingItem, id }],
    }),

    createShoppingItem: builder.mutation<Shopping.CreateResponseType, Shopping.CreateBodyType>({
      query: (body) => ({
        url: '/shopping',
        method: 'POST',
        body,
      }),
      invalidatesTags: () => [{ type: RTK_TAGS.ShoppingItem, id: 'LIST' } as const],
    }),

    updateShoppingItem: builder.mutation<
      Shopping.UpdateResponseType,
      Shopping.UpdateParamsType & { body: Shopping.UpdateBodyType }
    >({
      query: ({ id, body }) => ({
        url: `/shopping/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: RTK_TAGS.ShoppingItem, id }],
    }),

    deleteShoppingItem: builder.mutation<Shopping.DeleteResponseType, Shopping.DeleteParamsType>({
      query: ({ id }) => ({
        url: `/shopping/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RTK_TAGS.ShoppingItem, id },
        { type: RTK_TAGS.ShoppingItem, id: 'LIST' },
      ],
    }),

    toggleShoppingItem: builder.mutation<
      Shopping.ToggleResponseType,
      Shopping.ToggleParamsType & Shopping.ToggleBodyType
    >({
      query: ({ id, purchased }) => ({
        url: `/shopping/${id}`,
        method: 'PATCH',
        body: { purchased },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: RTK_TAGS.ShoppingItem, id }],
    }),
  }),
})

export const {
  useShoppingListQuery,
  useGetShoppingItemByIdQuery,
  useCreateShoppingItemMutation,
  useToggleShoppingItemMutation,
  useDeleteShoppingItemMutation,
  useUpdateShoppingItemMutation,
} = shoppingService
