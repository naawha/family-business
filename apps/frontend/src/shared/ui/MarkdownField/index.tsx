import { FC, useRef, useCallback } from 'react'
import { Text, Textarea, ActionIcon, Group } from '@mantine/core'
import {
  IconBold,
  IconItalic,
  IconList,
  IconListNumbers,
  IconHeading,
} from '@tabler/icons-react'
import type { TextareaProps } from '@mantine/core'

const insertMarkdown = (
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
): { newValue: string; newStart: number; newEnd: number } => {
  const selected = value.slice(start, end)
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end)
  return {
    newValue,
    newStart: start + before.length,
    newEnd: start + before.length + selected.length,
  }
}

const insertAtLineStart = (
  value: string,
  start: number,
  prefix: string,
): { newValue: string; newStart: number; newEnd: number } => {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart)
  const newStart = lineStart + prefix.length
  return { newValue, newStart, newEnd: newStart }
}

export interface MarkdownFieldProps extends Omit<TextareaProps, 'value' | 'onChange'> {
  value: string
  onChange: (value: string) => void
}

const MarkdownField: FC<MarkdownFieldProps> = ({
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  minRows = 5,
  error,
  required,
  disabled,
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const applyMarkdown = useCallback(
    (before: string, after: string, orLinePrefix?: string) => {
      const ta = textareaRef.current
      if (!ta) return
      const start = ta.selectionStart
      const end = ta.selectionEnd
      let result: { newValue: string; newStart: number; newEnd: number }
      if (orLinePrefix && start === end) {
        result = insertAtLineStart(value, start, orLinePrefix)
      } else {
        result = insertMarkdown(value, start, end, before, after)
      }
      onChange(result.newValue)
      requestAnimationFrame(() => {
        ta.focus()
        ta.setSelectionRange(result.newStart, result.newEnd)
      })
    },
    [value, onChange],
  )

  return (
    <div>
      {label != null && (
        <Text size="sm" fw={500} mb={5} component="label" required={required}>
          {label}
        </Text>
      )}
      <Group gap={4} mb="xs">
        <ActionIcon
          type="button"
          variant="subtle"
          size="sm"
          onClick={() => applyMarkdown('**', '**')}
          aria-label="Жирный"
          title="Жирный (**)"
          disabled={disabled}
        >
          <IconBold size={16} />
        </ActionIcon>
        <ActionIcon
          type="button"
          variant="subtle"
          size="sm"
          onClick={() => applyMarkdown('*', '*')}
          aria-label="Курсив"
          title="Курсив (*)"
          disabled={disabled}
        >
          <IconItalic size={16} />
        </ActionIcon>
        <ActionIcon
          type="button"
          variant="subtle"
          size="sm"
          onClick={() => applyMarkdown('', '', '## ')}
          aria-label="Заголовок"
          title="Заголовок (##)"
          disabled={disabled}
        >
          <IconHeading size={16} />
        </ActionIcon>
        <ActionIcon
          type="button"
          variant="subtle"
          size="sm"
          onClick={() => applyMarkdown('', '', '- ')}
          aria-label="Маркированный список"
          title="Маркированный список (-)"
          disabled={disabled}
        >
          <IconList size={16} />
        </ActionIcon>
        <ActionIcon
          type="button"
          variant="subtle"
          size="sm"
          onClick={() => applyMarkdown('', '', '1. ')}
          aria-label="Нумерованный список"
          title="Нумерованный список (1.)"
          disabled={disabled}
        >
          <IconListNumbers size={16} />
        </ActionIcon>
      </Group>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        autosize
        minRows={minRows}
        error={error}
        required={required}
        disabled={disabled}
        {...rest}
      />
    </div>
  )
}

export default MarkdownField
