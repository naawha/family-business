import {
  SHOPPING_ITEM_UNIT,
  ShoppingItemType,
  type ShoppingItemUnitType,
} from '@family-business/types/entities'

const VALID_UNITS: ShoppingItemUnitType[] = ['шт', 'г', 'кг', 'л', 'мл']

export interface ParsedShoppingInput {
  name: string
  quantity?: number
  unit?: ShoppingItemUnitType
}

export const parseShoppingInput = (value: string): ParsedShoppingInput => {
  const colonIndex = value.indexOf(':')
  if (colonIndex !== -1) {
    const name = value.substring(0, colonIndex).trim()
    const afterColon = value.substring(colonIndex + 1).trim()

    // Парсим количество и единицу измерения
    // Формат: "количество unit" или "количествоunit" или просто "количество"
    const quantityMatch = afterColon.match(/^(\d+)/)
    if (quantityMatch) {
      const quantity = parseInt(quantityMatch[1], 10)
      const afterQuantity = afterColon.substring(quantityMatch[1].length).trim()

      if (quantity > 0) {
        if (afterQuantity) {
          for (const unit of VALID_UNITS) {
            if (afterQuantity.toLowerCase().startsWith(unit.toLowerCase())) {
              return { name, quantity, unit }
            }
          }
        }
        // Если единицы нет или она невалидна, используем "шт" по умолчанию
        return { name, quantity, unit: SHOPPING_ITEM_UNIT.PIECE }
      }
    }

    return { name: value.trim() }
  }

  return { name: value.trim() }
}

export const formatShoppingItemToString = (item: ShoppingItemType): string => {
  if (item.quantity) {
    const unit = item.unit || 'шт'
    return `${item.name}:${item.quantity} ${unit}`
  }
  return item.name
}
