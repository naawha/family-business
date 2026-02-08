import DashboardShoppingView from '@/destinations/DashboardShoppingView'
import { ReduxWrapperConfig } from '@naawha/next-rtk-wrapper'
import { GetServerSidePropsContext } from 'next'
import { serverSideDataResolverWrapper } from '@/app/api/wrapper'

const DashboardShoppingPage = () => {
  return <DashboardShoppingView />
}

const resolverConfig = {
  general: [],
  authenticated: [['shoppingList']],
} as ReduxWrapperConfig<GetServerSidePropsContext>

export const getServerSideProps = serverSideDataResolverWrapper({
  config: resolverConfig,
})

export default DashboardShoppingPage
