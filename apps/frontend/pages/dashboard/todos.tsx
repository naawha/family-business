import DashboardTodosView from '@/destinations/DashboardTodosView'
import { ReduxWrapperConfig } from '@naawha/next-rtk-wrapper'
import { GetServerSidePropsContext } from 'next'
import { serverSideDataResolverWrapper } from '@/app/api/wrapper'

const DashboardTodosPage = () => {
  return <DashboardTodosView />
}

const resolverConfig = {
  general: [],
  authenticated: [['todoList']],
} as ReduxWrapperConfig<GetServerSidePropsContext>

export const getServerSideProps = serverSideDataResolverWrapper({
  config: resolverConfig,
})

export default DashboardTodosPage
