// Генерация цвета из имени (детерминированная)
export const getColorFromName = (name: string): string => {
  const colors = [
    '#FF6B6B', // Красный
    '#4ECDC4', // Бирюзовый
    '#45B7D1', // Голубой
    '#FFA07A', // Лососевый
    '#98D8C8', // Мятный
    '#F7DC6F', // Желтый
    '#BB8FCE', // Фиолетовый
    '#85C1E2', // Светло-голубой
    '#F8B739', // Оранжевый
    '#52BE80', // Зеленый
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// Получение инициалов из имени
export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}
