import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RTK_TAGS } from './tags'
import Cookies from 'js-cookie'
import type { FetchArgs, BaseQueryApi } from '@reduxjs/toolkit/query'
import { HYDRATE } from '@naawha/next-rtk-wrapper'

const TOKEN_COOKIE_KEY = 'family-business-token'

// На сервере (SSR) — внутренний URL, быстрее и без выхода в сеть. В браузере — публичный.
// Все запросы идут с префиксом /api (nginx: /api -> 3000, остальное -> 3001).
const getBaseUrl = () => {
  const host =
    typeof window === 'undefined'
      ? process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3000'
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  return host.replace(/\/$/, '') + '/api'
}

const dynamicBaseQuery = async (args: FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, api) => {
      const token =
        typeof window === 'undefined'
          ? (api as any).extra?.req?.cookies[TOKEN_COOKIE_KEY]
          : Cookies.get(TOKEN_COOKIE_KEY)

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  })

  return rawBaseQuery(args, api, extraOptions)
}

const MainService = createApi({
  reducerPath: 'mainService',
  baseQuery: dynamicBaseQuery,
  extractRehydrationInfo(action: any, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
  },
  tagTypes: [...Object.values(RTK_TAGS)],
  endpoints: (builder) => ({}),
})

export default MainService
