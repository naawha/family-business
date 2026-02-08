import { FC, useMemo } from 'react'
import { notifications } from '@mantine/notifications'
import { type TodoType } from '@family-business/types/entities'
import { BaseDrawer } from '@/shared/ui'
import TodoForm, { type TodoFormValues } from '../../TodoForm'
import { useUpdateTodoMutation } from '@/models/todo'

interface EditTodoModalProps {
  opened: boolean
  onClose: () => void
  item: TodoType | null
}

const EditTodoModal: FC<EditTodoModalProps> = ({ opened, onClose, item }) => {
  const [updateTodo, { isLoading }] = useUpdateTodoMutation()

  const initialValues = useMemo<TodoFormValues | null>(() => {
    if (!item) return null
    return {
      title: item.title,
      description: item.description ?? '',
      isImportant: item.isImportant,
      assignedToId: item.assignedToId ?? null,
    }
  }, [item?.id, item?.title, item?.description, item?.isImportant, item?.assignedToId])

  const handleSubmit = async (values: TodoFormValues) => {
    if (!item) return

    try {
      await updateTodo({
        id: item.id,
        body: {
          title: values.title,
          description: values.description || undefined,
          isImportant: values.isImportant,
          assignedToId: values.assignedToId,
        },
      }).unwrap()

      onClose()

      notifications.show({
        title: 'Успех',
        message: 'Задача обновлена',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить задачу',
        color: 'red',
      })
      throw new Error('Update failed')
    }
  }

  return (
    <BaseDrawer opened={opened} onClose={onClose} title="Редактировать задачу">
      {initialValues && (
        <TodoForm
          initialValues={initialValues}
          opened={opened}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Сохранить"
        />
      )}
    </BaseDrawer>
  )
}

export default EditTodoModal
