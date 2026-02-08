import DashboardFamilyView from '@/destinations/DashboardFamilyView'
import { ReduxWrapperConfig } from '@naawha/next-rtk-wrapper'
import { GetServerSidePropsContext } from 'next'
import { serverSideDataResolverWrapper } from '@/app/api/wrapper'

const DashboardTodosPage = () => {
  return <DashboardFamilyView />
}

const resolverConfig = {
  general: [],
  authenticated: [],
} as ReduxWrapperConfig<GetServerSidePropsContext>

export const getServerSideProps = serverSideDataResolverWrapper({
  config: resolverConfig,
})

export default DashboardTodosPage
