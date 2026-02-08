import { FC, useMemo } from 'react'
import { Modal } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { type ShoppingItemType } from '@family-business/types/entities'
import ShoppingItemForm, { type ShoppingItemFormValues } from '../../ShoppingItemForm'
import { useUpdateShoppingItemMutation } from '@/models/shopping'

interface EditShoppingItemModalProps {
  opened: boolean
  onClose: () => void
  item: ShoppingItemType
}

const EditShoppingItemModal: FC<EditShoppingItemModalProps> = ({ opened, onClose, item }) => {
  const [updateShoppingItem, { isLoading }] = useUpdateShoppingItemMutation()

  const initialValues = useMemo<ShoppingItemFormValues>(
    () => ({
      name: item.name,
      quantity: item.quantity ?? null,
      unit: item.unit ?? null,
      category: item.category ?? null,
    }),
    [item.id, item.name, item.quantity, item.unit, item.category],
  )

  const handleSubmit = async (values: ShoppingItemFormValues) => {
    try {
      await updateShoppingItem({
        id: item.id,
        body: {
          name: values.name,
          quantity: values.quantity ?? undefined,
          unit: values.unit ?? undefined,
          category: values.category ?? undefined,
        },
      }).unwrap()

      onClose()

      notifications.show({
        title: 'Успех',
        message: 'Товар обновлен',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить товар',
        color: 'red',
      })
      throw new Error('Update failed')
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Редактировать товар">
      <ShoppingItemForm
        initialValues={initialValues}
        opened={opened}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Сохранить"
      />
    </Modal>
  )
}

export default EditShoppingItemModal
