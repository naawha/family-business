import { FC, useState, useEffect, FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Stack, Text, TextInput, Button, Group } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { BaseDrawer, Avatar, EmojiPicker } from '@/shared/ui'
import { clearAuth } from '@/shared/lib/auth-storage'
import type { FamilyMemberType } from '@family-business/types/entities'
import { useGetMeQuery, useUpdateMeMutation } from '@/models/accounts'

import styles from './FamilyMemberSettingsDrawer.module.css'

interface FamilyMemberSettingsDrawerProps {
  opened: boolean
  onClose: () => void
  member: FamilyMemberType | null
}

const FamilyMemberSettingsDrawer: FC<FamilyMemberSettingsDrawerProps> = ({
  opened,
  onClose,
  member,
}) => {
  const { data: currentUser } = useGetMeQuery()
  const [updateMe, { isLoading: isUpdating }] = useUpdateMeMutation()

  const [name, setName] = useState('')
  const [avatarEmoji, setAvatarEmoji] = useState<string | null>(null)
  const [emojiPickerOpened, setEmojiPickerOpened] = useState(false)

  const user = member?.user
  const isEditingSelf = Boolean(member && currentUser && member.userId === currentUser.id)

  useEffect(() => {
    if (user?.name != null) {
      setName(user.name)
    }
  }, [user?.name])

  useEffect(() => {
    if (user?.avatarEmoji !== undefined) {
      setAvatarEmoji(user.avatarEmoji ?? null)
    }
  }, [user?.avatarEmoji])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isEditingSelf) return
    if (!name.trim()) {
      notifications.show({
        title: 'Ошибка',
        message: 'Имя не может быть пустым',
        color: 'red',
      })
      return
    }
    try {
      await updateMe({ name: name.trim(), avatarEmoji }).unwrap()
      notifications.show({ title: 'Успех', message: 'Профиль обновлён', color: 'green' })
      onClose()
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить профиль',
        color: 'red',
      })
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setAvatarEmoji(emoji)
    setEmojiPickerOpened(false)
  }

  const handleRemoveEmoji = () => {
    setAvatarEmoji(null)
  }

  const router = useRouter()
  const handleLogout = useCallback(() => {
    onClose()
    clearAuth()
    router.push('/login')
  }, [onClose, router])

  if (!member) return null

  const userForAvatar =
    user && isEditingSelf
      ? { name, avatarEmoji, avatarColor: user.avatarColor }
      : user
        ? { name: user.name, avatarEmoji: user.avatarEmoji, avatarColor: user.avatarColor }
        : { name: '', avatarEmoji: null, avatarColor: null }

  const headerRight = (
    <>
      <IconLogout
        size={35}
        color="red"
        className={styles.headerButtonMobile}
        onClick={handleLogout}
      />
      <Button
        className={styles.headerButtonDesktop}
        variant="light"
        size="xs"
        leftSection={<IconLogout size={16} />}
        onClick={handleLogout}
      >
        Выйти
      </Button>
    </>
  )

  return (
    <BaseDrawer opened={opened} onClose={onClose} title={user?.email} headerRight={headerRight}>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <div>
            <Text size="sm" fw={500} mb={5}>
              Имя
            </Text>
            <Stack gap="sm">
              <TextInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                required
              />
            </Stack>
          </div>
          <div>
            <Text size="sm" fw={500} mb={5}>
              Аватар
            </Text>
            <Group gap="md">
              <Avatar user={userForAvatar} size={56} />
              {isEditingSelf && (
                <Stack gap="xs">
                  <Button type="button" variant="light" onClick={() => setEmojiPickerOpened(true)}>
                    Выбрать эмодзи
                  </Button>
                  {avatarEmoji && (
                    <Button type="button" variant="subtle" color="red" onClick={handleRemoveEmoji}>
                      Удалить эмодзи
                    </Button>
                  )}
                </Stack>
              )}
            </Group>
          </div>
          <Button type="submit" loading={isUpdating}>
            Сохранить
          </Button>
        </Stack>
      </form>
      {isEditingSelf && (
        <EmojiPicker
          opened={emojiPickerOpened}
          onClose={() => setEmojiPickerOpened(false)}
          onSelect={handleEmojiSelect}
          selectedEmoji={avatarEmoji ?? undefined}
        />
      )}
    </BaseDrawer>
  )
}

export default FamilyMemberSettingsDrawer
