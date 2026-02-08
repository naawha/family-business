import { FC, useMemo } from 'react'
import { notifications } from '@mantine/notifications'
import { useRecipeIngredients } from '@/models/recipes'
import {
  formatIngredientLine,
  parseIngredientLine,
  useUpdateRecipeMutation,
} from '@/models/recipes'
import type { RecipeType } from '@family-business/types/entities'
import { BaseDrawer } from '@/shared/ui'
import RecipeForm, { type RecipeFormValues } from '../../RecipeForm'

interface EditRecipeModalProps {
  opened: boolean
  onClose: () => void
  recipe: RecipeType | null
}

const EditRecipeModal: FC<EditRecipeModalProps> = ({ opened, onClose, recipe }) => {
  const [updateRecipe, { isLoading }] = useUpdateRecipeMutation()
  const { ingredients } = useRecipeIngredients(recipe?.id || '')

  const initialValues = useMemo<RecipeFormValues | null>(() => {
    if (!recipe) return null

    return {
      name: recipe.name,
      category: recipe.category ?? null,
      servings: recipe.servings,
      emoji: recipe.emoji ?? null,
      instructions: recipe.instructions ?? '',
      ingredientLines: ingredients.map((ing) => formatIngredientLine(ing)) ?? [],
    }
  }, [
    recipe?.id,
    recipe?.name,
    recipe?.category,
    recipe?.servings,
    recipe?.emoji,
    recipe?.instructions,
    ingredients,
  ])

  const handleSubmit = async (values: RecipeFormValues) => {
    try {
      await updateRecipe({
        id: recipe?.id || '',
        body: {
          name: values.name.trim(),
          servings: values.servings,
          emoji: values.emoji || undefined,
          instructions: values.instructions.trim() || undefined,
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
        },
      }).unwrap()

      onClose()

      notifications.show({
        title: 'Успех',
        message: 'Рецепт обновлен',
        color: 'green',
      })
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить рецепт',
        color: 'red',
      })
      throw new Error('Update failed')
    }
  }

  return (
    <BaseDrawer opened={opened} onClose={onClose} title="Редактировать рецепт" desktopSize={640}>
      <RecipeForm
        initialValues={initialValues}
        opened={opened}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitLabel="Сохранить"
      />
    </BaseDrawer>
  )
}

export default EditRecipeModal
