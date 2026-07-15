import { FC, useCallback } from 'react'
import { type NoteType } from '@family-business/types/entities'
import { useNotes, useDeleteNoteMutation } from '@/models/notes'
import { EditNoteModal, ViewNoteDrawer } from '@/features/notes'
import { BaseList } from '@/shared/ui'
import NoteListItem from '../NoteListItem'

interface NoteListProps {}

const NoteList: FC<NoteListProps> = () => {
  const { notes, refetch } = useNotes()
  const [deleteItem] = useDeleteNoteMutation()

  const handleDeleteItem = useCallback(
    async (id: string) => {
      await deleteItem({ id }).unwrap()
    },
    [deleteItem],
  )

  const handleRefresh = useCallback(async () => {
    await refetch()
  }, [refetch])

  return (
    <BaseList<NoteType>
      items={notes ?? []}
      onRefresh={handleRefresh}
      getKey={(note) => note.id}
      emptyText="Заметок пока нет. Создайте первую!"
      renderItem={(note, { openView, openEdit }) => (
        <NoteListItem
          item={note}
          onView={() => openView(note)}
          onEdit={() => openEdit(note)}
          onDelete={handleDeleteItem}
        />
      )}
      renderViewOverlay={({ item, opened, onClose }) => (
        <ViewNoteDrawer opened={opened} note={item} onClose={onClose} />
      )}
      renderEditOverlay={({ item, opened, onClose }) => (
        <EditNoteModal opened={opened} item={item} onClose={onClose} />
      )}
    />
  )
}

export default NoteList
