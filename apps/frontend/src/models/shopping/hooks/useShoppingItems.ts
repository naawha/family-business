import { ShoppingItemType } from '@family-business/types/entities'
import { useMemo } from 'react'
import { useShoppingListQuery } from '../api/shoppingService'

const sortShoppingItems = (items: ShoppingItemType[]): ShoppingItemType[] => {
  return [...items].sort((a, b) => {
    if (a.purchased !== b.purchased) return a.purchased ? 1 : -1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

const useShoppingItems = (arg?: undefined, options?: { skip?: boolean }) => {
  const { data: items = [], isLoading, refetch } = useShoppingListQuery(arg, options)

  const sortedItems: ShoppingItemType[] = useMemo(() => sortShoppingItems(items), [items])

  return { items: sortedItems, isLoading, refetch }
}

export default useShoppingItems
