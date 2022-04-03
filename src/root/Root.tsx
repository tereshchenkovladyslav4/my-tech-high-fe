import { useQuery } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import { AdminAppBar } from '../components/AdminAppBar/AdminAppBar'
import { AppBar } from '../components/AppBar/AppBar'
import { Flexbox } from '../components/Flexbox/Flexbox'
import { AdminSideMenu } from '../components/SideMenu/AdminSideMenu'
import { SideMenu } from '../components/SideMenu/SideMenu'
import { TabContext, UserContext } from '../providers/UserContext/UserProvider'
import { AdminRoutes } from '../router/AdminRoutes'
import { Routes } from '../router/Routes'
import { UnauthenticatedRoutes } from '../router/UnauthenticatedRoutes'
import { LoadingScreen } from '../screens/LoadingScreen/LoadingScreen'
import { getMeQuery } from './services'

export const Root = () => {
  const { me, setMe } = useContext(UserContext)
  const { setTab, setVisitedTabs } = useContext(TabContext)
  const { loading, error, data } = useQuery(getMeQuery)
  const [isSuper, setIsSuper] = useState(null);

  useEffect(() => {
    if (!loading && me === null && data !== undefined) {
      setTab({
        currentTab: 0
      });
      setMe(data.me);
      setVisitedTabs([])
      setIsSuper(Number(data.me?.level) === 1)
    }
  }, [loading])

  return loading ? (
    <LoadingScreen />
  ) : me !== null ? (
    !isSuper
      ? <Flexbox flexDirection='row'>
        <SideMenu />
        <Flexbox flexDirection='column'>
          <div style={{marginLeft: '260px'}}>
            {me?.level === 2 ? <AdminAppBar /> : <AppBar />}
            <Routes />
          </div>
        </Flexbox>
      </Flexbox>
      : <Flexbox flexDirection='row'>
        <AdminSideMenu />
        <Flexbox flexDirection='column'>
          <div style={{marginLeft: '260px'}}>
            <AdminAppBar />
            <AdminRoutes />
          </div>
        </Flexbox>
      </Flexbox>
  ) : (
    <UnauthenticatedRoutes />
  )
}
