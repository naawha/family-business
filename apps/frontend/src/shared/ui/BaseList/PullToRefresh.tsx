import { createContext, FC, ReactNode, useCallback, useRef, useState } from 'react'
import { Center, Loader, Text } from '@mantine/core'

/** Когда true, горизонтальный свайп на элементах списка должен быть отключён (идёт pull-to-refresh). */
export const PullToRefreshActiveContext = createContext(false)

const PULL_ZONE_TOP_PX = 100
const SCROLL_TOP_THRESHOLD = 10
const PULL_THRESHOLD_PX = 56
const MAX_PULL_PX = 96
const INDICATOR_HEIGHT_PX = 56
const COMMIT_SLOP_PX = 15

interface PullToRefreshProps {
  onRefresh: () => void | Promise<void>
  children: ReactNode
  refreshingContent?: ReactNode
}

/**
 * Кастомный pull-to-refresh, который не конфликтует со свайпом влево по элементам:
 * - срабатывает только при скролле вверху (scrollTop ≈ 0);
 * - срабатывает только если касание началось в верхней зоне (первые PULL_ZONE_TOP_PX px);
 * - если движение явно горизонтальное — жест не перехватывается (остаётся свайп по элементу).
 * Визуально: при тяге вниз сдвигается вся страница (контент), сверху появляется зона индикатора
 * с подсказкой «Потяните» / «Отпустите» / спиннер.
 */
const PullToRefresh: FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  refreshingContent = (
    <Center py="md">
      <Loader size="sm" />
    </Center>
  ),
}) => {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullGestureActive, setPullGestureActive] = useState(false)
  const pullDistanceRef = useRef(0)
  const stateRef = useRef<{
    isPulling: boolean
    committed: boolean
    startY: number
    startX: number
  }>({ isPulling: false, committed: false, startY: 0, startX: 0 })

  const getScrollTop = useCallback(() => {
    return window.scrollY ?? document.documentElement.scrollTop ?? 0
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isRefreshing) return
      const scrollTop = getScrollTop()
      if (scrollTop > SCROLL_TOP_THRESHOLD) return
      const touch = e.touches[0]
      if (!touch) return
      if (touch.clientY > PULL_ZONE_TOP_PX) return
      stateRef.current = {
        isPulling: true,
        committed: false,
        startY: touch.clientY,
        startX: touch.clientX,
      }
      setPullDistance(0)
    },
    [getScrollTop, isRefreshing],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const s = stateRef.current
      if (!s.isPulling) return
      const touch = e.touches[0]
      if (!touch) return
      const deltaY = touch.clientY - s.startY
      const deltaX = touch.clientX - s.startX
      if (!s.committed) {
        if (Math.abs(deltaX) > Math.abs(deltaY) + COMMIT_SLOP_PX) {
          stateRef.current = { ...s, isPulling: false }
          setPullDistance(0)
          return
        }
        if (deltaY > COMMIT_SLOP_PX) {
          stateRef.current = { ...s, committed: true }
          setPullGestureActive(true)
        } else if (deltaY < -COMMIT_SLOP_PX) {
          stateRef.current = { ...s, isPulling: false }
          return
        }
      }
      if (stateRef.current.committed && deltaY > 0) {
        const distance = Math.min(deltaY, MAX_PULL_PX)
        pullDistanceRef.current = distance
        setPullDistance(distance)
        e.preventDefault()
      }
    },
    [],
  )

  const handleTouchEnd = useCallback(() => {
    const s = stateRef.current
    if (!s.isPulling) return
    const currentPull = pullDistanceRef.current
    if (s.committed && currentPull >= PULL_THRESHOLD_PX) {
      setIsRefreshing(true)
      Promise.resolve(onRefresh())
        .finally(() => setIsRefreshing(false))
    }
    stateRef.current = { isPulling: false, committed: false, startY: 0, startX: 0 }
    pullDistanceRef.current = 0
    setPullDistance(0)
    setPullGestureActive(false)
  }, [onRefresh])

  const pullActive = pullGestureActive || isRefreshing
  const showIndicator = pullDistance > 0 || isRefreshing
  const contentOffset = isRefreshing ? INDICATOR_HEIGHT_PX : pullDistance
  const readyToRelease = pullDistance >= PULL_THRESHOLD_PX

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {showIndicator && (
        <div
          style={{
            height: contentOffset,
            minHeight: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: isRefreshing ? 'height 0.2s ease-out' : 'none',
            background: 'var(--mantine-color-body)',
          }}
        >
          {isRefreshing ? (
            refreshingContent
          ) : (
            <Center style={{ height: INDICATOR_HEIGHT_PX }}>
              {readyToRelease ? (
                <Text size="sm" c="dimmed">
                  Отпустите для обновления
                </Text>
              ) : (
                <Text size="sm" c="dimmed">
                  Потяните вниз
                </Text>
              )}
            </Center>
          )}
        </div>
      )}
      <PullToRefreshActiveContext.Provider value={pullActive}>
        <div
          style={{
            transform: `translateY(${contentOffset}px)`,
            transition: isRefreshing ? 'transform 0.2s ease-out' : 'none',
          }}
        >
          {children}
        </div>
      </PullToRefreshActiveContext.Provider>
    </div>
  )
}

export default PullToRefresh
