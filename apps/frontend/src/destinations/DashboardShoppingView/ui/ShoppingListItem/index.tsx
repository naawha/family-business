import { FC } from 'react'
import { Badge, Group, Text } from '@mantine/core'
import { type ShoppingItemType } from '@family-business/types/entities'
import { BaseListItem } from '@/shared/ui'

interface ShoppingListItemProps {
  item: ShoppingItemType
  onEdit: (itemId: string) => void
  onDelete: (itemId: string) => Promise<void>
  onToggle: (itemId: string, purchased: boolean) => void
}

const ShoppingListItem: FC<ShoppingListItemProps> = ({ item, onEdit, onDelete, onToggle }) => {
  return (
    <BaseListItem
      itemId={item.id}
      checked={item.purchased}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
      name={item.name}
      description={item.quantity ? `${item.quantity} ${item.unit || 'шт'}` : undefined}
      helpText={item.recipe ? `для рецепта «${item.recipe.name}»` : undefined}
    />
  )
}

export default ShoppingListItem
