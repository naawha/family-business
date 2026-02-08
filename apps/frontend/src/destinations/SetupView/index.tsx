import { FC, useState, useEffect, FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import {
  Container,
  Paper,
  Title,
  Text,
  Tabs,
  TextInput,
  Button,
  Stack,
  Group,
  Box,
} from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { clearAuth, saveCurrentFamily } from '@/shared/lib/auth-storage'
import { useToken } from '@/shared/lib/useAuth'
import { InviteQRScanner } from '@/features/family'
import {
  useFamiliesCreateMutation,
  useInvitesAcceptMutation,
  useInvitesListQuery,
} from '@/models/accounts'

const SetupView: FC = () => {
  const router = useRouter()
  const token = useToken()
  const [createFamily, { isLoading }] = useFamiliesCreateMutation()
  const [acceptInvite, { isLoading: isJoining }] = useInvitesAcceptMutation()
  const { data: invites = [], isLoading: invitesLoading } = useInvitesListQuery(undefined, {
    skip: !token,
  })

  const [familyName, setFamilyName] = useState('')

  useEffect(() => {
    if (token === null) {
      router.replace('/login')
    }
  }, [token, router])

  const handleCreateSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!familyName.trim()) return
    try {
      const family = await createFamily({ name: familyName.trim() }).unwrap()
      saveCurrentFamily(family.id)
      notifications.show({
        title: 'Успех',
        message: 'Семья создана',
        color: 'green',
      })
      router.push('/dashboard')
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать семью',
        color: 'red',
      })
    }
  }

  const handleLogout = useCallback(() => {
    clearAuth()
    router.push('/login')
  }, [router])

  const handleJoinWithToken = useCallback(
    async (inviteToken: string) => {
      const tokenStr = inviteToken.trim()
      if (!tokenStr) return
      try {
        const result = await acceptInvite({ token: tokenStr }).unwrap()
        if ('familyId' in result) {
          saveCurrentFamily(result.familyId)
        }
        notifications.show({
          title: 'Успех',
          message: 'Вы присоединились к семье',
          color: 'green',
        })
        router.push('/dashboard')
      } catch {
        notifications.show({
          title: 'Ошибка',
          message: 'Не удалось присоединиться по приглашению',
          color: 'red',
        })
      }
    },
    [acceptInvite, router],
  )

  return (
    <Container size="xs" style={{ paddingTop: '60px' }}>
      <Group justify="space-between" align="center" mb="lg">
        <Title order={2}>Настройка семьи</Title>
        <Button
          variant="light"
          size="xs"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
        >
          Выйти
        </Button>
      </Group>

      <Tabs defaultValue="create">
        <Tabs.List>
          <Tabs.Tab value="create">Создать</Tabs.Tab>
          <Tabs.Tab value="join">Присоединиться</Tabs.Tab>
          <Tabs.Tab value="invites">Приглашения</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="create" pt="md">
          <Paper withBorder p="md" radius="md">
            <form onSubmit={handleCreateSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Название семьи"
                  placeholder="Введите название семьи"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  required
                  autoFocus
                />
                <Button type="submit" loading={isLoading} fullWidth>
                  Создать семью
                </Button>
              </Stack>
            </form>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="join" pt="md">
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed" mb="md">
              Наведите камеру на QR-код приглашения от администратора семьи.
            </Text>
            <InviteQRScanner onScan={handleJoinWithToken} height={280} />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="invites" pt="md">
          <Paper withBorder p="md" radius="md">
            <Text size="sm" c="dimmed" mb="md">
              Приглашения, отправленные вам по email. Нажмите «Принять», чтобы присоединиться к
              семье.
            </Text>
            {invitesLoading ? (
              <Text size="sm" c="dimmed">
                Загрузка...
              </Text>
            ) : invites.length === 0 ? (
              <Text size="sm" c="dimmed">
                Нет приглашений
              </Text>
            ) : (
              <Stack gap="sm">
                {invites.map((invite) => (
                  <Box
                    key={invite.token}
                    p="sm"
                    style={{
                      border: '1px solid var(--mantine-color-default-border)',
                      borderRadius: 'var(--mantine-radius-sm)',
                    }}
                  >
                    <Stack gap="xs">
                      <Text size="sm" fw={500}>
                        {invite.familyName}
                      </Text>
                      {invite.inviterName && (
                        <Text size="xs" c="dimmed">
                          Приглашение от {invite.inviterName}
                        </Text>
                      )}
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => handleJoinWithToken(invite.token)}
                        loading={isJoining}
                      >
                        Принять приглашение
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default SetupView
