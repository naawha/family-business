import { FC, ReactNode } from 'react'
import { Box, Group, Title } from '@mantine/core'

import styles from './PageHeader.module.css'

interface PageHeaderProps {
  className?: string
  /** Заголовок страницы / дровера */
  title: ReactNode
  /** Левая зона (иконка «назад», бургер и т.п.) */
  leftSection?: ReactNode
  /** Правая зона (кнопки-иконки, действия) */
  rightSection?: ReactNode
}

const PageHeader: FC<PageHeaderProps> = ({ title, leftSection, rightSection, className }) => {
  return (
    <Box className={styles.root} component="header">
      <Box
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          minHeight: 40,
        }}
      >
        {/* Левая и правая зоны прижаты к краям */}
        <Box
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {leftSection}
        </Box>

        <Box
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {rightSection}
        </Box>

        {/* Заголовок всегда строго по центру */}
        <Box
          style={{
            flex: 1,
            textAlign: 'center',
            minWidth: 0,
          }}
        >
          {title != null && (
            <Title order={4} lineClamp={1}>
              {title}
            </Title>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default PageHeader
