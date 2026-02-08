import { useMemo } from 'react'
import type { TodoType } from '@family-business/types/entities'
import { useGetMeQuery } from '@/models/accounts'
import { useTodoListQuery } from '../api'

const sortTodos = (todos: TodoType[], currentUserId: string | undefined): TodoType[] => {
  return [...todos].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const aMine = a.assignedToId === currentUserId ? 0 : 1
    const bMine = b.assignedToId === currentUserId ? 0 : 1
    if (aMine !== bMine) return aMine - bMine
    if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1
    return 0
  })
}

const useTodos = () => {
  const { data: todos = [], isLoading, refetch } = useTodoListQuery()
  const { data: me } = useGetMeQuery()
  const sorted: TodoType[] = useMemo(() => sortTodos(todos, me?.id), [todos, me?.id])

  return { todos: sorted, isLoading, refetch }
}

export default useTodos
