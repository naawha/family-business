import { FC, ReactNode, useCallback } from 'react'
import { ActionIcon, Box, Checkbox, Group, Paper, Text } from '@mantine/core'
import { IconPencil, IconTrash } from '@tabler/icons-react'

import SwipeableListItem from '../SwipeableListItem'
import { notifications } from '@mantine/notifications'

import styles from './BaseListItem.module.css'

interface BaseListItemProps {
  /** Уникальный ID элемента для коллбеков свайпа */
  itemId: string

  /** Значение чекбокса (если нужен) */
  checked?: boolean

  /** Название элемента */
  name: string

  /** Название элемента (если не строка) */
  nameAddon?: ReactNode

  /** Описание элемента */
  description?: ReactNode

  /** Дополнительный текст (под описанием) */
  helpText?: ReactNode

  /** Дополнительный контент справа (аватар, счётчики и т.п.) */
  rightExtra?: ReactNode

  /** Дополнительный контент слева (аватар, счётчики и т.п.) */
  leftExtra?: ReactNode

  /** Экшен редактирования (иконка + свайп) */
  onEdit?: (itemId: string) => void

  /** Экшен удаления (иконка + свайп) */
  onDelete?: (itemId: string) => Promise<void>

  /** Кастомный текст подтверждения удаления (по умолчанию общий) */
  deleteConfirmMessage?: string

  /** Клик по всей строке (например, открыть просмотр) */
  onClick?: (itemId: string) => void

  /** Обработчик переключения чекбокса; если задан, чекбокс отображается слева */
  onToggle?: (itemId: string, checked: boolean) => void

  /** Цвет вертикальной полоски слева (для “важных” элементов) */
  highlightColor?: string
}

const BaseListItem: FC<BaseListItemProps> = ({
  itemId,
  name,
  nameAddon,
  description,
  helpText,
  checked,
  onToggle,
  rightExtra,
  leftExtra,
  onEdit,
  onDelete,
  highlightColor,
  onClick,
  deleteConfirmMessage,
}) => {
  const hasActions = Boolean(onEdit || onDelete)

  const handleEdit = useCallback(() => onEdit?.(itemId), [onEdit, itemId])

  const handleDelete = useCallback(async () => {
    if (!onDelete) return
    const message = deleteConfirmMessage ?? 'Удалить этот элемент?'
    const confirmed = window.confirm(message)
    if (!confirmed) return
    try {
      await onDelete(itemId)
      notifications.show({
        title: 'Успех',
        message: 'Элемент удален',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить элемент',
        color: 'red',
      })
    }
  }, [onDelete, itemId, deleteConfirmMessage])

  const handleClick = useCallback(() => onClick?.(itemId), [onClick, itemId])

  const handleToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onToggle?.(itemId, e.currentTarget.checked),
    [onToggle, itemId],
  )

  const content = (
    <Paper
      p={{ base: 'xs', sm: 'md' }}
      style={{
        position: 'relative',
        borderRadius: 0,
      }}
      onClick={handleClick}
    >
      {highlightColor && (
        <Box
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            backgroundColor: highlightColor,
          }}
        />
      )}

      <Group justify="space-between" wrap="nowrap">
        {/* Левая часть: чекбокс (опционально) + контент, который может ужиматься */}
        <Group
          wrap="nowrap"
          gap="xs"
          style={{
            minWidth: 0,
            flex: 1,
          }}
        >
          {typeof checked === 'boolean' && onToggle && (
            <Box component="span" onClick={(e) => e.stopPropagation()}>
              <Checkbox size="xl" checked={checked} onChange={handleToggle} />
            </Box>
          )}
          {leftExtra}
          <Box
            style={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Group wrap="nowrap" gap="xs" style={{ minWidth: 0 }}>
              <Text
                lineClamp={1}
                fw={500}
                td={checked ? 'line-through' : undefined}
                style={{ minWidth: 0 }}
              >
                {name}
              </Text>
              {nameAddon}
            </Group>
            {(!!description || !!helpText) && (
              <Group gap="xs" mt={4} wrap="wrap">
                {!!description && (
                  <Text lineClamp={1} size="sm" c="dimmed">
                    {description}
                  </Text>
                )}
                {!!helpText && (
                  <Text size="sm" c="dimmed" fs="italic">
                    {helpText}
                  </Text>
                )}
              </Group>
            )}
          </Box>
        </Group>

        {/* Правая часть: аватар, счётчики, inline-экшены на десктопе */}
        <Group wrap="nowrap" gap="xs">
          {rightExtra}

          {hasActions && (
            <Group wrap="nowrap" gap="xs" className={styles.actionsDesktop}>
              {onEdit && (
                <ActionIcon
                  variant="subtle"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleEdit()
                  }}
                  aria-label="Редактировать"
                >
                  <IconPencil size={18} />
                </ActionIcon>
              )}
              {onDelete && (
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleDelete()
                  }}
                  aria-label="Удалить"
                >
                  <IconTrash size={18} />
                </ActionIcon>
              )}
            </Group>
          )}
        </Group>
      </Group>
    </Paper>
  )

  // При наличии экшенов — оборачиваем в свайп (на мобильных экшены в панели, на десктопе — inline через CSS)
  if (hasActions) {
    return (
      <SwipeableListItem
        onEdit={onEdit ? handleEdit : undefined}
        onDelete={onDelete ? handleDelete : undefined}
      >
        {content}
      </SwipeableListItem>
    )
  }

  return content
}

export default BaseListItem
