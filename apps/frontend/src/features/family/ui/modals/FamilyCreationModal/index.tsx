import { FC, useState, FormEvent } from 'react'
import { Modal, TextInput, Button, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useFamiliesCreateMutation } from '@/models/accounts'

interface FamilyCreationModalProps {
  opened: boolean
  onClose: () => void
}

const FamilyCreationModal: FC<FamilyCreationModalProps> = ({ opened, onClose }) => {
  const [createFamily, { isLoading }] = useFamiliesCreateMutation()
  const [name, setName] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    try {
      await createFamily({ name: name.trim() }).unwrap()

      setName('')
      onClose()

      notifications.show({
        title: 'Успех',
        message: 'Семья успешно создана',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать семью',
        color: 'red',
      })
    }
  }

  const handleClose = () => {
    setName('')
    onClose()
  }

  return (
    <Modal opened={opened} onClose={handleClose} title="Создать семью">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Название семьи"
            placeholder="Введите название семьи"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />

          <Button type="submit" loading={isLoading} fullWidth>
            Создать
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}

export default FamilyCreationModal
