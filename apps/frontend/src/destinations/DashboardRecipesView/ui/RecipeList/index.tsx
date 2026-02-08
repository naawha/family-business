import { FC, useCallback, useState } from 'react'
import { Center, TextInput, Text, Box } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useFamily } from '@/models/accounts'
import type { RecipeType } from '@family-business/types/entities'
import RecipeListItem from '../RecipeListItem'
import { EditRecipeModal, ViewRecipeModal } from '@/features/recipes'
import { useRecipes } from '@/models/recipes'
import { BaseList } from '@/shared/ui'
import { useDeleteRecipeMutation } from '@/models/recipes'

const RecipeList: FC = () => {
  const { family } = useFamily()
  const [search, setSearch] = useState('')
  const { recipes, isLoading, refetch } = useRecipes(search)
  const [deleteRecipe] = useDeleteRecipeMutation()

  const handleDelete = useCallback((id: string) => deleteRecipe({ id }).unwrap(), [deleteRecipe])
  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])
  if (!family) {
    return (
      <Center h={200}>
        <Text c="dimmed">Выберите семью в настройках</Text>
      </Center>
    )
  }

  return (
    <BaseList<RecipeType>
      items={recipes}
      getKey={(recipe) => recipe.id}
      loading={isLoading}
      emptyText="Рецептов пока нет. Создайте первый рецепт!"
      onRefresh={handleRefresh}
      header={
        <Box m="md">
          <TextInput
            placeholder="Поиск рецептов..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
        </Box>
      }
      renderItem={(recipe, { openView, openEdit }) => (
        <RecipeListItem
          item={recipe}
          onEdit={() => openEdit(recipe)}
          onDelete={handleDelete}
          onView={() => openView(recipe)}
        />
      )}
      renderEditOverlay={({ item, opened, onClose }) => (
        <EditRecipeModal opened={opened} onClose={onClose} recipe={item} />
      )}
      renderViewOverlay={({ item, opened, onClose }) => (
        <ViewRecipeModal opened={opened} onClose={onClose} recipe={item} />
      )}
    />
  )
}

export default RecipeList
