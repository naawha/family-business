export const RTK_TAGS = {
  User: 'User',
  Family: 'Family',
  Todo: 'Todo',
  Invite: 'Invite',
  ShoppingItem: 'ShoppingItem',
  PlannedPurchase: 'PlannedPurchase',
  Recipe: 'Recipe',
} as const

export type RtkTagType = (typeof RTK_TAGS)[keyof typeof RTK_TAGS]
