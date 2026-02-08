import { FC, useCallback } from 'react'
import { Button } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { DashboardLayout } from '@/ensembles/dashboard-layout'
import { useDeleteShoppingItemMutation, useShoppingItems } from '@/models/shopping'
import ShoppingList from './ui/ShoppingList'

import styles from './DashboardShoppingView.module.css'

const DashboardShoppingView: FC = () => {
  const { items } = useShoppingItems(undefined)
  const [deleteItem] = useDeleteShoppingItemMutation()
  const purchasedItems = items.filter((item) => item.purchased)

  const handleClearPurchased = useCallback(async () => {
    const toDelete = items.filter((item) => item.purchased)
    if (toDelete.length === 0) return
    try {
      for (const item of toDelete) {
        await deleteItem({ id: item.id }).unwrap()
      }
      notifications.show({
        title: 'Готово',
        message: `Удалено товаров: ${toDelete.length}`,
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось удалить купленные товары',
        color: 'red',
      })
    }
  }, [items, deleteItem])

  return (
    <DashboardLayout
      title="Список покупок"
      headerRight={
        purchasedItems.length > 0 ? (
          <>
            <IconTrash
              size={35}
              color="red"
              className={styles.headerButtonMobile}
              onClick={handleClearPurchased}
            />
            <Button
              className={styles.headerButtonDesktop}
              variant="light"
              color="red"
              size="xs"
              leftSection={<IconTrash size={16} />}
              onClick={handleClearPurchased}
            >
              Удалить купленные ({purchasedItems.length})
            </Button>
          </>
        ) : undefined
      }
    >
      <ShoppingList />
    </DashboardLayout>
  )
}

export default DashboardShoppingView
