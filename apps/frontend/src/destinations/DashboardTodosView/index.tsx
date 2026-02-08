import { FC, useState } from 'react'
import { ActionIcon, Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { DashboardLayout } from '@/ensembles/dashboard-layout'
import TodoList from './ui/TodoList'
import { CreateTodoModal } from '@/features/todo'

import styles from './DashboardTodosView.module.css'

const DashboardTodosView: FC = () => {
  const [modalOpened, setModalOpened] = useState(false)
  const openModal = () => setModalOpened(true)

  return (
    <DashboardLayout
      title="Задачи"
      headerRight={
        <>
          <IconPlus
            className={styles.headerButtonMobile}
            color="var(--mantine-color-green-6)"
            size={35}
            onClick={openModal}
          />
          <Button
            className={styles.headerButtonDesktop}
            leftSection={<IconPlus size={16} />}
            onClick={openModal}
          >
            Добавить задачу
          </Button>
        </>
      }
    >
      <TodoList />

      <CreateTodoModal opened={modalOpened} onClose={() => setModalOpened(false)} />
    </DashboardLayout>
  )
}

export default DashboardTodosView
