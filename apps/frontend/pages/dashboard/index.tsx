import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ReduxWrapperConfig } from '@naawha/next-rtk-wrapper'
import { GetServerSidePropsContext } from 'next'
import { serverSideDataResolverWrapper } from '@/app/api/wrapper'

const DashboardPage = () => {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard/todos')
  }, [router])
  return null
}

const resolverConfig = {
  general: [],
  authenticated: [],
} as ReduxWrapperConfig<GetServerSidePropsContext>

export const getServerSideProps = serverSideDataResolverWrapper({
  config: resolverConfig,
})

export default DashboardPage
