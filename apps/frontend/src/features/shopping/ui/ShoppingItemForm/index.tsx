import { FC, useEffect, useRef } from 'react'
import { Form, Field } from 'react-final-form'
import type { FormApi } from 'final-form'
import { TextInput, NumberInput, Select, Button, Stack } from '@mantine/core'
import { type ShoppingItemUnitType, SHOPPING_ITEM_UNIT } from '@family-business/types/entities'

export type ShoppingItemFormValues = {
  name: string
  quantity: number | null
  unit: ShoppingItemUnitType | null
  category: string | null
}

interface ShoppingItemFormProps {
  initialValues?: ShoppingItemFormValues
  opened?: boolean
  onSubmit: (values: ShoppingItemFormValues) => void | Promise<void>
  isLoading?: boolean
  submitLabel: string
  resetOnSuccess?: boolean
}

const defaultValues: ShoppingItemFormValues = {
  name: '',
  quantity: null,
  unit: SHOPPING_ITEM_UNIT.PIECE,
  category: null,
}

const unitOptions = [
  { value: SHOPPING_ITEM_UNIT.PIECE, label: 'шт' },
  { value: SHOPPING_ITEM_UNIT.GRAM, label: 'г' },
  { value: SHOPPING_ITEM_UNIT.KILOGRAM, label: 'кг' },
  { value: SHOPPING_ITEM_UNIT.LITER, label: 'л' },
  { value: SHOPPING_ITEM_UNIT.MILLILITER, label: 'мл' },
]

const validate = (values: Partial<ShoppingItemFormValues>) => {
  const errors: Partial<Record<keyof ShoppingItemFormValues, string>> = {}
  if (!values.name?.trim()) errors.name = 'Обязательное поле'
  return errors
}

const EditSync: FC<{
  form: FormApi<ShoppingItemFormValues>
  opened?: boolean
  initialValues?: ShoppingItemFormValues
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

const ShoppingItemForm: FC<ShoppingItemFormProps> = ({
  initialValues,
  opened,
  onSubmit,
  isLoading = false,
  submitLabel,
  resetOnSuccess = false,
}) => {
  const formApiRef = useRef<FormApi<ShoppingItemFormValues> | null>(null)

  const formInitialValues = initialValues ?? defaultValues

  const categoryOptions = [
    { value: 'Овощи и фрукты', label: 'Овощи и фрукты' },
    { value: 'Молочные продукты', label: 'Молочные продукты' },
    { value: 'Мясо и рыба', label: 'Мясо и рыба' },
    { value: 'Хлеб и выпечка', label: 'Хлеб и выпечка' },
    { value: 'Бакалея', label: 'Бакалея' },
    { value: 'Напитки', label: 'Напитки' },
    { value: 'Сладости', label: 'Сладости' },
    { value: 'Бытовая химия', label: 'Бытовая химия' },
    { value: 'Прочее', label: 'Прочее' },
  ]

  const handleSubmit = async (values: ShoppingItemFormValues) => {
    await onSubmit(values)
    if (resetOnSuccess && formApiRef.current) {
      formApiRef.current.restart(defaultValues)
    }
  }

  return (
    <Form<ShoppingItemFormValues>
      initialValues={formInitialValues}
      validate={validate}
      onSubmit={handleSubmit}
      subscription={{ submitting: true }}
      render={({ handleSubmit, form }) => {
        formApiRef.current = form

        return (
          <form onSubmit={handleSubmit}>
            <EditSync form={form} opened={opened} initialValues={initialValues} />
            <Stack gap="md">
              <Field<ShoppingItemFormValues['name']> name="name">
                {({ input, meta }) => (
                  <TextInput
                    label="Название"
                    placeholder="Название товара"
                    value={input.value}
                    onChange={(e) => input.onChange(e.target.value)}
                    onBlur={input.onBlur}
                    error={meta.touched && meta.error}
                    required
                  />
                )}
              </Field>

              <Field<ShoppingItemFormValues['quantity']> name="quantity">
                {({ input }) => (
                  <NumberInput
                    label="Количество"
                    placeholder="Опционально"
                    value={input.value ?? undefined}
                    onChange={(v) => input.onChange(v)}
                    onBlur={input.onBlur}
                    min={1}
                    allowDecimal={false}
                  />
                )}
              </Field>

              <Field<ShoppingItemFormValues['unit']> name="unit">
                {({ input }) => (
                  <Select
                    label="Единица измерения"
                    value={input.value}
                    onChange={(v) => input.onChange(v as ShoppingItemUnitType | null)}
                    data={unitOptions}
                  />
                )}
              </Field>

              <Field<ShoppingItemFormValues['category']> name="category">
                {({ input }) => (
                  <Select
                    label="Категория"
                    placeholder="Выберите категорию"
                    value={input.value}
                    onChange={input.onChange}
                    data={categoryOptions}
                    clearable
                  />
                )}
              </Field>

              <Button type="submit" loading={isLoading}>
                {submitLabel}
              </Button>
            </Stack>
          </form>
        )
      }}
    />
  )
}

export default ShoppingItemForm
