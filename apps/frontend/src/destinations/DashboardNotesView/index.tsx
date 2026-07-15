import { FC, useState } from 'react'
import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { DashboardLayout } from '@/ensembles/dashboard-layout'
import NoteList from './ui/NoteList'
import { CreateNoteModal } from '@/features/notes'

import styles from './DashboardNotesView.module.css'

const DashboardNotesView: FC = () => {
  const [modalOpened, setModalOpened] = useState(false)
  const openModal = () => setModalOpened(true)
  const closeModal = () => setModalOpened(false)

  return (
    <DashboardLayout
      title="Заметки"
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
            Создать заметку
          </Button>
        </>
      }
    >
      <NoteList />

      <CreateNoteModal opened={modalOpened} onClose={closeModal} />
    </DashboardLayout>
  )
}

export default DashboardNotesView
