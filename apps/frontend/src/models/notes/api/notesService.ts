import { MainService, RTK_TAGS } from '@/shared/api'
import type * as Notes from '@family-business/types/modules/notes'

const NotesService = MainService.injectEndpoints({
  endpoints: (builder) => ({
    notesList: builder.query<Notes.ListResponseType, Notes.ListParamsType | void>({
      query: (params) => {
        const { familyId } = params ?? {}
        const url = '/notes'
        if (familyId) {
          return { url, params: { familyId } }
        }
        return { url }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: RTK_TAGS.Note, id })),
              { type: RTK_TAGS.Note, id: 'LIST' } as const,
            ]
          : [{ type: RTK_TAGS.Note, id: 'LIST' } as const],
    }),

    getNoteById: builder.query<Notes.GetByIdResponseType, Notes.GetByIdParamsType>({
      query: ({ id }) => ({ url: `/notes/${id}` }),
      providesTags: (_, __, { id }) => [{ type: RTK_TAGS.Note, id }],
    }),

    createNote: builder.mutation<
      Notes.CreateResponseType,
      Notes.CreateBodyType & { familyId?: string }
    >({
      query: ({ familyId, ...body }) => {
        const url = '/notes'
        if (familyId) {
          return { url, method: 'POST', body, params: { familyId } }
        }
        return { url, method: 'POST', body }
      },
      invalidatesTags: () => [{ type: RTK_TAGS.Note, id: 'LIST' } as const],
    }),

    updateNote: builder.mutation<
      Notes.UpdateResponseType,
      Notes.UpdateParamsType & { body: Notes.UpdateBodyType }
    >({
      query: ({ id, body }) => ({
        url: `/notes/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RTK_TAGS.Note, id },
        { type: RTK_TAGS.Note, id: 'LIST' },
      ],
    }),

    deleteNote: builder.mutation<Notes.DeleteResponseType, Notes.DeleteParamsType>({
      query: ({ id }) => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: RTK_TAGS.Note, id },
        { type: RTK_TAGS.Note, id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useDeleteNoteMutation,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useGetNoteByIdQuery,
  useNotesListQuery,
} = NotesService
