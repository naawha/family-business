import DashboardNotesView from '@/destinations/DashboardNotesView'
import { ReduxWrapperConfig } from '@naawha/next-rtk-wrapper'
import { GetServerSidePropsContext } from 'next'
import { serverSideDataResolverWrapper } from '@/app/api/wrapper'

const DashboardNotesPage = () => {
  return <DashboardNotesView />
}

const resolverConfig = {
  general: [],
  authenticated: [['notesList']],
} as ReduxWrapperConfig<GetServerSidePropsContext>

export const getServerSideProps = serverSideDataResolverWrapper({
  config: resolverConfig,
})

export default DashboardNotesPage
