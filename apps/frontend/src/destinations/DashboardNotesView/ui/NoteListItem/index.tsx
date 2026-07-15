import { FC } from 'react'
import { type NoteType } from '@family-business/types/entities'
import { BaseListItem } from '@/shared/ui'

interface NoteListItemProps {
  item: NoteType
  onEdit?: (id: string) => void
  onDelete?: (id: string) => Promise<void>
  onView?: (id: string) => void
}

const NoteListItem: FC<NoteListItemProps> = ({ item, onEdit, onDelete, onView }) => {
  return (
    <BaseListItem
      itemId={item.id}
      onEdit={onEdit}
      onDelete={onDelete}
      deleteConfirmMessage="Удалить эту заметку?"
      name={item.title}
      onClick={onView}
    />
  )
}

export default NoteListItem
