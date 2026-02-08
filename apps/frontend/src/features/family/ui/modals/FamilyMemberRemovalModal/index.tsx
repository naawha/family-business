import { Modal, Stack, Text, Button, Group } from '@mantine/core'
import { FC } from 'react'
import { notifications } from '@mantine/notifications'
import { useFamiliesRemoveMemberMutation } from '@/models/accounts'

interface FamilyMemberRemovalModalProps {
  opened: boolean
  onClose: () => void
  familyId: string
  memberId: string
}

const FamilyMemberRemovalModal: FC<FamilyMemberRemovalModalProps> = ({
  opened,
  onClose,
  familyId,
  memberId,
}) => {
  const [removeMember, { isLoading }] = useFamiliesRemoveMemberMutation()

  const handleRemoveMember = async () => {
    try {
      await removeMember({ id: familyId, memberId })
      onClose()
      notifications.show({
        title: 'Успех',
        message: 'Участник удален',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить участника',
        color: 'red',
      })
    }
  }
  return (
    <Modal opened={opened} onClose={onClose} title="Удалить участника">
      <Stack gap="md">
        <Text>Вы уверены, что хотите удалить этого участника из семьи?</Text>
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>
            Отмена
          </Button>
          <Button color="red" onClick={handleRemoveMember} loading={isLoading}>
            Удалить
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default FamilyMemberRemovalModal
