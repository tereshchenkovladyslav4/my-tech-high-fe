import { useQuery } from '@apollo/client'
import { Avatar, Box, Button } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { AdminAppBar } from '../components/AdminAppBar/AdminAppBar'
import { AppBar } from '../components/AppBar/AppBar'
import { Flexbox } from '../components/Flexbox/Flexbox'
import { MasqueradeFooter } from '../components/MasqueradeFooter/MasqueradeFooter'
import { AdminSideMenu } from '../components/SideMenu/AdminSideMenu'
import { SideMenu } from '../components/SideMenu/SideMenu'
import { Paragraph } from '../components/Typography/Paragraph/Paragraph'
import { TabContext, UserContext } from '../providers/UserContext/UserProvider'
import { AdminRoutes } from '../router/AdminRoutes'
import { Routes } from '../router/Routes'
import { UnauthenticatedRoutes } from '../router/UnauthenticatedRoutes'
import { Person } from '../screens/HomeroomStudentProfile/Student/types'
import { LoadingScreen } from '../screens/LoadingScreen/LoadingScreen'
import { getMeQuery } from './services'

export const Root = () => {
  const { me, setMe } = useContext(UserContext)
  const { setTab, setVisitedTabs } = useContext(TabContext)
  const { loading, error, data } = useQuery(getMeQuery, { skip: me ? true : false})
  const [isSuper, setIsSuper] = useState(null)
  
  useEffect(() => {
    if (!loading && me === null && data !== undefined) {
      setTab({
        currentTab: 0,
      })
      setMe(data.me)
      setVisitedTabs([])
      setIsSuper(Number(data.me?.level) === 1)
    }
  }, [loading])

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  return loading && !me ?  (
    <LoadingScreen />
  ) : me !== null ? (
    !isSuper ? (
      <Flexbox flexDirection='column'>
        <Flexbox flexDirection='column'>
          <SideMenu />
          <Flexbox flexDirection='row'>
            <div style={{ marginLeft: '260px' }}>
              {me?.level === 2 ? <AdminAppBar /> : <AppBar />}
              <Routes />
            </div>
          </Flexbox>
        </Flexbox>
        { localStorage.getItem('masquerade') !== null && <MasqueradeFooter me={me}/>}
      </Flexbox>
    ) : (
      <Flexbox flexDirection='row'>
        <AdminSideMenu />
        <Flexbox flexDirection='column'>
          <div style={{ marginLeft: '260px' }}>
            <AdminAppBar />
            <AdminRoutes />
          </div>
        </Flexbox>
      </Flexbox>
    )
  ) : (
    <UnauthenticatedRoutes />
  )
}
