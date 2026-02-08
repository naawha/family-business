import { FC, useEffect, useRef } from 'react'
import { Form, Field } from 'react-final-form'
import type { FormApi } from 'final-form'
import { TextInput, Select, Button, Stack, Checkbox } from '@mantine/core'
import { MarkdownField } from '@/shared/ui'
import { useFamily } from '@/models/accounts'

export type TodoFormValues = {
  title: string
  description: string
  isImportant: boolean
  assignedToId: string | null
}

interface TodoFormProps {
  initialValues?: TodoFormValues
  opened?: boolean
  onSubmit: (values: TodoFormValues) => void | Promise<void>
  isLoading?: boolean
  submitLabel: string
  resetOnSuccess?: boolean
}

const assigneeOptions = (members: { userId: string; user?: { name?: string; email?: string } }[]) =>
  (members ?? []).map((m) => ({
    value: m.userId,
    label: m.user?.name ?? m.user?.email ?? 'Без имени',
  }))

const defaultValues: TodoFormValues = {
  title: '',
  description: '',
  isImportant: false,
  assignedToId: null,
}

const validate = (values: Partial<TodoFormValues>) => {
  const errors: Partial<Record<keyof TodoFormValues, string>> = {}
  if (!values.title?.trim()) errors.title = 'Обязательное поле'
  return errors
}

const EditSync: FC<{
  form: FormApi<TodoFormValues>
  opened?: boolean
  initialValues?: TodoFormValues
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

const TodoForm: FC<TodoFormProps> = ({
  initialValues,
  opened,
  onSubmit,
  isLoading = false,
  submitLabel,
  resetOnSuccess = false,
}) => {
  const { family } = useFamily()
  const assigneeData = assigneeOptions(family?.members ?? [])
  const formApiRef = useRef<FormApi<TodoFormValues> | null>(null)

  const formInitialValues = initialValues ?? defaultValues

  const handleSubmit = async (values: TodoFormValues) => {
    await onSubmit(values)
    if (resetOnSuccess && formApiRef.current) {
      formApiRef.current.restart(defaultValues)
    }
  }

  return (
    <Form<TodoFormValues>
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
              <Field<TodoFormValues['title']> name="title">
                {({ input, meta }) => (
                  <TextInput
                    label="Название"
                    placeholder="Название задачи"
                    value={input.value}
                    onChange={(e) => input.onChange(e.target.value)}
                    onBlur={input.onBlur}
                    error={meta.touched && meta.error}
                    required
                  />
                )}
              </Field>

              <Field<TodoFormValues['description']> name="description">
                {({ input, meta }) => (
                  <MarkdownField
                    label="Описание"
                    placeholder="Опциональное описание (поддерживается Markdown)"
                    value={input.value}
                    onChange={input.onChange}
                    onBlur={input.onBlur}
                    error={meta.touched && meta.error}
                  />
                )}
              </Field>

              <Field<TodoFormValues['isImportant']> name="isImportant" type="checkbox">
                {({ input }) => (
                  <Checkbox
                    label="Важная"
                    checked={input.value}
                    onChange={(e) => input.onChange(e.currentTarget.checked)}
                  />
                )}
              </Field>

              <Field<TodoFormValues['assignedToId']> name="assignedToId">
                {({ input }) => (
                  <Select
                    label="Назначить на"
                    placeholder="Не назначено"
                    value={input.value}
                    onChange={input.onChange}
                    data={assigneeData}
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

export default TodoForm
