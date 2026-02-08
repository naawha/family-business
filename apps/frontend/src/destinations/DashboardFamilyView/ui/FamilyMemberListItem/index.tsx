import { useFamily, useGetMeQuery } from '@/models/accounts'
import { Avatar, BaseListItem } from '@/shared/ui'
import { FamilyMemberType } from '@family-business/types/entities'
import { Badge } from '@mantine/core'
import { FC } from 'react'

interface FamilyMemberListItemProps {
  member: FamilyMemberType
  onEdit: (itemId: string) => void
  onDelete: (itemId: string) => Promise<void>
}

const FamilyMemberListItem: FC<FamilyMemberListItemProps> = ({ member, onEdit, onDelete }) => {
  const { isAdmin } = useFamily()
  const { data: currentUser } = useGetMeQuery()
  const isCurrentUser = member.user?.id === currentUser?.id
  const name = `${member.user?.name ?? 'Неизвестный'}${isCurrentUser ? ' (Вы)' : ''}`

  const isAdminMember = member.role === 'admin'
  const canEdit = currentUser?.id === member.userId
  const canDelete = isAdmin && !isCurrentUser && !isAdminMember
  return (
    <BaseListItem
      itemId={member.id}
      leftExtra={member.user && <Avatar user={member.user} size={40} />}
      name={name}
      nameAddon={
        member.role === 'admin' && (
          <Badge color="blue" variant="light" size="sm">
            Администратор
          </Badge>
        )
      }
      description={member.user?.email}
      onEdit={canEdit ? onEdit : undefined}
      onDelete={canDelete ? onDelete : undefined}
      deleteConfirmMessage={canDelete ? 'Удалить участника из семьи?' : undefined}
    />
  )
}

export default FamilyMemberListItem
