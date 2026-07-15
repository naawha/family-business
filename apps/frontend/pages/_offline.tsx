import { FC } from 'react'
import { Center, Stack, Text, Title } from '@mantine/core'
import { IconWifiOff } from '@tabler/icons-react'

/**
 * Fallback, когда страница не попала в кэш SW и сети нет.
 * Создайте pages/_offline.tsx — next-pwa подхватит автоматически.
 */
const OfflinePage: FC = () => {
  return (
    <Center h="100vh" p="md">
      <Stack align="center" gap="md" maw={360}>
        <IconWifiOff size={48} color="var(--mantine-color-gray-5)" />
        <Title order={3} ta="center">
          Нет сети
        </Title>
        <Text c="dimmed" ta="center" size="sm">
          Откройте приложение онлайн хотя бы раз, чтобы списки задач, покупок, рецептов и заметок
          сохранились для просмотра оффлайн.
        </Text>
      </Stack>
    </Center>
  )
}

export default OfflinePage
