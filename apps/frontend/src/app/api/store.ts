import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { createWrapper, type Context } from '@naawha/next-rtk-wrapper'
import MainService from '../api/service'

export const makeStore = (_context: Context) => {
  const store = configureStore({
    reducer: {
      [MainService.reducerPath]: MainService.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: _context,
        },
        serializableCheck: false,
      }).concat(MainService.middleware),
  })

  setupListeners(store.dispatch)

  return store
}

export const wrapper = createWrapper(makeStore)

export type RootState = ReturnType<ReturnType<typeof makeStore>['getState']>
export type AppDispatch = ReturnType<typeof makeStore>['dispatch']
