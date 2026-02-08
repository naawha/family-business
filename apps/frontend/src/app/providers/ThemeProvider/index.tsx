import { FC, ReactNode } from 'react'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { colors } from '@family-business/theme'

import '@mantine/core/styles.layer.css'
import '@mantine/notifications/styles.layer.css'
import '@mantine/dates/styles.layer.css'

const theme = createTheme({
  primaryColor: 'green',
  colors: {
    green: [
      colors.primary,
      colors.primary,
      colors.primary,
      colors.primary,
      colors.primary,
      colors.primary,
      colors.primary,
      colors.primary,
      colors.primary,
      colors.primary,
    ],
  },
})

interface ThemeProviderProps {
  children: ReactNode
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications />
      <ModalsProvider>{children}</ModalsProvider>
    </MantineProvider>
  )
}

export default ThemeProvider
