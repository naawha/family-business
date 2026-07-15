import { FC, ReactNode } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import { getPersistor, type AppStore } from '@/app/api/store'
import { Center, Loader } from '@mantine/core'

interface PersistProviderProps {
  store: AppStore
  children: ReactNode
}

/**
 * Ждём rehydrate redux-persist на клиенте, чтобы оффлайн-данные
 * успели подтянуться до первого рендера списков.
 */
const PersistProvider: FC<PersistProviderProps> = ({ store, children }) => {
  if (typeof window === 'undefined') {
    return <>{children}</>
  }

  const persistor = getPersistor(store)
  if (!persistor) {
    return <>{children}</>
  }

  return (
    <PersistGate
      loading={
        <Center h="100vh">
          <Loader />
        </Center>
      }
      persistor={persistor}
    >
      {children}
    </PersistGate>
  )
}

export default PersistProvider
