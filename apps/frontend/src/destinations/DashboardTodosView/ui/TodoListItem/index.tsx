import { FC } from 'react'
import { type TodoType } from '@family-business/types/entities'
import { Avatar, BaseListItem } from '@/shared/ui'

interface TodoListItemProps {
  todo: TodoType
  onToggle: (id: string, completed: boolean) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<void>
  /** По клику по строке — открыть просмотр задачи */
  onView?: () => void
  /** Показывать кнопки действий (на десктопе). На мобильных — кнопки прячутся за свайп. */
  showActions?: boolean
}

const TodoListItem: FC<TodoListItemProps> = ({ todo, onToggle, onEdit, onDelete, onView }) => {
  return (
    <BaseListItem
      itemId={todo.id}
      checked={todo.completed}
      onToggle={onToggle}
      onEdit={onEdit}
      onDelete={onDelete}
      onClick={onView ? () => onView() : undefined}
      name={todo.title}
      rightExtra={todo.assignedTo && <Avatar user={todo.assignedTo} size={32} />}
      highlightColor={todo.isImportant ? '#d32f2f' : undefined}
    />
  )
}

export default TodoListItem
