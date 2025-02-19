import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Box } from '@mui/material'
import { useFlag } from '@unleash/proxy-client-react'
import { TeacherSideMenu } from '@mth/components/SideMenu/TeacherSideMenu'
import { TeacherAppBar } from '@mth/components/TeacherAppBar/TeacherAppBar'
import { EPIC_1699 } from '@mth/constants'
import { RoleLevel } from '@mth/enums'
import { AdminAppBar } from '../components/AdminAppBar/AdminAppBar'
import { AppBar } from '../components/AppBar/AppBar'
import { Flexbox } from '../components/Flexbox/Flexbox'
import { MasqueradeFooter } from '../components/MasqueradeFooter/MasqueradeFooter'
import { AdminSideMenu } from '../components/SideMenu/AdminSideMenu'
import { SideMenu } from '../components/SideMenu/SideMenu'
import { TabContext, UserContext } from '../providers/UserContext/UserProvider'
import { AdminRoutes } from '../router/AdminRoutes'
import { Routes } from '../router/Routes'
import { TeacherRoutes } from '../router/TeacherRoutes'
import { UnauthenticatedRoutes } from '../router/UnauthenticatedRoutes'
import { LoadingScreen } from '../screens/LoadingScreen/LoadingScreen'
import { getMeQuery } from './services'

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: '0',
    },
    marginLeft: '260px',
  },
}))

export const Root: React.FC = () => {
  const classes = useStyles()
  const { me, setMe } = useContext(UserContext)
  const { setTab, setVisitedTabs } = useContext(TabContext)
  const { loading, data } = useQuery(getMeQuery, { skip: me ? true : false })
  const [isSuper, setIsSuper] = useState(null)

  // MARK: Feature Flags
  const epic1699 = !useFlag(EPIC_1699)

  useEffect(() => {
    if (!loading && me === null && data !== undefined) {
      setTab({
        currentTab: 0,
      })

      //  Sort user regions by region name
      const regions = []
      data.me.userRegion.forEach((region) => {
        let i
        for (i = 0; i < regions.length; i++) {
          if (regions[i].regionDetail.name > region.regionDetail.name) break
        }
        regions.splice(i, 0, region)
      })
      //  Replace userRegion array with the sorted one.
      setMe({
        ...data.me,
        userRegion: regions,
      })
      setVisitedTabs([])
      setIsSuper(Number(data.me?.level) === 1)
    }
  }, [loading])
  return loading && !me ? (
    <LoadingScreen />
  ) : me !== null ? (
    !isSuper ? (
      <Box sx={{ height: '100%', flex: 1 }} alignItems={'center'}>
        {epic1699 && me.level === RoleLevel.TEACHER ? <TeacherSideMenu /> : <SideMenu />}
        <Box
          display='flex'
          flex={1}
          flexDirection={'column'}
          textAlign={'center'}
          justifyContent='space-between'
          height='100vh'
        >
          <div className={classes.content}>
            {me?.level === RoleLevel.ADMIN ? (
              <AdminAppBar />
            ) : epic1699 && me?.level === RoleLevel.TEACHER ? (
              <TeacherAppBar />
            ) : (
              <AppBar />
            )}
            <Box sx={{ marginTop: { xs: '65px', sm: 0 }, marginBottom: { xs: '15px', sm: 0 } }}>
              {epic1699 && me.level === RoleLevel.TEACHER ? <TeacherRoutes /> : <Routes />}
            </Box>
          </div>
          {localStorage.getItem('masquerade') !== null && <MasqueradeFooter me={me} />}
        </Box>
      </Box>
    ) : (
      <Flexbox flexDirection='row'>
        <AdminSideMenu />
        <Flexbox flexDirection='column'>
          <div style={{ marginLeft: '260px' }}>
            <AdminAppBar />
            <AdminRoutes />
          </div>
          {localStorage.getItem('masquerade') !== null && <MasqueradeFooter me={me} />}
        </Flexbox>
      </Flexbox>
    )
  ) : (
    <UnauthenticatedRoutes />
  )
}
