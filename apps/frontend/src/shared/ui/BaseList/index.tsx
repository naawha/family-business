import { FC, ReactNode, useState, useCallback } from 'react'
import { Center, Loader, Stack, Text } from '@mantine/core'

import PullToRefresh from './PullToRefresh'
import styles from './BaseList.module.css'

export interface BaseListOverlayProps<T> {
  item: T | null
  opened: boolean
  onClose: () => void
}

export interface BaseListItemRenderContext<T> {
  openView: (item: T) => void
  openEdit: (item: T) => void
}

interface BaseListProps<T> {
  /** Элементы списка */
  items: T[]
  /** Ключ для React */
  getKey?: (item: T) => string
  /** Заголовок / поисковая панель над списком (опционально) */
  header?: ReactNode
  /** Показывать ли спиннер загрузки */
  loading?: boolean
  /** Текст для пустого списка */
  emptyText: string
  /** Рендер одной строки списка */
  renderItem: (item: T, ctx: BaseListItemRenderContext<T>) => ReactNode
  /** Рендер дровера просмотра (по клику по строке) */
  renderViewOverlay?: (props: BaseListOverlayProps<T>) => ReactNode
  /** Рендер дровера/формы редактирования */
  renderEditOverlay?: (props: BaseListOverlayProps<T>) => ReactNode
  /** Pull-to-refresh: при свайпе вниз вызывается этот коллбек (должен вернуть Promise) */
  onRefresh?: () => void | Promise<void>
}

/**
 * Базовый вертикальный список с едиными отступами и поддержкой
 * типичных дроверов просмотра/редактирования.
 *
 * Не знает ничего про конкретные сущности — всё прокидывается через рендер-пропы.
 */
const BaseList = <T extends { id: string }>({
  items,
  getKey = (item: T) => item.id,
  header,
  loading,
  emptyText,
  renderItem,
  renderViewOverlay,
  renderEditOverlay,
  onRefresh,
}: BaseListProps<T>) => {
  const [viewItem, setViewItem] = useState<T | null>(null)
  const [editItem, setEditItem] = useState<T | null>(null)

  const hasItems = items.length > 0

  const handleRefresh = useCallback(() => {
    return Promise.resolve(onRefresh?.())
  }, [onRefresh])

  const renderContent = () => {
    if (loading && !hasItems) {
      return (
        <Center h={200}>
          <Loader />
        </Center>
      )
    }

    if (!loading && !hasItems) {
      return (
        <Center h={200} p="md">
          <Text ta="center" c="dimmed">
            {emptyText}
          </Text>
        </Center>
      )
    }

    return (
      <Stack className={styles.list}>
        {items
          .map((item) =>
            renderItem(item, {
              openView: (value) => setViewItem(value),
              openEdit: (value) => setEditItem(value),
            }),
          )
          .map((node, index) => (
            // Ключи берем из getKey, чтобы не требовать их в renderItem
            <Stack key={getKey(items[index])} gap={0}>
              {node}
            </Stack>
          ))}
      </Stack>
    )
  }

  const content = (
    <>
      {header}
      {renderContent()}
    </>
  )

  return (
    <>
      {onRefresh ? (
        <PullToRefresh
          onRefresh={handleRefresh}
          refreshingContent={
            <Center py="md">
              <Loader size="sm" />
            </Center>
          }
        >
          {content}
        </PullToRefresh>
      ) : (
        content
      )}

      {renderViewOverlay &&
        renderViewOverlay({ item: viewItem, opened: !!viewItem, onClose: () => setViewItem(null) })}

      {renderEditOverlay &&
        renderEditOverlay({ item: editItem, opened: !!editItem, onClose: () => setEditItem(null) })}
    </>
  )
}

export default BaseList
