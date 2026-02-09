import { FC } from 'react'
import { AppProps } from 'next/app'
import { wrapper } from '@/app/api/wrapper'
import { Provider } from 'react-redux'
import ThemeProvider from '@/app/providers/ThemeProvider'

import '@/app/styles/main.css'

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const { store } = wrapper.useWrappedStore(pageProps)

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default App
