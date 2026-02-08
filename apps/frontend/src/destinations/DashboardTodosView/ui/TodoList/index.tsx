import { FC, useCallback } from 'react'
import { type TodoType } from '@family-business/types/entities'
import { useTodos } from '@/models/todo'
import { EditTodoModal, ViewTodoDrawer } from '@/features/todo'
import { BaseList } from '@/shared/ui'
import TodoListItem from '../TodoListItem'
import { useDeleteTodoMutation, useToggleTodoMutation } from '@/models/todo'

interface TodoListProps {}

const TodoList: FC<TodoListProps> = () => {
  const { todos, refetch } = useTodos()
  const [toggleItem] = useToggleTodoMutation()
  const [deleteItem] = useDeleteTodoMutation()

  const handleDeleteItem = useCallback(
    async (id: string) => {
      await deleteItem({ id }).unwrap()
    },
    [deleteItem],
  )

  const handleToggleItem = useCallback(
    async (id: string, completed: boolean) => {
      await toggleItem({ id, completed }).unwrap()
    },
    [toggleItem],
  )

  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  return (
    <BaseList<TodoType>
      items={todos ?? []}
      onRefresh={handleRefresh}
      getKey={(todo) => todo.id}
      emptyText="Задач пока нет. Создайте первую чтобы начать!"
      renderItem={(todo, { openView, openEdit }) => (
        <TodoListItem
          todo={todo}
          onToggle={handleToggleItem}
          onView={() => openView(todo)}
          onEdit={() => openEdit(todo)}
          onDelete={handleDeleteItem}
        />
      )}
      renderViewOverlay={({ item, opened, onClose }) => (
        <ViewTodoDrawer opened={opened} todo={item} onClose={onClose} />
      )}
      renderEditOverlay={({ item, opened, onClose }) => (
        <EditTodoModal opened={opened} item={item} onClose={onClose} />
      )}
    />
  )
}

export default TodoList
