import { FC } from 'react'
import { notifications } from '@mantine/notifications'
import { useFamily } from '@/models/accounts'
import { BaseDrawer } from '@/shared/ui'
import TodoForm, { type TodoFormValues } from '../../TodoForm'
import { useCreateTodoMutation } from '@/models/todo'

interface CreateTodoModalProps {
  opened: boolean
  onClose: () => void
}

const CreateTodoModal: FC<CreateTodoModalProps> = ({ opened, onClose }) => {
  const { family } = useFamily()
  const [createTodo, { isLoading }] = useCreateTodoMutation()

  const handleSubmit = async (values: TodoFormValues) => {
    try {
      await createTodo({
        familyId: family?.id,
        title: values.title,
        description: values.description || undefined,
        isImportant: values.isImportant,
        assignedToId: values.assignedToId ?? undefined,
      }).unwrap()

      onClose()

      notifications.show({
        title: 'Успех',
        message: 'Задача создана',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать задачу',
        color: 'red',
      })
      throw new Error('Create failed')
    }
  }

  return (
    <BaseDrawer opened={opened} onClose={onClose} title="Создать задачу">
      <TodoForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Создать"
        resetOnSuccess
      />
    </BaseDrawer>
  )
}

export default CreateTodoModal
