import React, { useEffect, useState } from 'react'
import { CssBaseline } from '@mui/material'
import ThemeProvider from '@mui/system/ThemeProvider'
import { FlagProvider } from '@unleash/proxy-client-react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import WebFont from 'webfontloader'
import { theme } from '@mth/utils'
import { MthLoading } from './components/MthLoading/MthLoading'
import { UserLeaveConfirmation } from './components/UserLeaveConfirmation/UserLeaveConfirmation'
import { ApolloProvider } from './providers/ApolloProvider/ApolloProvider'
import { AuthProvider } from './providers/AuthProvider/AuthProvider'
import BackStackProvider from './providers/BackStackProvider/BackStackProvider'
import { ProfileProvider } from './providers/ProfileProvider/ProfileProvider'
import { TabContext, TabInfo, UserContext, UserInfo } from './providers/UserContext/UserProvider'
import { Root } from './root/Root'

//moment.tz.setDefault('MST')

declare global {
  interface ImportMeta {
    env: {
      MODE: string
      SNOWPACK_PUBLIC_API_URL: string
      SNOWPACK_PUBLIC_S3_URL: string
      SNOWPACK_PUBLIC_S3_UPLOAD: string
      SNOWPACK_PUBLIC_S3_STUDENT_RECORD_FILES_DOWNLOAD: string
      SNOWPACK_PUBLIC_COUNTIES_TEMPLATE: string
      SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE: string
      SNOWPACK_PUBLIC_BASE_S3_UPLOAD_URL: string
      SNOWPACK_PUBLIC_BASE_S3_IMAGE_URL: string
      SNOWPACK_PUBLIC_WEB_URL: string
      SNOWPACK_PUBLIC_FEATURE_FLAG_URL: string
      SNOWPACK_PUBLIC_FEATURE_FLAG_CLIENT_KEY: string
      SNOWPACK_PUBLIC_FEATURE_FLAG_APP_NAME: string
      SNOWPACK_PUBLIC_FEATURE_FLAG_ENV: string
      SNOWPACK_PUBLIC_APP_STAGE: string
    }
  }
}

export const App: React.FC = () => {
  const [me, setMe] = useState<UserInfo | null>(null)
  const [tab, setTab] = useState<TabInfo | null>(null)
  const [visitedTabs, setVisitedTabs] = useState<number[] | null>([])
  // const [confirmOpen, setConfirmOpen] = useState(true);
  const userContext = React.useMemo(
    () => ({
      me,
      setMe,
    }),
    [me],
  )

  const tabContext = React.useMemo(
    () => ({
      tab,
      setTab,
      visitedTabs,
      setVisitedTabs,
    }),
    [tab, visitedTabs],
  )

  const featureFlagConfig = {
    url: import.meta.env.SNOWPACK_PUBLIC_FEATURE_FLAG_URL, // or https://UNLEASH_HOSTNAME/api/frontend
    clientKey: import.meta.env.SNOWPACK_PUBLIC_FEATURE_FLAG_CLIENT_KEY,
    refreshInterval: 15,
    appName: import.meta.env.SNOWPACK_PUBLIC_FEATURE_FLAG_APP_NAME,
    environment: import.meta.env.SNOWPACK_PUBLIC_FEATURE_FLAG_ENV,
  }

  useEffect(() => {
    WebFont.load({
      custom: {
        families: ['VisbyCF'],
        urls: ['/src/fonts.css'],
      },
    })
  }, [])
  return (
    <FlagProvider config={featureFlagConfig}>
      <Router
        getUserConfirmation={(message, callback) => {
          return UserLeaveConfirmation(
            message,
            callback,
            // confirmOpen,
            // setConfirmOpen
          )
        }}
      >
        <BackStackProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <ApolloProvider>
                <UserContext.Provider value={userContext}>
                  <TabContext.Provider value={tabContext}>
                    <ProfileProvider>
                      <CssBaseline />
                      <RecoilRoot>
                        <Root />
                        <MthLoading />
                      </RecoilRoot>
                    </ProfileProvider>
                  </TabContext.Provider>
                </UserContext.Provider>
              </ApolloProvider>
            </AuthProvider>
          </ThemeProvider>
        </BackStackProvider>
      </Router>
    </FlagProvider>
  )
}
