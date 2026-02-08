import type { RecipeIngredientType } from '@family-business/types/entities'

export function scaleIngredientQuantity(
  ingredient: RecipeIngredientType,
  scaleFactor: number,
): { quantity: number; unit?: string } {
  const scaledQuantity = ingredient.quantity * scaleFactor
  const roundedQuantity = Math.round(scaledQuantity * 100) / 100

  return {
    quantity: roundedQuantity,
    unit: ingredient.unit,
  }
}

export function calculateScaledIngredients(
  ingredients: RecipeIngredientType[],
  scaleFactor: number,
): Array<RecipeIngredientType & { scaledQuantity: number }> {
  return ingredients.map((ingredient) => ({
    ...ingredient,
    scaledQuantity: scaleIngredientQuantity(ingredient, scaleFactor).quantity,
  }))
}

