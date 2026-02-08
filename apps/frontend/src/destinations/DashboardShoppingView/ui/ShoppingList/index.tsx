import { FC, useState, useCallback } from 'react'
import { Box } from '@mantine/core'
import { type ShoppingItemType } from '@family-business/types/entities'
import { useFamily } from '@/models/accounts'
import { parseShoppingInput, formatShoppingItemToString } from '@/shared/helpers/shoppingInput'
import ShoppingListItem from '../ShoppingListItem'
import { BaseList } from '@/shared/ui'
import ShoppingInput from '../ShoppingInput'

import styles from './ShoppingList.module.css'
import {
  useShoppingItems,
  useCreateShoppingItemMutation,
  useDeleteShoppingItemMutation,
  useToggleShoppingItemMutation,
} from '@/models/shopping'

interface ShoppingListProps {}

const ShoppingList: FC<ShoppingListProps> = () => {
  const { items, refetch } = useShoppingItems()
  const { family } = useFamily()
  const [inputValue, setInputValue] = useState('')
  const [createItem] = useCreateShoppingItemMutation()
  const [deleteItem] = useDeleteShoppingItemMutation()
  const [updateItem] = useToggleShoppingItemMutation()

  const handleDeleteItem = useCallback((id: string) => deleteItem({ id }).unwrap(), [deleteItem])

  const handleEditItem = useCallback(
    async (itemId: string) => {
      const item = items.find((item) => item.id === itemId)
      if (!item) {
        return
      }
      await handleDeleteItem(itemId)
      setInputValue(formatShoppingItemToString(item))
    },
    [handleDeleteItem],
  )

  const handleToggleItem = useCallback(
    async (itemId: string, purchased: boolean) => {
      updateItem({ id: itemId, purchased }).unwrap()
    },
    [updateItem],
  )

  const handleSubmit = useCallback(
    async (rawValue: string) => {
      if (!rawValue.trim()) {
        return
      }

      const { name, quantity, unit } = parseShoppingInput(rawValue.trim())

      if (!name) {
        return
      }

      try {
        await createItem({
          familyId: family?.id ?? '',
          name,
          quantity,
          unit,
        }).unwrap()

        setInputValue('')
      } catch (error) {
        console.error('Failed to create shopping item:', error)
      }
    },
    [createItem, family?.id],
  )

  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  return (
    <>
      <BaseList<ShoppingItemType>
        onRefresh={handleRefresh}
        items={items}
        getKey={(item) => item.id}
        emptyText="Список покупок пуст. Добавьте первый товар чтобы начать!"
        renderItem={(item) => (
          <ShoppingListItem
            item={item}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onToggle={handleToggleItem}
          />
        )}
      />

      <Box className={styles.inputBar}>
        <ShoppingInput value={inputValue} onChange={setInputValue} onSubmit={handleSubmit} />
      </Box>
    </>
  )
}

export default ShoppingList
