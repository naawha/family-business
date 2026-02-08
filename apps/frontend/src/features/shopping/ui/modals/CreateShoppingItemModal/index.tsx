import { FC } from 'react'
import { Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useFamily } from '@/models/accounts'
import ShoppingItemForm, { type ShoppingItemFormValues } from '../../ShoppingItemForm'
import { useCreateShoppingItemMutation } from '@/models/shopping'

interface CreateShoppingItemModalProps {
  opened: boolean
  onClose: () => void
}

const CreateShoppingItemModal: FC<CreateShoppingItemModalProps> = ({ opened, onClose }) => {
  const { family } = useFamily()
  const [createShoppingItem, { isLoading }] = useCreateShoppingItemMutation()

  const handleSubmit = async (values: ShoppingItemFormValues) => {
    try {
      await createShoppingItem({
        familyId: family?.id ?? '',
        name: values.name,
        quantity: values.quantity ?? undefined,
        category: values.category ?? undefined,
      }).unwrap()

      onClose()

      notifications.show({
        title: 'Успех',
        message: 'Товар добавлен в список',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось добавить товар',
        color: 'red',
      })
      throw new Error('Create failed')
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Добавить товар">
      <ShoppingItemForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Добавить"
        resetOnSuccess
      />
    </Modal>
  )
}

export default CreateShoppingItemModal
