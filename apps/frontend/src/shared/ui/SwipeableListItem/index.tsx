import { FC, ReactNode, useContext, useMemo, useState } from 'react'
import { Button, Group } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'
import { useSwipeable } from 'react-swipeable'

import { PullToRefreshActiveContext } from '../BaseList/PullToRefresh'
import styles from './SwipeableListItem.module.css'

interface SwipeableListItemProps {
  /** Основной контент строки (то, что видно всегда) */
  children: ReactNode
  /** Обработчик редактирования (кнопка с карандашом) */
  onEdit?: () => void
  /** Обработчик удаления (кнопка с корзиной) */
  onDelete?: () => void
  /** Порог, после которого считаем, что панель должна открыться, px */
  openThreshold?: number
}

/**
 * Базовый UI-компонент "строка со свайпом влево".
 *
 * - Веб-only, без привязки к Mantine.
 * - На мобильных: свайп влево открывает панель действий.
 * - На десктопе: можно открывать/закрывать панель мышью (drag).
 */
const SwipeableListItem: FC<SwipeableListItemProps> = ({
  children,
  onEdit,
  onDelete,
  openThreshold = 30,
}) => {
  const pullActive = useContext(PullToRefreshActiveContext)
  const [offset, setOffset] = useState(0) // отрицательное значение = сдвиг влево
  const [isOpen, setIsOpen] = useState(false)
  const [isClosingInstantly, setIsClosingInstantly] = useState(false)

  const hasActions = onEdit || onDelete
  const actionsCount = [onEdit, onDelete].filter(Boolean).length

  const closeInstantly = () => {
    setIsClosingInstantly(true)
    setIsOpen(false)
    setOffset(0)
    // Сбрасываем флаг после небольшой задержки, чтобы transition успел примениться
    setTimeout(() => setIsClosingInstantly(false), 0)
  }

  const clamp = (value: number, min: number, max: number) => {
    if (value < min) return min
    if (value > max) return max
    return value
  }

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const deltaX = -eventData.deltaX // хотим положительное значение для свайпа влево

      // Интересует только движение влево
      if (deltaX <= 0) {
        setOffset(isOpen ? -(60 * actionsCount) : 0)
        return
      }

      const nextOffset = clamp(-deltaX, -(60 * actionsCount), 0)
      setOffset(nextOffset)
    },
    onSwipedLeft: (eventData) => {
      const distance = Math.abs(eventData.deltaX)
      if (distance >= openThreshold) {
        setIsOpen(true)
        setOffset(-(60 * actionsCount))
      } else {
        setIsOpen(false)
        setOffset(0)
      }
    },
    onSwipedRight: () => {
      // Свайп вправо закрывает панель
      setIsOpen(false)
      setOffset(0)
    },
    trackMouse: true,
    trackTouch: true,
    delta: 5,
  })

  const contentStyle = useMemo(
    () => ({
      transform: `translateX(${offset}px)`,
      transition: isClosingInstantly ? 'none' : 'transform 160ms ease-out',
      willChange: 'transform',
      position: 'relative' as const,
      zIndex: 1,
    }),
    [offset, isClosingInstantly],
  )

  const actionsStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      top: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      // Фон по умолчанию — полупрозрачный, чтобы не конфликтовал с темой
      background: 'linear-gradient(to left, rgba(0,0,0,0.06), rgba(0,0,0,0))',
      zIndex: 0,
    }),
    [],
  )

  return (
    <div
      {...(pullActive ? {} : handlers)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'pan-y',
      }}
    >
      {hasActions && (
        <div style={actionsStyle}>
          <Group style={{ width: 60 * actionsCount }} className={styles.actions} gap={0}>
            {onEdit && (
              <Button
                className={styles.action}
                color="blue"
                onClick={(event) => {
                  event.stopPropagation()
                  closeInstantly()
                  onEdit()
                }}
                aria-label="Редактировать"
              >
                <IconPencil size={18} />
              </Button>
            )}
            {onDelete && (
              <Button
                className={styles.action}
                color="red"
                onClick={(event) => {
                  event.stopPropagation()
                  closeInstantly()
                  onDelete()
                }}
                aria-label="Удалить"
              >
                <IconTrash size={18} />
              </Button>
            )}
          </Group>
        </div>
      )}
      <div style={contentStyle}>{children}</div>
    </div>
  )
}

export default SwipeableListItem
