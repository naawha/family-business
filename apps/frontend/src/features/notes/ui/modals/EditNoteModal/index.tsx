import { FC, useMemo } from 'react'
import { notifications } from '@mantine/notifications'
import { type NoteType } from '@family-business/types/entities'
import { BaseDrawer } from '@/shared/ui'
import NoteForm, { type NoteFormValues } from '../../NoteForm'
import { useUpdateNoteMutation } from '@/models/notes'

interface EditNoteModalProps {
  opened: boolean
  onClose: () => void
  item: NoteType | null
}

const EditNoteModal: FC<EditNoteModalProps> = ({ opened, onClose, item }) => {
  const [updateNote, { isLoading }] = useUpdateNoteMutation()

  const initialValues = useMemo<NoteFormValues | null>(() => {
    if (!item) return null
    return {
      title: item.title,
      body: item.body ?? '',
    }
  }, [item?.id, item?.title, item?.body])

  const handleSubmit = async (values: NoteFormValues) => {
    if (!item) return

    try {
      await updateNote({
        id: item.id,
        body: {
          title: values.title.trim(),
          body: values.body.trim(),
        },
      }).unwrap()

      onClose()
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить заметку',
        color: 'red',
      })
      throw new Error('Update failed')
    }
  }

  return (
    <BaseDrawer opened={opened} onClose={onClose} title="Редактировать заметку" desktopSize={640}>
      {initialValues && (
        <NoteForm
          initialValues={initialValues}
          opened={opened}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Сохранить"
        />
      )}
    </BaseDrawer>
  )
}

export default EditNoteModal
