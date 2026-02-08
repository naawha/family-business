import { FC, useState } from 'react'
import { Button, Paper, Text } from '@mantine/core'
import { FamilyQRInviteModal } from '@/features/family'
import { useFamily } from '@/models/accounts'
import DashboardLayout from '@/ensembles/dashboard-layout/ui/DashboardLayout'
import FamilyMembersList from './ui/FamilyMembersList'
import { IconPlus } from '@tabler/icons-react'

import styles from './DashboardFamilyView.module.css'

interface DashboardFamilyViewProps {}

const DashboardFamilyView: FC<DashboardFamilyViewProps> = () => {
  const { family, isAdmin } = useFamily()
  const [qrInviteModal, setQrInviteModal] = useState(false)
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
      <FamilyMembersList />

      <FamilyQRInviteModal opened={qrInviteModal} onClose={closeQrInviteModal} />
    </DashboardLayout>
  )
}

export default DashboardFamilyView
