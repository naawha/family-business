import { FC } from 'react'
import { notifications } from '@mantine/notifications'
import { useFamily } from '@/models/accounts'
import { parseIngredientLine, useCreateRecipeMutation } from '@/models/recipes'
import RecipeForm, { type RecipeFormValues } from '../../RecipeForm'
import BaseDrawer from '@/shared/ui/BaseDrawer'

interface CreateRecipeModalProps {
  opened: boolean
  onClose: () => void
}

const CreateRecipeModal: FC<CreateRecipeModalProps> = ({ opened, onClose }) => {
  const { family } = useFamily()
  const [createRecipe, { isLoading }] = useCreateRecipeMutation()

  const handleSubmit = async (values: RecipeFormValues) => {
    if (!family) {
      notifications.show({
        title: 'Ошибка',
        message: 'Выберите семью в настройках',
        color: 'red',
      })
      return
    }

    try {
      await createRecipe({
        familyId: family.id,
        name: values.name.trim(),
        servings: values.servings,
        emoji: values.emoji || undefined,
        instructions: values.instructions.trim() || undefined,
        isPublic: false,
        ingredients: (values.ingredientLines || [])
          .map((line) => parseIngredientLine(line))
          .filter(
            (ing): ing is NonNullable<ReturnType<typeof parseIngredientLine>> =>
              ing != null && ing.name.trim() !== '',
          )
          .map((ing, index) => ({
            name: ing.name.trim(),
            quantity: ing.quantity,
            unit: ing.unit,
            notes: ing.notes?.trim() || undefined,
            order: index,
          })),
      }).unwrap()

      onClose()

      notifications.show({
        title: 'Успех',
        message: 'Рецепт создан',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось создать рецепт',
        color: 'red',
      })
      throw new Error('Create failed')
    }
  }

  return (
    <BaseDrawer opened={opened} onClose={onClose} title="Создать рецепт" desktopSize={640}>
      <RecipeForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Создать"
        resetOnSuccess
        opened={opened}
      />
    </BaseDrawer>
  )
}

export default CreateRecipeModal
