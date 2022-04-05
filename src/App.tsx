import React, { FunctionComponent, useEffect, useState } from 'react'
import ThemeProvider from '@mui/system/ThemeProvider'
import { theme } from './utils/theme'
import { CssBaseline } from '@mui/material'
import { BrowserRouter as Router } from 'react-router-dom'
import WebFont from 'webfontloader'
import { TabContext, TabInfo, UserContext, UserInfo } from './providers/UserContext/UserProvider'
import { Root } from './root/Root'
import { ApolloProvider } from './providers/ApolloProvider/ApolloProvider'
import { AuthProvider } from './providers/AuthProvider/AuthProvider'
import { ProfileProvider } from './providers/ProfileProvider/ProfileProvider'
import { RecoilRoot } from 'recoil'
import { UserLeaveConfirmation } from './components/UserLeaveConfirmation/UserLeaveConfirmation'

declare global {
  interface ImportMeta {
    env: {
      MODE: string
      API_URL: string
    }
  }
}

export const App: FunctionComponent = () => {
  const [me, setMe] = useState<UserInfo | null>(null)
  const [tab, setTab] = useState<TabInfo | null>(null)
  const [visitedTabs, setVisitedTabs] = useState<number[] | null>([])
  const [confirmOpen, setConfirmOpen] = useState(true)
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
        return UserLeaveConfirmation(message, callback, confirmOpen, setConfirmOpen)
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
