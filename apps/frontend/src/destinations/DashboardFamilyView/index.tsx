import { FC, useState } from 'react'
import { Button, Paper, Text, Stack } from '@mantine/core'
import { IconBell, IconPlus } from '@tabler/icons-react'
import { FamilyQRInviteModal } from '@/features/family'
import { useFamily } from '@/models/accounts'
import { useNotificationPermission } from '@/shared/lib/useNotificationPermission'
import DashboardLayout from '@/ensembles/dashboard-layout/ui/DashboardLayout'
import FamilyMembersList from './ui/FamilyMembersList'

import styles from './DashboardFamilyView.module.css'

interface DashboardFamilyViewProps {}

const DashboardFamilyView: FC<DashboardFamilyViewProps> = () => {
  const { family, isAdmin } = useFamily()
  const [qrInviteModal, setQrInviteModal] = useState(false)
  const { permission, isSupported, requestPermission } = useNotificationPermission()
  const openQrInviteModal = () => setQrInviteModal(true)
  const closeQrInviteModal = () => setQrInviteModal(false)

  if (!family) {
    return (
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <Text c="dimmed" ta="center">
          Семья не найдена
        </Text>
      </Paper>
    )
  }

  return (
    <DashboardLayout
      title={family.name}
      headerRight={
        isAdmin && (
          <>
            <IconPlus
              className={styles.headerButtonMobile}
              color="var(--mantine-color-green-6)"
              size={35}
              onClick={openQrInviteModal}
            />
            <Button
              className={styles.headerButtonDesktop}
              leftSection={<IconPlus size={16} />}
              onClick={openQrInviteModal}
            >
              Пригласить участника
            </Button>
          </>
        )
      }
    >
      <Stack gap="md">
        {isSupported && permission !== 'granted' && (
          <Paper withBorder p="md" radius="md">
            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Уведомления
              </Text>
              <Text size="xs" c="dimmed">
                {permission === 'denied'
                  ? 'Уведомления отключены в браузере. Включите их в настройках сайта.'
                  : 'Получайте уведомления о новых задачах и покупках от членов семьи.'}
              </Text>
              {permission !== 'denied' && (
                <Button
                  size="xs"
                  variant="light"
                  leftSection={<IconBell size={16} />}
                  onClick={() => requestPermission()}
                >
                  Включить уведомления
                </Button>
              )}
            </Stack>
          </Paper>
        )}
        <FamilyMembersList />
      </Stack>

      <FamilyQRInviteModal opened={qrInviteModal} onClose={closeQrInviteModal} />
    </DashboardLayout>
  )
}

export default DashboardFamilyView
