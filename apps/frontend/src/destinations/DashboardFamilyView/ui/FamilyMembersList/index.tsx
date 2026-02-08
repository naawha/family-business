import { FC, useCallback } from 'react'
import { BaseList } from '@/shared/ui'
import { FamilyMemberSettingsDrawer } from '@/features/family'
import { useFamily } from '@/models/accounts'
import type { FamilyMemberType } from '@family-business/types/entities'
import FamilyMemberListItem from '../FamilyMemberListItem'
import { useFamiliesRemoveMemberMutation } from '@/models/accounts'

const FamilyMembersList: FC = () => {
  const { family, refetch } = useFamily()
  const [removeMember] = useFamiliesRemoveMemberMutation()

  const members = family?.members ?? []
  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  const handleDeleteMember = useCallback(
    async (memberId: string) => {
      if (!family?.id) return
      await removeMember({ id: family.id, memberId }).unwrap()
    },
    [family?.id, removeMember],
  )

  return (
    <>
      <BaseList<FamilyMemberType>
        items={members}
        getKey={(m) => m.id}
        emptyText="Участников пока нет"
        onRefresh={handleRefresh}
        renderItem={(member, { openEdit }) => (
          <FamilyMemberListItem
            member={member}
            onEdit={() => openEdit(member)}
            onDelete={handleDeleteMember}
          />
        )}
        renderEditOverlay={({ item, opened, onClose }) => (
          <FamilyMemberSettingsDrawer opened={opened} onClose={onClose} member={item} />
        )}
      />
    </>
  )
}

export default FamilyMembersList
