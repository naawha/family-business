import { FC } from 'react'
import { type RecipeType } from '@family-business/types/entities'
import { BaseListItem } from '@/shared/ui'
import { Text } from '@mantine/core'

interface RecipeListItemProps {
  item: RecipeType
  onEdit?: (id: string) => void
  onDelete?: (id: string) => Promise<void>
  onView?: (id: string) => void
}

const RecipeListItem: FC<RecipeListItemProps> = ({ item, onEdit, onDelete, onView }) => {
  return (
    <BaseListItem
      itemId={item.id}
      onEdit={onEdit}
      onDelete={onDelete}
      deleteConfirmMessage="Удалить этот рецепт?"
      name={item.name}
      onClick={onView}
      leftExtra={item.emoji && <Text style={{ fontSize: '2rem' }}>{item.emoji}</Text>}
    />
  )
}

export default RecipeListItem
