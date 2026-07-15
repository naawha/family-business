import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import { createTransform } from 'redux-persist'

const createNoopStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null)
  },
  setItem(_key: string, value: unknown) {
    return Promise.resolve(value)
  },
  removeItem(_key: string) {
    return Promise.resolve()
  },
})

/** localStorage на клиенте, noop на SSR */
export const persistStorage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

type ApiSliceState = {
  queries?: Record<string, unknown>
  provided?: unknown
  mutations?: unknown
  subscriptions?: unknown
  config?: unknown
}

/**
 * В persist кладём только queries + provided —
 * без subscriptions/mutations (они runtime-only).
 */
export const rtkQueryPersistTransform = createTransform(
  (inboundState: ApiSliceState) => {
    if (!inboundState || typeof inboundState !== 'object') return inboundState

    const queries: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(inboundState.queries ?? {})) {
      if (!entry || typeof entry !== 'object') continue
      const e = entry as { status?: string }
      // Сохраняем только успешно загруженные данные
      if (e.status === 'fulfilled') {
        queries[key] = entry
      }
    }

    return {
      queries,
      provided: inboundState.provided,
    }
  },
  (outboundState: ApiSliceState) => outboundState,
  { whitelist: ['mainService'] },
)

export const PERSIST_KEY = 'family-business'
