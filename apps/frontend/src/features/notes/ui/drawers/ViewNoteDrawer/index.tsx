import { FC } from 'react'
import { Stack, Text, Paper, Group } from '@mantine/core'
import { type NoteType } from '@family-business/types/entities'
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

interface ViewNoteDrawerProps {
  opened: boolean
  onClose: () => void
  note: NoteType | null
}

const ViewNoteDrawer: FC<ViewNoteDrawerProps> = ({ opened, onClose, note }) => {
  const updatedFormatted = note ? formatCreatedAt(note.updatedAt) : ''

  return (
    <BaseDrawer opened={opened} onClose={onClose} title={note?.title ?? ''} desktopSize={640}>
      <Stack gap="md">
        {note?.body && (
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
                h1: ({ children }) => (
                  <Text component="h1" size="xl" fw={700} mb="sm">
                    {children}
                  </Text>
                ),
                h2: ({ children }) => (
                  <Text component="h2" size="lg" fw={600} mb="sm">
                    {children}
                  </Text>
                ),
                h3: ({ children }) => (
                  <Text component="h3" size="md" fw={600} mb="xs">
                    {children}
                  </Text>
                ),
                code: ({ children }) => (
                  <Text
                    component="code"
                    size="sm"
                    style={{
                      background: 'var(--mantine-color-gray-1)',
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {children}
                  </Text>
                ),
              }}
            >
              {note!.body}
            </ReactMarkdown>
          </Paper>
        )}

        {note?.createdBy && (
          <>
            <Text size="sm" fw={500} c="dimmed">
              Автор
            </Text>
            <Group gap="sm">
              <Avatar user={note.createdBy} size={36} />
              <Text size="sm">{note.createdBy.name ?? note.createdBy.email ?? 'Без имени'}</Text>
            </Group>
          </>
        )}

        {note && (
          <>
            <Text size="sm" fw={500} c="dimmed">
              Обновлено
            </Text>
            <Text size="sm">{updatedFormatted}</Text>
          </>
        )}
      </Stack>
    </BaseDrawer>
  )
}

export default ViewNoteDrawer
