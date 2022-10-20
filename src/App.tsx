import React, { useEffect, useState } from 'react'
import { CssBaseline } from '@mui/material'
import ThemeProvider from '@mui/system/ThemeProvider'
import moment from 'moment-timezone'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import WebFont from 'webfontloader'
import { MthLoading } from './components/MthLoading/MthLoading'
import { UserLeaveConfirmation } from './components/UserLeaveConfirmation/UserLeaveConfirmation'
import { ApolloProvider } from './providers/ApolloProvider/ApolloProvider'
import { AuthProvider } from './providers/AuthProvider/AuthProvider'
import { ProfileProvider } from './providers/ProfileProvider/ProfileProvider'
import { TabContext, TabInfo, UserContext, UserInfo } from './providers/UserContext/UserProvider'
import { Root } from './root/Root'
import { theme } from './utils/theme'
moment.tz.setDefault('MST')

declare global {
  interface ImportMeta {
    env: {
      MODE: string
      API_URL: string
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

  useEffect(() => {
    WebFont.load({
      custom: {
        families: ['VisbyCF'],
        urls: ['/src/fonts.css'],
      },
    })
  }, [])

  return (
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
    </Router>
  )
}
