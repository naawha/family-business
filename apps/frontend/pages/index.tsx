import { serverSideDataResolverWrapper } from '@/app/api/wrapper'
import IndexView from '@/destinations/IndexView/index'

const IndexPage = () => {
  return <IndexView />
}

export const getServerSideProps = serverSideDataResolverWrapper({
  config: {
    general: [],
    authenticated: [],
  },
  // @ts-expect-error - TODO: fix this
  onBeforeExecuteQueries: async (ctx, dispatch, userState) => {
    if (userState) {
      return {
        redirect: {
          destination: '/dashboard/shopping',
          permanent: false,
        },
      }
    }
  },
})

export default IndexPage
