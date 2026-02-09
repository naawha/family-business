import { FC, useState, useMemo } from 'react'
import {
  Loader,
  Center,
  Stack,
  Group,
  Badge,
  Paper,
  Text,
  Checkbox,
  Button,
  Slider,
  Collapse,
  UnstyledButton,
} from '@mantine/core'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { useCreateShoppingItemMutation, useShoppingItems } from '@/models/shopping'
import { useFamily } from '@/models/accounts'
import { notifications } from '@mantine/notifications'
import {
  useRecipeIngredients,
  checkIngredientAvailability,
  scaleIngredientQuantity,
} from '@/models/recipes'
import { type RecipeType } from '@family-business/types/entities'
import ReactMarkdown from 'react-markdown'
import BaseDrawer from '@/shared/ui/BaseDrawer'

const PORTION_SCALES = [0.5, 1, 2, 3, 4, 5]

interface ViewRecipeDrawerProps {
  opened: boolean
  onClose: () => void
  recipe: RecipeType | null
}

const ViewRecipeDrawer: FC<ViewRecipeDrawerProps> = ({ opened, onClose, recipe }) => {
  const { family } = useFamily()
  const { ingredients, isLoading: ingredientsLoading } = useRecipeIngredients(recipe?.id || '')
  const { items: shoppingItems = [] } = useShoppingItems(!opened)
  const [createShoppingItem] = useCreateShoppingItemMutation()

  const [selectedPortionScale, setSelectedPortionScale] = useState(1)
  const [excludedIngredientIds, setExcludedIngredientIds] = useState<Set<string>>(new Set())
  const [instructionsExpanded, setInstructionsExpanded] = useState(true)

  const isLoading = !!recipe && (ingredientsLoading || !ingredients.length)

  const scaledIngredients = useMemo(() => {
    return ingredients.map((ingredient) => {
      const scaled = scaleIngredientQuantity(ingredient, selectedPortionScale)
      const availability = checkIngredientAvailability(ingredient, shoppingItems)
      return {
        ...ingredient,
        scaledQuantity: scaled.quantity,
        isAvailable: availability.isAvailable,
        matchingItem: availability.matchingItem,
      }
    })
  }, [ingredients, selectedPortionScale, shoppingItems])

  const toggleIngredient = (ingredientId: string) => {
    setExcludedIngredientIds((prev) => {
      const next = new Set(prev)
      if (next.has(ingredientId)) {
        next.delete(ingredientId)
      } else {
        next.add(ingredientId)
      }
      return next
    })
  }

  const handleAddToShoppingList = async () => {
    if (!recipe || !family) return

    const ingredientsToAdd = scaledIngredients.filter(
      (ing) => !excludedIngredientIds.has(ing.id) && !ing.isAvailable,
    )

    if (ingredientsToAdd.length === 0) {
      notifications.show({
        title: 'Информация',
        message: 'Все ингредиенты уже есть в списке покупок',
        color: 'blue',
      })
      return
    }

    try {
      for (const ingredient of ingredientsToAdd) {
        await createShoppingItem({
          familyId: family.id,
          name: ingredient.name,
          quantity: Math.round(ingredient.scaledQuantity),
          unit: ingredient.unit as any,
          recipeId: recipe.id,
        }).unwrap()
      }
      notifications.show({
        title: 'Успех',
        message: `Добавлено ${ingredientsToAdd.length} ингредиентов в список покупок`,
        color: 'green',
      })
      onClose()
    } catch {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось добавить ингредиенты в список покупок',
        color: 'red',
      })
    }
  }

  const displayEmoji = recipe?.emoji || '🍳'
  const effectiveServings = recipe != null ? Math.round(recipe.servings * selectedPortionScale) : 0

  return (
    <BaseDrawer
      opened={opened}
      onClose={onClose}
      title={`${recipe?.name} ${displayEmoji}`}
      desktopSize={640}
    >
      {isLoading || !recipe ? (
        <Center h={200}>{isLoading ? <Loader /> : <Text c="dimmed">Рецепт не найден</Text>}</Center>
      ) : (
        <Stack gap="md">
          {recipe.instructions && (
            <>
              <UnstyledButton
                onClick={() => setInstructionsExpanded((v) => !v)}
                style={{ display: 'block', width: '100%' }}
              >
                <Group justify="center" gap="xs" wrap="nowrap">
                  <Text size="sm" fw={500} c="dimmed">
                    Способ приготовления
                  </Text>
                  {instructionsExpanded ? (
                    <IconChevronUp size={16} />
                  ) : (
                    <IconChevronDown size={16} />
                  )}
                </Group>
              </UnstyledButton>
              <Collapse in={instructionsExpanded}>
                <Paper p="md" withBorder>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <Text component="p" size="sm" mb="xs">
                          {children}
                        </Text>
                      ),
                      ul: ({ children }) => (
                        <Text
                          component="ul"
                          size="sm"
                          mb="xs"
                          pl="md"
                          style={{ listStyle: 'disc' }}
                        >
                          {children}
                        </Text>
                      ),
                      ol: ({ children }) => (
                        <Text
                          component="ol"
                          size="sm"
                          mb="xs"
                          pl="md"
                          style={{ listStyle: 'decimal' }}
                        >
                          {children}
                        </Text>
                      ),
                      li: ({ children }) => (
                        <Text component="li" size="sm">
                          {children}
                        </Text>
                      ),
                      strong: ({ children }) => (
                        <Text component="span" fw={600}>
                          {children}
                        </Text>
                      ),
                    }}
                  >
                    {recipe.instructions}
                  </ReactMarkdown>
                </Paper>
              </Collapse>
            </>
          )}
          <Stack gap="xs" p="md">
            <Group justify="space-between" align="center">
              <Text size="sm" fw={500}>
                Количество порций
              </Text>
              <Badge size="lg" variant="light">
                🍽 {effectiveServings} порций
              </Badge>
            </Group>
            <Slider
              value={selectedPortionScale}
              onChange={setSelectedPortionScale}
              min={0.5}
              max={5}
              step={0.5}
              marks={PORTION_SCALES.map((scale) => ({
                value: scale,
                label: String(Math.round(recipe.servings * scale)),
              }))}
              label={(value) => String(Math.round(recipe.servings * value))}
              styles={{ markLabel: { fontSize: 11 } }}
            />
          </Stack>

          <Stack gap="sm">
            {scaledIngredients.map((ingredient) => (
              <Paper key={ingredient.id} p="sm" withBorder>
                <Group onClick={() => toggleIngredient(ingredient.id)}>
                  <Checkbox checked={!excludedIngredientIds.has(ingredient.id)} />
                  <div style={{ flex: 1 }}>
                    <Text
                      fw={500}
                      td={excludedIngredientIds.has(ingredient.id) ? 'line-through' : undefined}
                      c={excludedIngredientIds.has(ingredient.id) ? 'dimmed' : undefined}
                    >
                      {ingredient.name}
                      {ingredient.isAvailable && ' (уже есть)'}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {ingredient.scaledQuantity} {ingredient.unit || 'шт'}
                      {ingredient.notes && ` — ${ingredient.notes}`}
                    </Text>
                  </div>
                </Group>
              </Paper>
            ))}
          </Stack>

          <Button size="lg" onClick={handleAddToShoppingList}>
            Добавить в список покупок
          </Button>
        </Stack>
      )}
    </BaseDrawer>
  )
}

export default ViewRecipeDrawer
