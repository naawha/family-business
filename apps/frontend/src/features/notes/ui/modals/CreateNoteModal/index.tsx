import { FC } from 'react'
import { notifications } from '@mantine/notifications'
import { useFamily } from '@/models/accounts'
import { BaseDrawer } from '@/shared/ui'
import NoteForm, { type NoteFormValues } from '../../NoteForm'
import { useCreateNoteMutation } from '@/models/notes'

interface CreateNoteModalProps {
  opened: boolean
  onClose: () => void
}

const CreateNoteModal: FC<CreateNoteModalProps> = ({ opened, onClose }) => {
  const { family } = useFamily()
  const [createNote, { isLoading }] = useCreateNoteMutation()

  const handleSubmit = async (values: NoteFormValues) => {
    try {
      await createNote({
        familyId: family?.id,
        title: values.title.trim(),
        body: values.body.trim() || undefined,
      }).unwrap()

      onClose()
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать заметку',
        color: 'red',
      })
      throw new Error('Create failed')
    }
  }

  return (
    <BaseDrawer opened={opened} onClose={onClose} title="Создать заметку" desktopSize={640}>
      <NoteForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Создать"
        resetOnSuccess
        opened={opened}
      />
    </BaseDrawer>
  )
}

export default CreateNoteModal
