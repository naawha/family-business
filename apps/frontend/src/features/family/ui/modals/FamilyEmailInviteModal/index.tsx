import { Modal, Stack, TextInput, Button, Group } from '@mantine/core'
import { FC, useState, FormEvent } from 'react'
import { notifications } from '@mantine/notifications'
import { useFamiliesInviteMemberMutation } from '@/models/accounts'

interface FamilyEmailInviteModalProps {
  opened: boolean
  onClose: () => void
  familyId: string
}

const FamilyEmailInviteModal: FC<FamilyEmailInviteModalProps> = ({ opened, onClose, familyId }) => {
  const [inviteEmail, setInviteEmail] = useState('')

  const [inviteByEmail, { isLoading }] = useFamiliesInviteMemberMutation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await inviteByEmail({ id: familyId, body: { email: inviteEmail } })
      onClose()
      setInviteEmail('')
      notifications.show({
        title: 'Успех',
        message: 'Участник приглашен',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось пригласить участника',
        color: 'red',
      })
    }
  }
  return (
    <Modal opened={opened} onClose={onClose} title="Пригласить участника">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="email@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            required
            type="email"
            autoFocus
          />
          <Group justify="flex-end">
            <Button variant="subtle" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" loading={isLoading}>
              Отправить приглашение
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}

export default FamilyEmailInviteModal
