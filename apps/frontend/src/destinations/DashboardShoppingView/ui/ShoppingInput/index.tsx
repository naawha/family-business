import { FC, useEffect, useRef } from 'react'
import { TextInput } from '@mantine/core'

interface ShoppingInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (rawValue: string) => Promise<void> | void
  autoFocus?: boolean
}

const ShoppingInput: FC<ShoppingInputProps> = ({
  value,
  onChange,
  onSubmit,
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Фокус при первом рендере или когда явно включён autoFocus
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault()
      await onSubmit(value)
    }
  }

  return (
    <TextInput
      ref={inputRef}
      placeholder="Название товара (или название:количество единица, например: Молоко:1 л)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}

export default ShoppingInput
