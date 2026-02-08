import { MainService, RTK_TAGS } from '@/shared/api'
import type * as Accounts from '@family-business/types/modules/accounts'

const accountsService = MainService.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<Accounts.RegisterResponseType, Accounts.RegisterBodyType>({
      query: (body) => ({
        url: '/accounts/register',
        method: 'POST',
        body,
      }),
    }),

    login: builder.mutation<Accounts.LoginResponseType, Accounts.LoginBodyType>({
      query: (body) => ({
        url: '/accounts/login',
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query<Accounts.GetMeResponseType, void>({
      query: () => ({ url: '/accounts/me' }),
      providesTags: [RTK_TAGS.User],
    }),

    updateMe: builder.mutation<Accounts.UpdateMeResponseType, Accounts.UpdateMeBodyType>({
      query: (body) => ({
        url: '/accounts/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [RTK_TAGS.User, { type: RTK_TAGS.Family, id: 'LIST' }],
    }),

    familiesList: builder.query<Accounts.FamiliesListResponseType, void>({
      query: () => ({ url: '/accounts/me/families' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: RTK_TAGS.Family, id })),
              { type: RTK_TAGS.Family, id: 'LIST' },
            ]
          : [{ type: RTK_TAGS.Family, id: 'LIST' }],
    }),

    familiesGetById: builder.query<
      Accounts.FamiliesGetByIdResponseType,
      Accounts.FamiliesGetByIdParamsType
    >({
      query: ({ id }) => ({ url: `/accounts/me/families/${id}` }),
      providesTags: (_, __, { id }) => [{ type: RTK_TAGS.Family, id }],
    }),

    familiesCreate: builder.mutation<
      Accounts.FamiliesCreateResponseType,
      Accounts.FamiliesCreateBodyType
    >({
      query: (body) => ({
        url: '/accounts/me/families',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: RTK_TAGS.Family, id: 'LIST' }],
    }),

    familiesUpdate: builder.mutation<
      Accounts.FamiliesUpdateResponseType,
      Accounts.FamiliesUpdateParamsType & { body: Accounts.FamiliesUpdateBodyType }
    >({
      query: ({ id, body }) => ({
        url: `/accounts/me/families/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: RTK_TAGS.Family, id }],
    }),

    familiesInviteMember: builder.mutation<
      Accounts.FamiliesInviteMemberResponseType,
      Accounts.FamiliesInviteMemberParamsType & {
        body: Accounts.FamiliesInviteMemberBodyType
      }
    >({
      query: ({ id, body }) => ({
        url: `/accounts/me/families/${id}/invites`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: RTK_TAGS.Family, id }, RTK_TAGS.Invite],
    }),

    familiesCreateQrInvite: builder.mutation<
      Accounts.FamiliesCreateQrInviteResponseType,
      Accounts.FamiliesCreateQrInviteParamsType & {
        body?: Accounts.FamiliesCreateQrInviteBodyType
      }
    >({
      query: ({ id, body }) => ({
        url: `/accounts/me/families/${id}/invites/qr`,
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: (_, __, { id }) => [{ type: RTK_TAGS.Family, id }],
    }),

    familiesRemoveMember: builder.mutation<
      Accounts.FamiliesRemoveMemberResponseType,
      Accounts.FamiliesRemoveMemberParamsType
    >({
      query: ({ id, memberId }) => ({
        url: `/accounts/me/families/${id}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { id }) =>
        [
          { type: RTK_TAGS.Family, id },
          { type: RTK_TAGS.Family, id: 'LIST' },
        ] as const,
    }),

    invitesList: builder.query<Accounts.InvitesListResponseType, void>({
      query: () => ({ url: '/accounts/me/invites' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ token }) => ({ type: RTK_TAGS.Invite, id: token })),
              { type: RTK_TAGS.Invite, id: 'LIST' },
            ]
          : [{ type: RTK_TAGS.Invite, id: 'LIST' }],
    }),

    invitesGetByToken: builder.query<
      Accounts.InvitesGetByTokenResponseType,
      Accounts.InvitesGetByTokenParamsType
    >({
      query: ({ token }) => ({ url: `/accounts/invites/${token}` }),
    }),

    invitesAccept: builder.mutation<
      Accounts.InvitesAcceptResponseType,
      Accounts.InvitesAcceptParamsType & {
        body?: Accounts.InvitesAcceptBodyType
      }
    >({
      query: ({ token, body }) => ({
        url: `/accounts/invites/${token}/accept`,
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: [
        RTK_TAGS.User,
        { type: RTK_TAGS.Family, id: 'LIST' },
        { type: RTK_TAGS.Invite, id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useFamiliesListQuery,
  useFamiliesGetByIdQuery,
  useFamiliesCreateMutation,
  useFamiliesUpdateMutation,
  useFamiliesInviteMemberMutation,
  useFamiliesCreateQrInviteMutation,
  useFamiliesRemoveMemberMutation,
  useInvitesListQuery,
  useInvitesGetByTokenQuery,
  useInvitesAcceptMutation,
} = accountsService
