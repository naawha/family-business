import { FC, useEffect, useRef } from 'react'
import { Form, Field } from 'react-final-form'
import type { FormApi } from 'final-form'
import { TextInput, Button, Stack } from '@mantine/core'
import { MarkdownField } from '@/shared/ui'

export type NoteFormValues = {
  title: string
  body: string
}

interface NoteFormProps {
  initialValues?: NoteFormValues
  opened?: boolean
  onSubmit: (values: NoteFormValues) => void | Promise<void>
  isLoading?: boolean
  submitLabel: string
  resetOnSuccess?: boolean
}

const defaultValues: NoteFormValues = {
  title: '',
  body: '',
}

const validate = (values: Partial<NoteFormValues>) => {
  const errors: Partial<Record<keyof NoteFormValues, string>> = {}
  if (!values.title?.trim()) errors.title = 'Обязательное поле'
  return errors
}

const EditSync: FC<{
  form: FormApi<NoteFormValues>
  opened?: boolean
  initialValues?: NoteFormValues
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

const NoteForm: FC<NoteFormProps> = ({
  initialValues,
  opened,
  onSubmit,
  isLoading = false,
  submitLabel,
  resetOnSuccess = false,
}) => {
  const formApiRef = useRef<FormApi<NoteFormValues> | null>(null)
  const formInitialValues = initialValues ?? defaultValues

  const handleSubmit = async (values: NoteFormValues) => {
    await onSubmit(values)
    if (resetOnSuccess && formApiRef.current) {
      formApiRef.current.restart(defaultValues)
    }
  }

  return (
    <Form<NoteFormValues>
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
              <Field<NoteFormValues['title']> name="title">
                {({ input, meta }) => (
                  <TextInput
                    label="Заголовок"
                    placeholder="Название заметки"
                    value={input.value}
                    onChange={(e) => input.onChange(e.target.value)}
                    onBlur={input.onBlur}
                    error={meta.touched && meta.error}
                    required
                  />
                )}
              </Field>

              <Field<NoteFormValues['body']> name="body">
                {({ input, meta }) => (
                  <MarkdownField
                    label="Текст"
                    placeholder="Текст заметки (поддерживается Markdown)"
                    value={input.value}
                    onChange={input.onChange}
                    onBlur={input.onBlur}
                    error={meta.touched && meta.error}
                    minRows={8}
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

export default NoteForm
