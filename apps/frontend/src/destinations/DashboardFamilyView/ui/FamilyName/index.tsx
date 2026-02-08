import { FC, useState } from 'react'
import { Title, Group, TextInput, ActionIcon } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconEdit, IconCheck, IconX } from '@tabler/icons-react'
import { useFamiliesUpdateMutation, useFamily } from '@/models/accounts'

interface FamilyNameProps {}

const FamilyName: FC<FamilyNameProps> = () => {
  const { family, isAdmin } = useFamily()
  const [updateFamily, { isLoading: isUpdating }] = useFamiliesUpdateMutation()
  const [isEditingName, setIsEditingName] = useState(false)
  const [familyName, setFamilyName] = useState('')
  const [isHoveringName, setIsHoveringName] = useState(false)

  const handleStartEditName = () => {
    setFamilyName(family?.name ?? '')
    setIsEditingName(true)
  }

  const handleSaveName = async () => {
    if (!familyName.trim()) return

    try {
      await updateFamily({
        id: family!.id || '',
        body: { name: familyName.trim() },
      }).unwrap()

      setIsEditingName(false)
      notifications.show({
        title: 'Успех',
        message: 'Название семьи обновлено',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить название семьи',
        color: 'red',
      })
    }
  }

  const handleCancelEditName = () => {
    setIsEditingName(false)
    setFamilyName('')
  }

  if (isEditingName) {
    return (
      <Group gap="sm" align="center">
        <TextInput
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder="Название семьи"
          style={{ flex: 1 }}
          size="xl"
          styles={{
            input: {
              fontSize: '2rem',
              fontWeight: 600,
              height: 'auto',
              padding: '0.5rem 1rem',
            },
          }}
          autoFocus
        />
        <ActionIcon
          color="green"
          variant="filled"
          onClick={handleSaveName}
          loading={isUpdating}
          size="lg"
        >
          <IconCheck size={20} />
        </ActionIcon>
        <ActionIcon color="red" variant="filled" onClick={handleCancelEditName} size="lg">
          <IconX size={20} />
        </ActionIcon>
      </Group>
    )
  }

  return (
    <Group
      gap="md"
      align="center"
      wrap="nowrap"
      onMouseEnter={() => setIsHoveringName(true)}
      onMouseLeave={() => setIsHoveringName(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: '100%',
      }}
    >
      <Title
        order={1}
        size="3rem"
        fw={700}
        style={{
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {family?.name || 'Без названия'}
      </Title>
      {isAdmin && (
        <ActionIcon
          variant="subtle"
          onClick={handleStartEditName}
          size="lg"
          style={{
            opacity: isHoveringName ? 1 : 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: isHoveringName ? 'auto' : 'none',
          }}
        >
          <IconEdit size={20} />
        </ActionIcon>
      )}
    </Group>
  )
}

export default FamilyName
