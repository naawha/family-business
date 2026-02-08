import type { ReactElement } from 'react'
import { AppInitialProps } from 'next/app'
import { GetServerSidePropsContext } from 'next/types'
import {
  createWrapper,
  generateServerSideResolverWrapper,
  ReduxWrapperConfig,
  ServiceConfigType,
} from '@naawha/next-rtk-wrapper'
import MainService from './service'
import { makeStore } from './store'
import { _getIsProtectedUrl } from '@/shared/helpers/UrlHelper'

export const wrapper = createWrapper(makeStore)

export const AppWrapper = ({
  children,
  ...rest
}: AppInitialProps & {
  children: (args: { store: ReturnType<typeof makeStore>; props: AppInitialProps }) => ReactElement
}): ReactElement => {
  const { store, props } = wrapper.useWrappedStore(rest)
  return children({ store, props: props as AppInitialProps })
}

const SERVICE_CONFIG: ServiceConfigType = {
  authenticated: {
    service: MainService,
    isAnonymous: false,
  },
  general: {
    service: MainService,
    isAnonymous: true,
  },
}

const DEFAULT_CONFIG: ReduxWrapperConfig<GetServerSidePropsContext> = {
  general: [],
  authenticated: [['familiesList']],
}

export const serverSideDataResolverWrapper = generateServerSideResolverWrapper({
  wrapper,
  getUserState: async (_ctx, dispatch) => {
    let isAuthenticated = false
    let userState: unknown = undefined

    try {
      userState = await dispatch((MainService as any).endpoints.getMe.initiate()).unwrap()
      isAuthenticated = true
    } catch (e) {
      console.error('Error getting user state')
      console.error(e)
    }

    return { userState, isAuthenticated }
  },
  getIsProtectedPath: _getIsProtectedUrl,
  serviceConfig: SERVICE_CONFIG,
  defaultConfig: DEFAULT_CONFIG,
})
