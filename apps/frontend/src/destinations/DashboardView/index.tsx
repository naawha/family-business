import { FC } from 'react'
import { Text } from '@mantine/core'
import { DashboardLayout } from '@/ensembles/dashboard-layout'

const DashboardView: FC = () => {
  return (
    <DashboardLayout title="Панель управления">
      <Text mt="md">Добро пожаловать в Family Business!</Text>
      <Text mt="sm" c="dimmed">
        Выберите раздел из боковой панели чтобы начать.
      </Text>
    </DashboardLayout>
  )
}

export default DashboardView
