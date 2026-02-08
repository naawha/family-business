import { FC, ReactNode } from 'react'
import { Box, Drawer } from '@mantine/core'

interface ResponsiveFormOverlayProps {
  opened: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  /** Ширина "экрана" на десктопе (по умолчанию 480) */
  desktopSize?: string | number
}

/**
 * Общий контейнер для форм создания/редактирования.
 *
 * Всегда рендерит Drawer, чтобы избежать мигания Modal→Drawer:
 * - на мобильных — full-screen Drawer справа (size="100%");
 * - на десктопе — Drawer фиксированной ширины (desktopSize).
 */
const ResponsiveFormOverlay: FC<ResponsiveFormOverlayProps> = ({
  opened,
  onClose,
  title,
  children,
  desktopSize = 480,
}) => {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      size={desktopSize}
      withCloseButton
      title={title}
      padding="md"
      overlayProps={{ opacity: 0.3, blur: 2 }}
    >
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box
          style={{
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
    </Drawer>
  )
}

export default ResponsiveFormOverlay
