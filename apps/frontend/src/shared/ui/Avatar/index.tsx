import { FC } from 'react'
import { Avatar as MantineAvatar } from '@mantine/core'
import type { UserType } from '@family-business/types/entities'
import { getColorFromName, getInitials } from './utils'

interface AvatarProps {
  user: Pick<UserType, 'name' | 'avatarEmoji' | 'avatarColor'>
  size?: number | string
}

const Avatar: FC<AvatarProps> = ({ user, size = 40 }) => {
  const emoji = user.avatarEmoji
  const initials = getInitials(user.name)

  // Если есть эмодзи - показываем просто эмодзи
  if (emoji) {
    return (
      <div
        style={{
          width: typeof size === 'number' ? size : size,
          height: typeof size === 'number' ? size : size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: typeof size === 'number' ? size : '2rem',
          lineHeight: 1,
          backgroundColor: 'transparent',
        }}
      >
        {emoji}
      </div>
    )
  }

  // Если нет эмодзи - показываем инициалы на цветном фоне
  const backgroundColor = user.avatarColor || getColorFromName(user.name)
  return (
    <MantineAvatar size={size} radius="xl" color="white" style={{ backgroundColor }}>
      {initials}
    </MantineAvatar>
  )
}

export default Avatar
