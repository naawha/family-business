import { FC, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IconPencil, IconTrash } from '@tabler/icons-react'

import { PullToRefreshActiveContext } from '../BaseList/PullToRefresh'

import styles from './SwipeableListItem.module.css'

interface SwipeableListItemProps {
  children: ReactNode
  onEdit?: () => void
  onDelete?: () => void
  /** Порог «залипания» панели, доля от ширины кнопок (0..1) */
  openRatio?: number
}

type Axis = 'undecided' | 'horizontal' | 'vertical'

const ACTION_WIDTH = 64
const AXIS_SLOP_PX = 8
const CLOSE_ON_SCROLL = true

/**
 * Свайп влево по всей строке (Pointer Events).
 * Ось фиксируется после AXIS_SLOP_PX: горизонталь → свайп, вертикаль → скролл.
 */
const SwipeableListItem: FC<SwipeableListItemProps> = ({
  children,
  onEdit,
  onDelete,
  openRatio = 0.4,
}) => {
  const pullActive = useContext(PullToRefreshActiveContext)
  const actions = [onEdit, onDelete].filter(Boolean)
  const actionsCount = actions.length
  const actionsWidth = actionsCount * ACTION_WIDTH

  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const offsetRef = useRef(0)
  const openRef = useRef(false)
  const axisRef = useRef<Axis>('undecided')
  const startXRef = useRef(0)
  const startYRef = useRef(0)
  const startOffsetRef = useRef(0)
  const pointerIdRef = useRef<number | null>(null)
  const didSwipeRef = useRef(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const setOffsetBoth = useCallback((value: number) => {
    offsetRef.current = value
    setOffset(value)
  }, [])

  const close = useCallback(() => {
    openRef.current = false
    setOffsetBoth(0)
  }, [setOffsetBoth])

  const open = useCallback(() => {
    openRef.current = true
    setOffsetBoth(-actionsWidth)
  }, [actionsWidth, setOffsetBoth])

  // Закрывать открытую панель при скролле страницы
  useEffect(() => {
    if (!CLOSE_ON_SCROLL) return
    const onScroll = () => {
      if (openRef.current || offsetRef.current !== 0) close()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [close])

  // Клик снаружи строки — закрыть
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!openRef.current) return
      if (rootRef.current?.contains(e.target as Node)) return
      close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [close])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pullActive || actionsCount === 0) return
    // Только основная кнопка мыши / тач
    if (e.pointerType === 'mouse' && e.button !== 0) return

    pointerIdRef.current = e.pointerId
    axisRef.current = 'undecided'
    didSwipeRef.current = false
    startXRef.current = e.clientX
    startYRef.current = e.clientY
    startOffsetRef.current = offsetRef.current
    setIsDragging(true)

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return

    const dx = e.clientX - startXRef.current
    const dy = e.clientY - startYRef.current

    if (axisRef.current === 'undecided') {
      if (Math.abs(dx) < AXIS_SLOP_PX && Math.abs(dy) < AXIS_SLOP_PX) return

      // Явный перевес по оси — иначе даём скроллу победить
      if (Math.abs(dx) > Math.abs(dy) + 2) {
        axisRef.current = 'horizontal'
      } else {
        axisRef.current = 'vertical'
        // Отпускаем захват, чтобы скролл работал свободно
        try {
          e.currentTarget.releasePointerCapture(e.pointerId)
        } catch {
          // ignore
        }
        pointerIdRef.current = null
        setIsDragging(false)
        return
      }
    }

    if (axisRef.current !== 'horizontal') return

    e.preventDefault()
    didSwipeRef.current = true

    const next = Math.min(0, Math.max(-actionsWidth, startOffsetRef.current + dx))
    setOffsetBoth(next)
  }

  const finishGesture = (pointerId: number, target: HTMLDivElement) => {
    if (pointerIdRef.current !== pointerId) return
    pointerIdRef.current = null
    setIsDragging(false)

    try {
      target.releasePointerCapture(pointerId)
    } catch {
      // ignore
    }

    if (axisRef.current !== 'horizontal') {
      axisRef.current = 'undecided'
      return
    }

    const threshold = actionsWidth * openRatio
    if (Math.abs(offsetRef.current) >= threshold) {
      open()
    } else {
      close()
    }
    axisRef.current = 'undecided'
  }

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    finishGesture(e.pointerId, e.currentTarget)
  }

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    finishGesture(e.pointerId, e.currentTarget)
  }

  // Не даём клику по строке сработать сразу после свайпа
  const onClickCapture = (e: React.MouseEvent) => {
    if (didSwipeRef.current) {
      e.preventDefault()
      e.stopPropagation()
      didSwipeRef.current = false
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    close()
    onEdit?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    close()
    onDelete?.()
  }

  if (actionsCount === 0) {
    return <>{children}</>
  }

  return (
    <div
      ref={rootRef}
      className={styles.root}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
    >
      <div className={styles.actions} style={{ width: actionsWidth }} aria-hidden={offset === 0}>
        {onEdit && (
          <button type="button" className={styles.actionEdit} onClick={handleEdit} aria-label="Редактировать">
            <IconPencil size={18} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className={styles.actionDelete}
            onClick={handleDelete}
            aria-label="Удалить"
          >
            <IconTrash size={18} />
          </button>
        )}
      </div>

      <div
        className={styles.content}
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 160ms ease-out',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default SwipeableListItem
