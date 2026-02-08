import type {
  RecipeIngredientType,
  RecipeIngredientUnitType,
  ShoppingItemType,
} from '@family-business/types/entities'
import { RECIPE_INGREDIENT_UNIT } from '@family-business/types/entities'

const RECIPE_UNITS = Object.values(RECIPE_INGREDIENT_UNIT) as RecipeIngredientUnitType[]

export type ParsedIngredient = {
  name: string
  quantity: number
  unit?: RecipeIngredientUnitType
  notes?: string
}

export function parseIngredientLine(line: string): ParsedIngredient | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  let notes: string | undefined
  let rest = trimmed
  const notesMatch = trimmed.match(/\s*\(([^)]+)\)\s*$/)
  if (notesMatch) {
    notes = notesMatch[1].trim()
    rest = trimmed.slice(0, notesMatch.index).trim()
  }

  const colonIndex = rest.indexOf(':')
  if (colonIndex === -1) {
    return { name: rest, quantity: 1, unit: RECIPE_INGREDIENT_UNIT.PIECE, notes }
  }

  const name = rest.substring(0, colonIndex).trim()
  const afterColon = rest.substring(colonIndex + 1).trim()
  if (!name) return null

  const quantityMatch = afterColon.match(/^(\d+(?:[.,]\d+)?)/)
  if (!quantityMatch) {
    return { name, quantity: 1, unit: RECIPE_INGREDIENT_UNIT.PIECE, notes }
  }

  const quantity = parseFloat(quantityMatch[1].replace(',', '.')) || 0
  const afterQuantity = afterColon.substring(quantityMatch[0].length).trim()

  let unit: RecipeIngredientUnitType | undefined
  if (afterQuantity) {
    const lower = afterQuantity.toLowerCase()
    for (const u of RECIPE_UNITS) {
      if (lower.startsWith(u.toLowerCase())) {
        unit = u
        break
      }
    }
    if (!unit) unit = RECIPE_INGREDIENT_UNIT.PIECE
  } else {
    unit = quantity > 0 ? RECIPE_INGREDIENT_UNIT.PIECE : undefined
  }

  return { name, quantity, unit, notes }
}

export function formatIngredientLine(ing: {
  name: string
  quantity: number
  unit?: RecipeIngredientUnitType
  notes?: string
}): string {
  const parts: string[] = []
  if (ing.quantity > 0 && ing.unit) {
    parts.push(`${ing.name}: ${ing.quantity} ${ing.unit}`)
  } else if (ing.quantity > 0) {
    parts.push(`${ing.name}: ${ing.quantity}`)
  } else {
    parts.push(ing.name)
  }
  if (ing.notes?.trim()) parts.push(` (${ing.notes.trim()})`)
  return parts.join('')
}

export function normalizeIngredientName(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, ' ')
}

export function checkIngredientAvailability(
  ingredient: RecipeIngredientType,
  shoppingList: ShoppingItemType[] | undefined,
): { isAvailable: boolean; matchingItem?: ShoppingItemType } {
  const list = shoppingList ?? []
  const normalizedIngredientName = normalizeIngredientName(ingredient.name)

  const matchingItem = list.find((item) => {
    const normalizedItemName = normalizeIngredientName(item.name)
    return normalizedItemName === normalizedIngredientName && !item.purchased
  })

  return {
    isAvailable: !!matchingItem,
    matchingItem,
  }
}
