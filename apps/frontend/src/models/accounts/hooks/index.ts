import { useFamiliesListQuery, useGetMeQuery } from '../api/accountsService'

export const useFamily = () => {
  const { data: myFamilies = [], isLoading, refetch } = useFamiliesListQuery()
  const { data: user } = useGetMeQuery()

  const family = myFamilies?.length ? myFamilies[0] : null

  return {
    family,
    isAdmin: family?.members?.some(
      (member) => member.userId === user?.id && member.role === 'admin',
    ),
    isLoading,
    refetch,
  }
}
