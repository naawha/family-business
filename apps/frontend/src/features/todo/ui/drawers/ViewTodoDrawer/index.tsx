import { FC } from 'react'
import { Stack, Text, Paper, Group } from '@mantine/core'
import { type TodoType } from '@family-business/types/entities'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ReactMarkdown from 'react-markdown'
import BaseDrawer from '@/shared/ui/BaseDrawer'
import { Avatar } from '@/shared/ui'

function formatCreatedAt(isoDate: string): string {
  const d = dayjs(isoDate).locale('ru')
  const today = dayjs().locale('ru')
  if (d.isSame(today, 'day')) return `Сегодня, ${d.format('HH:mm')}`
  if (d.isSame(today.subtract(1, 'day'), 'day')) return `Вчера, ${d.format('HH:mm')}`
  if (d.isSame(today, 'year')) return d.format('D MMMM, HH:mm')
  return d.format('D MMMM YYYY, HH:mm')
}

interface ViewTodoDrawerProps {
  opened: boolean
  onClose: () => void
  todo: TodoType | null
}

const ViewTodoDrawer: FC<ViewTodoDrawerProps> = ({ opened, onClose, todo }) => {
  const createdFormatted = todo ? formatCreatedAt(todo.createdAt) : ''

  return (
    <BaseDrawer opened={opened} onClose={onClose} title={todo?.title ?? ''}>
      <Stack gap="md">
        {todo?.description && (
          <>
            <Text size="sm" fw={500} c="dimmed">
              Описание
            </Text>
            <Paper p="md" withBorder>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <Text component="p" size="sm" mb="xs">
                      {children}
                    </Text>
                  ),
                  ul: ({ children }) => (
                    <Text component="ul" size="sm" mb="xs" pl="md" style={{ listStyle: 'disc' }}>
                      {children}
                    </Text>
                  ),
                  ol: ({ children }) => (
                    <Text component="ol" size="sm" mb="xs" pl="md" style={{ listStyle: 'decimal' }}>
                      {children}
                    </Text>
                  ),
                  li: ({ children }) => (
                    <Text component="li" size="sm">
                      {children}
                    </Text>
                  ),
                  strong: ({ children }) => (
                    <Text component="span" fw={600}>
                      {children}
                    </Text>
                  ),
                }}
              >
                {todo!.description}
              </ReactMarkdown>
            </Paper>
          </>
        )}

        {todo?.assignedTo && (
          <>
            <Text size="sm" fw={500} c="dimmed">
              Назначено
            </Text>
            <Group gap="sm">
              <Avatar user={todo!.assignedTo} size={36} />
              <Text size="sm">{todo!.assignedTo.name ?? todo!.assignedTo.email ?? 'Без имени'}</Text>
            </Group>
          </>
        )}

        {todo && (
          <>
            <Text size="sm" fw={500} c="dimmed">
              Дата создания
            </Text>
            <Text size="sm">{createdFormatted}</Text>
          </>
        )}
      </Stack>
    </BaseDrawer>
  )
}

export default ViewTodoDrawer
