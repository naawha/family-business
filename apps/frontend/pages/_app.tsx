import { FC } from 'react'
import { AppProps } from 'next/app'
import { wrapper } from '@/app/api/wrapper'
import { Provider } from 'react-redux'
import ThemeProvider from '@/app/providers/ThemeProvider'
import NotificationProvider from '@/app/providers/NotificationProvider'
import PersistProvider from '@/app/providers/PersistProvider'
import OfflineBanner from '@/app/providers/OfflineBanner'
import type { AppStore } from '@/app/api/store'

import '@/app/styles/main.css'

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const { store } = wrapper.useWrappedStore(pageProps)

  return (
    <Provider store={store}>
      <ThemeProvider>
        <PersistProvider store={store as AppStore}>
          <OfflineBanner />
          <NotificationProvider>
            <Component {...pageProps} />
          </NotificationProvider>
        </PersistProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
