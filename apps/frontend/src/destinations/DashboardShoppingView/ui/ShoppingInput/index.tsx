import { FC, useEffect, useRef, useRef as useMutableRef } from 'react'
import { Autocomplete } from '@mantine/core'

interface ShoppingInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (rawValue: string) => Promise<void> | void
  autoFocus?: boolean
}

// Список наиболее часто покупаемых товаров для автодополнения
const POPULAR_ITEMS = [
  'Молоко',
  'Хлеб',
  'Яйца',
  'Масло',
  'Сыр',
  'Йогурт',
  'Творог',
  'Сметана',
  'Кефир',
  'Курица',
  'Говядина',
  'Свинина',
  'Рыба',
  'Колбаса',
  'Сосиски',
  'Картофель',
  'Морковь',
  'Лук',
  'Помидоры',
  'Огурцы',
  'Капуста',
  'Бананы',
  'Яблоки',
  'Апельсины',
  'Мандарины',
  'Рис',
  'Гречка',
  'Макароны',
  'Мука',
  'Сахар',
  'Соль',
  'Масло подсолнечное',
  'Масло оливковое',
  'Чай',
  'Кофе',
  'Вода',
  'Сок',
  'Печенье',
  'Шоколад',
  'Конфеты',
  'Мыло',
  'Шампунь',
  'Зубная паста',
  'Туалетная бумага',
  'Стиральный порошок',
].sort()

const ShoppingInput: FC<ShoppingInputProps> = ({ value, onChange, onSubmit, autoFocus = false }) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const optionSelectedRef = useRef(false)

  // Фокус при первом рендере или когда явно включён autoFocus
  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      optionSelectedRef.current = false

      // Даем время onOptionSubmit сработать, если опция выбрана
      await new Promise((resolve) => setTimeout(resolve, 0))

      if (optionSelectedRef.current) {
        return
      }

      e.preventDefault()
      await onSubmit(value)
    }
  }

  const handleOptionSubmit = (nextValue: string) => {
    optionSelectedRef.current = true
    onChange(nextValue)

    // Ставим курсор в конец текста
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus()
        const length = nextValue.length
        inputRef.current.setSelectionRange(length, length)
      }
    }, 0)
  }

  return (
    <Autocomplete
      ref={inputRef}
      placeholder="Название товара (или название:количество единица, например: Молоко:1 л)"
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      onOptionSubmit={handleOptionSubmit}
      data={POPULAR_ITEMS}
      filter={({ options, search }) => {
        // Если есть двоеточие, фильтруем только по части до двоеточия
        const colonIndex = search.indexOf(':')
        const searchValue = colonIndex !== -1 ? search.substring(0, colonIndex).trim() : search.trim()
        return options.filter((option) =>
          // @ts-expect-error no types for @mantine/core
          option.label.toLowerCase().includes(searchValue.toLowerCase()),
        )
      }}
    />
  )
}

export default ShoppingInput

