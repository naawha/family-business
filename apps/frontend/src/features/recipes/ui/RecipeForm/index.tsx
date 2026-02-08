import { FC, useEffect, useRef, useState } from 'react'
import { Form, Field } from 'react-final-form'
import type { FormApi } from 'final-form'
import {
  Text,
  TextInput,
  Select,
  Button,
  Stack,
  NumberInput,
  ActionIcon,
  Group,
  Paper,
  Box,
} from '@mantine/core'
import { IconTrash, IconPencil } from '@tabler/icons-react'
import { EmojiPicker, MarkdownField } from '@/shared/ui'

export type RecipeFormValues = {
  name: string
  servings: number
  emoji: string | null
  instructions: string
  ingredientLines: string[]
}

const defaultValues: RecipeFormValues = {
  name: '',
  servings: 4,
  emoji: null,
  instructions: '',
  ingredientLines: [],
}

const validate = (values: Partial<RecipeFormValues>) => {
  const errors: Partial<Record<keyof RecipeFormValues, string>> = {}
  if (!values.name?.trim()) errors.name = 'Обязательное поле'
  if (values.servings && values.servings < 1) errors.servings = 'Минимум 1 порция'
  return errors
}

const EditSync: FC<{
  form: FormApi<RecipeFormValues>
  opened?: boolean
  initialValues?: RecipeFormValues
}> = ({ form, opened, initialValues }) => {
  const prevRef = useRef(false)
  useEffect(() => {
    if (opened && !prevRef.current && initialValues) {
      form.initialize(initialValues)
    }
    prevRef.current = !!opened
  }, [opened, initialValues, form])
  return null
}

const RecipeForm: FC<{
  initialValues?: RecipeFormValues | null
  opened?: boolean
  onSubmit: (values: RecipeFormValues) => void | Promise<void>
  isLoading?: boolean
  submitLabel: string
  resetOnSuccess?: boolean
}> = ({
  initialValues,
  opened,
  onSubmit,
  isLoading = false,
  submitLabel,
  resetOnSuccess = false,
}) => {
  const formApiRef = useRef<FormApi<RecipeFormValues> | null>(null)
  const [emojiPickerOpened, setEmojiPickerOpened] = useState(false)
  const [newIngredientInput, setNewIngredientInput] = useState('')
  const ingredientInputRef = useRef<HTMLInputElement>(null)
  const formInitialValues = initialValues || defaultValues

  const handleSubmit = async (values: RecipeFormValues) => {
    await onSubmit(values)
    if (resetOnSuccess && formApiRef.current) {
      formApiRef.current.restart(defaultValues)
      setNewIngredientInput('')
    }
  }

  return (
    <Form<RecipeFormValues>
      initialValues={formInitialValues}
      validate={validate}
      onSubmit={handleSubmit as any}
      subscription={{ submitting: true, values: true }}
      render={({ handleSubmit, form, values }) => {
        formApiRef.current = form
        const lines = values?.ingredientLines || []

        const addIngredient = () => {
          const t = newIngredientInput.trim()
          if (t) {
            form.change('ingredientLines', [...lines, t])
            setNewIngredientInput('')
          }
        }

        const removeIngredient = (index: number) => {
          const next = lines.filter((_, i) => i !== index)
          form.change('ingredientLines', next)
        }

        const editIngredient = (index: number) => {
          const line = lines[index]
          removeIngredient(index)
          setNewIngredientInput(line)
          setTimeout(() => ingredientInputRef.current?.focus(), 0)
        }

        const handleIngredientKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            addIngredient()
          }
        }

        return (
          <form onSubmit={handleSubmit}>
            <EditSync form={form} opened={opened} initialValues={initialValues || undefined} />
            <Stack gap="md">
              <Field<RecipeFormValues['name']> name="name">
                {({ input, meta }) => (
                  <TextInput
                    label="Название рецепта"
                    placeholder="Название рецепта"
                    value={input.value}
                    onChange={(e) => input.onChange(e.target.value)}
                    onBlur={input.onBlur}
                    error={meta.touched && meta.error}
                    required
                  />
                )}
              </Field>

              <Group grow style={{ alignItems: 'flex-end' }}>
                <Field<RecipeFormValues['servings']> name="servings">
                  {({ input, meta }) => (
                    <NumberInput
                      label="Количество порций"
                      value={input.value}
                      onChange={(value) => input.onChange(value ?? 4)}
                      onBlur={input.onBlur}
                      error={meta.touched && meta.error}
                      min={1}
                      required
                    />
                  )}
                </Field>

                <Field<RecipeFormValues['emoji']> name="emoji">
                  {({ input }) => (
                    <>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => setEmojiPickerOpened(true)}
                      >
                        {input.value ? `${input.value} Эмодзи рецепта` : 'Выбрать эмодзи'}
                      </Button>
                      <EmojiPicker
                        opened={emojiPickerOpened}
                        onClose={() => setEmojiPickerOpened(false)}
                        onSelect={(emoji) => {
                          input.onChange(emoji)
                          setEmojiPickerOpened(false)
                        }}
                        selectedEmoji={input.value}
                        categoryKeys={['food']}
                      />
                    </>
                  )}
                </Field>
              </Group>

              <Field<RecipeFormValues['instructions']> name="instructions">
                {({ input, meta }) => (
                  <MarkdownField
                    label="Инструкции по приготовлению"
                    placeholder="Пошаговые инструкции (поддерживается Markdown)"
                    value={input.value}
                    onChange={input.onChange}
                    onBlur={input.onBlur}
                    minRows={10}
                    error={meta.touched && meta.error}
                  />
                )}
              </Field>

              <div>
                <Text size="sm" fw={500} mb="xs">
                  Ингредиенты
                </Text>
                <Text size="xs" c="dimmed" mb="sm">
                  Формат: название: количество единица. Например: Молоко: 1 л
                </Text>
                <Stack gap="xs" mb="sm">
                  {lines.map((line, index) => (
                    <Paper key={index} p="sm" withBorder>
                      <Group wrap="nowrap" gap="sm" justify="space-between">
                        <Text size="sm" style={{ flex: 1 }} lineClamp={1}>
                          {line}
                        </Text>
                        <Group gap={4}>
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={() => editIngredient(index)}
                            aria-label="Редактировать"
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <ActionIcon
                            color="red"
                            variant="subtle"
                            size="sm"
                            onClick={() => removeIngredient(index)}
                            aria-label="Удалить"
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
                <TextInput
                  ref={ingredientInputRef}
                  placeholder="Молоко: 1 л — Enter чтобы добавить"
                  value={newIngredientInput}
                  onChange={(e) => setNewIngredientInput(e.target.value)}
                  onKeyDown={handleIngredientKeyDown}
                />
              </div>

              <Button type="submit" loading={isLoading} fullWidth>
                {submitLabel}
              </Button>
            </Stack>
          </form>
        )
      }}
    />
  )
}

export default RecipeForm
