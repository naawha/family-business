import { FC, ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AppShell, Burger, Group, Title, NavLink, Box, Stack, Text } from '@mantine/core'

import styles from './DashboardLayout.module.css'
import { useDisclosure } from '@mantine/hooks'
import {
  IconChecklist,
  IconShoppingCart,
  IconBook,
  IconBookFilled,
  IconSettings,
  IconSettingsFilled,
  IconShoppingCartFilled,
  IconBriefcase,
  IconBriefcaseFilled,
  IconNotebook,
  IconNotes,
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
  const [opened, { toggle, close }] = useDisclosure()
  const { family, isLoading } = useFamily()
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const sync = () => setOnline(typeof navigator === 'undefined' || navigator.onLine)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  useEffect(() => {
    // Оффлайн: не гоним на /setup — показываем кэш (если есть)
    if (!isLoading && !family && online) {
      router.replace('/setup')
    }
  }, [isLoading, family, router, online])

  const showPageHeader = title != null || headerRight != null

  if (!isLoading && !family && online) {
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
          component={Link}
          href="/dashboard"
          label="Главная"
          leftSection={<IconChecklist size={20} />}
          active={router.pathname === '/dashboard'}
          onClick={close}
        />
        <NavLink
          component={Link}
          href="/dashboard/todos"
          label="Задачи"
          leftSection={<IconChecklist size={20} />}
          active={router.pathname === '/dashboard/todos'}
          onClick={close}
        />
        <NavLink
          component={Link}
          href="/dashboard/shopping"
          label="Покупки"
          leftSection={<IconShoppingCart size={20} />}
          active={router.pathname === '/dashboard/shopping'}
          onClick={close}
        />
        <NavLink
          component={Link}
          href="/dashboard/recipes"
          label="Рецепты"
          leftSection={<IconBook size={20} />}
          active={router.pathname.startsWith('/dashboard/recipes')}
          onClick={close}
        />
        <NavLink
          component={Link}
          href="/dashboard/notes"
          label="Заметки"
          leftSection={<IconNotebook size={20} />}
          active={router.pathname.startsWith('/dashboard/notes')}
          onClick={close}
        />
        <NavLink
          component={Link}
          href="/dashboard/family"
          label="Семья"
          leftSection={<IconSettings size={20} />}
          active={router.pathname === '/dashboard/family'}
          onClick={close}
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
              component={Link}
              href="/dashboard/todos"
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  {router.pathname === '/dashboard/todos' ? (
                    <IconBriefcaseFilled size={20} />
                  ) : (
                    <IconBriefcase size={20} />
                  )}
                  <Text size="xs">Задачи</Text>
                </Stack>
              }
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <NavLink
              component={Link}
              href="/dashboard/shopping"
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  {router.pathname === '/dashboard/shopping' ? (
                    <IconShoppingCartFilled size={20} />
                  ) : (
                    <IconShoppingCart size={20} />
                  )}
                  <Text size="xs">Покупки</Text>
                </Stack>
              }
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <NavLink
              component={Link}
              href="/dashboard/recipes"
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  {router.pathname.startsWith('/dashboard/recipes') ? (
                    <IconBookFilled size={20} />
                  ) : (
                    <IconBook size={20} />
                  )}
                  <Text size="xs">Рецепты</Text>
                </Stack>
              }
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <NavLink
              component={Link}
              href="/dashboard/notes"
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  {router.pathname.startsWith('/dashboard/notes') ? (
                    <IconNotes size={20} />
                  ) : (
                    <IconNotebook size={20} />
                  )}
                  <Text size="xs">Заметки</Text>
                </Stack>
              }
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <NavLink
              component={Link}
              href="/dashboard/family"
              style={{ padding: 4 }}
              label={
                <Stack gap={2} align="center">
                  {router.pathname === '/dashboard/family' ? (
                    <IconSettingsFilled size={20} />
                  ) : (
                    <IconSettings size={20} />
                  )}
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
