import { FC, ReactNode } from 'react'
import { Box, Button, Drawer } from '@mantine/core'
import PageHeader from '../PageHeader'
import { IconArrowLeft } from '@tabler/icons-react'
import styles from './BaseDrawer.module.css'

interface BaseDrawerPrimaryAction {
  label: string
  onClick: () => void | Promise<void>
  loading?: boolean
  disabled?: boolean
  color?: string
}

interface BaseDrawerProps {
  opened: boolean
  onClose: () => void
  /** Заголовок дровера — как заголовок экрана со списком */
  title?: ReactNode
  /** Контент справа от заголовка (например, иконки или доп. кнопка) */
  headerRight?: ReactNode
  /** Основной контент дровера (форма, детали и т.п.) */
  children: ReactNode
  /** Основная кнопка, прижатая к низу дровера */
  primaryAction?: BaseDrawerPrimaryAction
  /** Ширина дровера на десктопе (по умолчанию 480) */
  desktopSize?: string | number
}

/**
 * Базовый дровер:
 * - шапка как у экрана со списком (title + headerRight);
 * - скроллируемый контент;
 * - главная кнопка, прижатая к низу.
 */
const BaseDrawer: FC<BaseDrawerProps> = ({
  opened,
  onClose,
  title,
  headerRight,
  children,
  primaryAction,
  desktopSize = 480,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={desktopSize}
      withCloseButton
      overlayProps={{ opacity: 0.3, blur: 2 }}
      classNames={{
        header: styles.header,
        body: styles.body,
        title: styles.title,
        close: styles.close,
      }}
      title={
        <PageHeader
          title={title}
          leftSection={<IconArrowLeft onClick={onClose} size={35} />}
          rightSection={headerRight}
        />
      }
    >
      <Box className={styles.contentWrapper}>
        <Box className={styles.scrollableContent}>{children}</Box>

        {primaryAction && (
          <Box className={styles.footer}>
            <Button
              fullWidth
              onClick={primaryAction.onClick}
              loading={primaryAction.loading}
              disabled={primaryAction.disabled}
              color={primaryAction.color ?? 'primary'}
            >
              {primaryAction.label}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

export default BaseDrawer
