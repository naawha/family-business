import DashboardRecipesView from '@/destinations/DashboardRecipesView'
import { ReduxWrapperConfig } from '@naawha/next-rtk-wrapper'
import { GetServerSidePropsContext } from 'next'
import { serverSideDataResolverWrapper } from '@/app/api/wrapper'

const DashboardRecipesPage = () => {
  return <DashboardRecipesView />
}

const resolverConfig = {
  general: [],
  authenticated: [['recipesList']],
} as ReduxWrapperConfig<GetServerSidePropsContext>

export const getServerSideProps = serverSideDataResolverWrapper({
  config: resolverConfig,
})

export default DashboardRecipesPage
