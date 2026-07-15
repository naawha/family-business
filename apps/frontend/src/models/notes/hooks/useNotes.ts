import type { NoteType } from '@family-business/types/entities'
import { useNotesListQuery } from '../api'

const useNotes = () => {
  const { data: notes = [], isLoading, refetch } = useNotesListQuery()

  return { notes: notes as NoteType[], isLoading, refetch }
}

export default useNotes
