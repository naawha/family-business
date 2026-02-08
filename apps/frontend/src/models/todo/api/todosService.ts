import { MainService, RTK_TAGS } from '@/shared/api'
import type * as Todos from '@family-business/types/modules/todos'

const TodoService = MainService.injectEndpoints({
  endpoints: (builder) => ({
    todoList: builder.query<Todos.ListResponseType, Todos.ListParamsType | void>({
      query: (params) => {
        const { familyId } = params ?? {}
        const url = '/todos'
        if (familyId) {
          return { url, params: { familyId } }
        }
        return { url }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: RTK_TAGS.Todo, id })),
              { type: RTK_TAGS.Todo, id: 'LIST' } as const,
            ]
          : [{ type: RTK_TAGS.Todo, id: 'LIST' } as const],
    }),

    getTodoById: builder.query<Todos.GetByIdResponseType, Todos.GetByIdParamsType>({
      query: ({ id }) => ({ url: `/todos/${id}` }),
      providesTags: (_, __, { id }) => [{ type: RTK_TAGS.Todo, id }],
    }),

    createTodo: builder.mutation<
      Todos.CreateResponseType,
      Todos.CreateBodyType & { familyId?: string }
    >({
      query: ({ familyId, ...body }) => {
        const url = '/todos'
        if (familyId) {
          return { url, method: 'POST', body, params: { familyId } }
        }
        return { url, method: 'POST', body }
      },
      invalidatesTags: () => [{ type: RTK_TAGS.Todo, id: 'LIST' } as const],
    }),

    updateTodo: builder.mutation<
      Todos.UpdateResponseType,
      Todos.UpdateParamsType & { body: Todos.UpdateBodyType }
    >({
      query: ({ id, body }) => ({
        url: `/todos/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: RTK_TAGS.Todo, id }],
    }),

    deleteTodo: builder.mutation<Todos.DeleteResponseType, Todos.DeleteParamsType>({
      query: ({ id }) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RTK_TAGS.Todo, id },
        { type: RTK_TAGS.Todo, id: 'LIST' },
      ],
    }),

    toggleTodo: builder.mutation<
      Todos.ToggleResponseType,
      Todos.ToggleParamsType & Todos.ToggleBodyType
    >({
      query: ({ id, completed }) => ({
        url: `/todos/${id}/toggle`,
        method: 'PATCH',
        body: { completed },
      }),
      invalidatesTags: (_, __, { id }) => [{ type: RTK_TAGS.Todo, id }],
    }),
  }),
})

export const {
  useToggleTodoMutation,
  useDeleteTodoMutation,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useGetTodoByIdQuery,
  useTodoListQuery,
} = TodoService
