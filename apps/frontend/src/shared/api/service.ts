import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RTK_TAGS } from './tags'
import Cookies from 'js-cookie'
import type { FetchArgs, BaseQueryApi, FetchBaseQueryError } from '@reduxjs/toolkit/query'
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

const rawBaseQuery = async (args: FetchArgs, api: BaseQueryApi, extraOptions: object) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: getBaseUrl(),
    prepareHeaders: (headers, apiCtx) => {
      const token =
        typeof window === 'undefined'
          ? (apiCtx as { extra?: { req?: { cookies?: Record<string, string> } } }).extra?.req
              ?.cookies?.[TOKEN_COOKIE_KEY]
          : Cookies.get(TOKEN_COOKIE_KEY)

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  })

  return baseQuery(args, api, extraOptions)
}

/** Не ходим в сеть оффлайн — оставляем данные из persist/кэша. */
const dynamicBaseQuery = async (args: FetchArgs, api: BaseQueryApi, extraOptions: object) => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      error: {
        status: 'CUSTOM_ERROR',
        error: 'OFFLINE',
        data: 'OFFLINE',
      } as FetchBaseQueryError & { data: string },
    }
  }

  return rawBaseQuery(args, api, extraOptions)
}

const MainService = createApi({
  reducerPath: 'mainService',
  baseQuery: dynamicBaseQuery,
  /** Держим списки в памяти долго — оффлайн-просмотр между экранами */
  keepUnusedDataFor: 60 * 60 * 24 * 7,
  extractRehydrationInfo(action: any, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload?.[reducerPath]
    }
  },
  tagTypes: [...Object.values(RTK_TAGS)],
  endpoints: () => ({}),
})

export default MainService
