import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { createWrapper, type Context } from '@naawha/next-rtk-wrapper'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  type Persistor,
  type PersistConfig,
} from 'redux-persist'
import MainService from '../api/service'
import { PERSIST_KEY, persistStorage, rtkQueryPersistTransform } from './persist'

const rootReducer = combineReducers({
  [MainService.reducerPath]: MainService.reducer,
})

type RootReducerState = ReturnType<typeof rootReducer>

const persistConfig: PersistConfig<RootReducerState> = {
  key: PERSIST_KEY,
  storage: persistStorage,
  whitelist: [MainService.reducerPath],
  transforms: [rtkQueryPersistTransform],
  timeout: 2000,
}

// redux-persist typing конфликтует с CombinedState RTK Query — кастим осознанно
const persistedReducer = persistReducer(
  persistConfig as PersistConfig<any>,
  rootReducer as any,
) as typeof rootReducer

export const makeStore = (_context: Context) => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: _context,
        },
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(MainService.middleware),
  })

  setupListeners(store.dispatch)

  if (typeof window !== 'undefined') {
    const storeWithPersistor = store as typeof store & { __persistor?: Persistor }
    storeWithPersistor.__persistor = persistStore(store)
  }

  return store
}

export const wrapper = createWrapper(makeStore)

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export function getPersistor(store: AppStore): Persistor | undefined {
  return (store as AppStore & { __persistor?: Persistor }).__persistor
}
