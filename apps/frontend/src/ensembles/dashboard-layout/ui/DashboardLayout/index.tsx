import { FC, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AppShell, Burger, Group, Title, NavLink, Box, Stack, Text } from '@mantine/core'

import styles from './DashboardLayout.module.css'
import { useDisclosure } from '@mantine/hooks'
import {
  IconChecklist,
  IconShoppingCart,
  IconSettings,
  IconBuildingCommunity,
  IconBook,
} from '@tabler/icons-react'
import { useFamily } from '@/models/accounts'
import { PageHeader } from '@/shared/ui'

interface DashboardLayoutProps {
  children: ReactNode
  /** Заголовок страницы (на мобильных — в шапке, на десктопе — над контентом) */
  title?: ReactNode
  /** Контент справа от заголовка (кнопка и т.п.), показывается в шапке */
  headerRight?: ReactNode
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, title, headerRight }) => {
  const router = useRouter()
  const [opened, { toggle }] = useDisclosure()
  const { family, isLoading } = useFamily()

  useEffect(() => {
    if (!isLoading && !family) {
      router.replace('/setup')
    }
  }, [isLoading, family, router])

  const showPageHeader = title != null || headerRight != null

  if (!isLoading && !family) {
    return null
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      classNames={{ main: styles.main }}
    >
      <AppShell.Header visibleFrom="sm">
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={3}>Family Business</Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          href="/dashboard"
          label="Главная"
          leftSection={<IconChecklist size={20} />}
          active={router.pathname === '/dashboard'}
        />
        <NavLink
          href="/dashboard/todos"
          label="Задачи"
          leftSection={<IconChecklist size={20} />}
          active={router.pathname === '/dashboard/todos'}
        />
        <NavLink
          href="/dashboard/shopping"
          label="Покупки"
          leftSection={<IconShoppingCart size={20} />}
          active={router.pathname === '/dashboard/shopping'}
        />
        <NavLink
          href="/dashboard/recipes"
          label="Рецепты"
          leftSection={<IconBook size={20} />}
          active={router.pathname.startsWith('/dashboard/recipes')}
        />
        <NavLink
          href="/dashboard/settings"
          label="Настройки"
          leftSection={<IconSettings size={20} />}
          active={router.pathname === '/dashboard/settings'}
        />
        <NavLink
          href="/dashboard/family"
          label="Семья"
          leftSection={<IconBuildingCommunity size={20} />}
          active={router.pathname === '/dashboard/family'}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {showPageHeader && (
          <Box className={styles.pageHeader}>
            <PageHeader title={title} rightSection={headerRight} />
          </Box>
        )}
        {children}
      </AppShell.Main>

      <AppShell.Footer
        hiddenFrom="sm"
        withBorder
        pb={`calc(var(--mantine-spacing-sm) + var(--safe-bottom))`}
        style={{
          padding: '4px 8px',
        }}
      >
        <Group justify="space-around" gap="xs">
          <Box style={{ flex: 1 }}>
            <NavLink
              href="/dashboard/todos"
              active={router.pathname === '/dashboard/todos'}
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  <IconChecklist size={20} />
                  <Text size="xs">Задачи</Text>
                </Stack>
              }
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <NavLink
              href="/dashboard/shopping"
              active={router.pathname === '/dashboard/shopping'}
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  <IconShoppingCart size={20} />
                  <Text size="xs">Покупки</Text>
                </Stack>
              }
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <NavLink
              href="/dashboard/recipes"
              active={router.pathname.startsWith('/dashboard/recipes')}
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  <IconBook size={20} />
                  <Text size="xs">Рецепты</Text>
                </Stack>
              }
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <NavLink
              href="/dashboard/family"
              active={router.pathname === '/dashboard/family'}
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  <IconBuildingCommunity size={20} />
                  <Text size="xs">Семья</Text>
                </Stack>
              }
            />
          </Box>
        </Group>
      </AppShell.Footer>
    </AppShell>
  )
}

export default DashboardLayout
