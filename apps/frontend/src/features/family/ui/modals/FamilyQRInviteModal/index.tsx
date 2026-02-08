import { Stack, Text, Center, TextInput, Button, Divider } from '@mantine/core'
import { FC, useState, useEffect, useCallback, FormEvent } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { notifications } from '@mantine/notifications'
import { BaseDrawer } from '@/shared/ui'
import {
  useFamiliesCreateQrInviteMutation,
  useFamiliesInviteMemberMutation,
  useFamily,
} from '@/models/accounts'

interface FamilyQRInviteModalProps {
  opened: boolean
  onClose: () => void
}

const FamilyQRInviteModal: FC<FamilyQRInviteModalProps> = ({ opened, onClose }) => {
  const { family } = useFamily()
  const [qrInvite, setQrInvite] = useState<string | null>(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [createQrInvite, { isLoading: isQrLoading }] = useFamiliesCreateQrInviteMutation()
  const [inviteByEmail, { isLoading: isEmailLoading }] = useFamiliesInviteMemberMutation()

  const handleCreateQrInvite = useCallback(async () => {
    try {
      const result = await createQrInvite({
        id: family?.id ?? '',
        body: {},
      }).unwrap()

      setQrInvite(result ? result.token : null)
    } catch {
      onClose()
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать QR-код приглашения',
        color: 'red',
      })
    }
  }, [family?.id, createQrInvite, onClose])

  useEffect(() => {
    if (opened) {
      handleCreateQrInvite()
    }
  }, [opened])

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!family?.id || !inviteEmail.trim()) return
    try {
      await inviteByEmail({ id: family.id, body: { email: inviteEmail.trim() } }).unwrap()
      setInviteEmail('')
      notifications.show({
        title: 'Успех',
        message: 'Приглашение отправлено',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось отправить приглашение',
        color: 'red',
      })
    }
  }

  return (
    <BaseDrawer opened={opened} onClose={onClose} title="Пригласить в семью">
      <Stack gap="md">
        <Stack gap="md" align="center">
          <Text size="sm" fw={500}>
            QR-код
          </Text>
          {!isQrLoading && qrInvite ? (
            <>
              <Text size="sm" c="dimmed" ta="center">
                Отсканируйте QR-код для присоединения к семье
              </Text>
              <Center p="md" style={{ backgroundColor: 'white', borderRadius: 8 }}>
                <QRCodeSVG value={qrInvite} size={256} level="H" />
              </Center>
            </>
          ) : (
            <Text size="sm" c="dimmed">
              Загрузка QR-кода...
            </Text>
          )}
        </Stack>

        <Divider label="или по email" labelPosition="center" />

        <form onSubmit={handleEmailSubmit}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              type="email"
            />
            <Button type="submit" loading={isEmailLoading} fullWidth>
              Отправить приглашение
            </Button>
          </Stack>
        </form>
      </Stack>
    </BaseDrawer>
  )
}

export default FamilyQRInviteModal
