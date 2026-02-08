import { FC, useState } from 'react'
import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { DashboardLayout } from '@/ensembles/dashboard-layout'
import RecipeList from './ui/RecipeList'
import { CreateRecipeModal } from '@/features/recipes'

import styles from './DashboardRecipesView.module.css'

const DashboardRecipesView: FC = () => {
  const [modalOpened, setModalOpened] = useState(false)
  const openModal = () => setModalOpened(true)
  const closeModal = () => setModalOpened(false)

  return (
    <DashboardLayout
      title="Рецепты"
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
            Создать рецепт
          </Button>
        </>
      }
    >
      <RecipeList />

      <CreateRecipeModal opened={modalOpened} onClose={closeModal} />
    </DashboardLayout>
  )
}

export default DashboardRecipesView
