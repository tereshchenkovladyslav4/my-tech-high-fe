import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import DatRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import DescriptionIcon from '@mui/icons-material/Description'
import LogoutIcon from '@mui/icons-material/Logout'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { List, ListItem, Box, ListItemButton } from '@mui/material'
import { map, some } from 'lodash'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import { AuthContext } from '../../providers/AuthProvider/AuthContext'
import { UserContext } from '../../providers/UserContext/UserProvider'
import {
  ACTIVELINKBACKGROUND,
  COMMUNICATION,
  CALENDAR,
  CURRICULUM,
  DASHBOARD,
  ENROLLMENT,
  HOMEROOM,
  PARENT_LINK,
  RECORDS,
  REIMBURSMENTS,
  REPORTS,
  SETTINGS,
  USERS,
} from '../../utils/constants'
import { MTHLogo } from '../SVG/MTHLogo'
import { TTALogo } from '../SVG/TTALogo'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { useStyles } from './styles'

const noSidebarUsers = [15, 14, 16, 11, 9, 10, 13, 12]

export const SideMenu: FunctionComponent = () => {
  const history = useHistory()
  const classes = useStyles
  const location = useLocation()
  const { me, setMe } = useContext(UserContext)
  const userRegion = me?.userRegion?.at(-1)
  const isActive = () => location.pathname.includes('homeroom')
  const [authorizedList, setAuthorizedList] = useState([])
  const checkAdminAccessOnSidebar = (label): number => {
    const adminAccessArr = me.userAccess
    const role = some(adminAccessArr, (access: unknown) => access?.accessDetail?.name === label)
    if (role) {
      return me.level
    } else {
      return -1
    }
  }

  const navigationList = [
    {
      to: COMMUNICATION,
      label: 'Announcements',
      icon: <AllInboxOutlinedIcon style={classes.logos} />,
      access: [7, checkAdminAccessOnSidebar('Communication')],
    },
    {
      to: CALENDAR,
      label: 'Calender',
      icon: <DatRangeOutlinedIcon style={classes.logos} />,
      access: [7, checkAdminAccessOnSidebar('Calender')],
    },
    {
      to: CURRICULUM,
      label: 'Curriculum',
      icon: <AllInboxOutlinedIcon style={classes.logos} />,
      access: [6, 8, checkAdminAccessOnSidebar('Curriculum')],
    },
    {
      to: ENROLLMENT,
      label: 'Enrollment',
      icon: <BackupTableIcon style={classes.logos} />,
      access: [4, checkAdminAccessOnSidebar('Enrollment')],
    },
    {
      to: HOMEROOM,
      label: 'Homeroom',
      icon: <PeopleAltOutlinedIcon style={classes.logos} />,
      access: [5, 15, checkAdminAccessOnSidebar('Homeroom Resources')],
    },
    {
      to: PARENT_LINK,
      label: 'Quick Links',
      icon: <CallMadeRoundedIcon style={classes.logos} />,
      access: [15, checkAdminAccessOnSidebar('Parent Link')],
    },
    {
      to: RECORDS,
      label: 'Records',
      icon: <CallMadeRoundedIcon style={classes.logos} />,
      access: [4, 6, 8, checkAdminAccessOnSidebar('Records')],
    },
    {
      to: REIMBURSMENTS,
      label: 'Reimbursements & Direct Orders',
      icon: <CreditCardRoundedIcon style={classes.logos} />,
      access: [3, 15, checkAdminAccessOnSidebar('Reimbursements & Direct Orders')],
    },
    {
      to: REPORTS,
      label: 'Reports',
      icon: <CallMadeRoundedIcon style={classes.logos} />,
      access: [6, 8, checkAdminAccessOnSidebar('Reports')],
    },
    {
      to: USERS,
      label: 'Users',
      icon: <PeopleAltOutlinedIcon style={classes.logos} />,
      access: [2],
    },
  ]

  useEffect(() => {
    const updatedList = []
    map(navigationList, (item) => {
      const listed = item.access.some((level) => level === Number(me?.role?.level))
      if (listed) updatedList.push(item)
    })
    setAuthorizedList(updatedList)
  }, [])

  const { signOut } = useContext(AuthContext)
  const [, setUnauthorizedAtAll] = useState(true)

  useEffect(() => {
    const isUnauthorized = noSidebarUsers.some((level) => {
      return level === Number(me?.role?.level)
    })
    setUnauthorizedAtAll(isUnauthorized)
  }, [])

  const logout = () => {
    setMe(null)
    signOut()
    history.push(DASHBOARD)
  }

  return (
    <Box sx={{ ...classes.container, display: { xs: 'none', sm: 'block' } }}>
      <nav aria-label='secondary mailbox folders' style={classes.navbar}>
        <List style={classes.navbar}>
          <ListItem disablePadding style={classes.myTechHigh} onClick={() => history.push(DASHBOARD)}>
            <ListItemButton component='a'>
              {userRegion?.regionDetail.program == 'MTH' ? <MTHLogo /> : <TTALogo />}
              <Box sx={classes.logoTitle}>
                <Paragraph size='medium' fontWeight='bold'>
                  {userRegion?.regionDetail.program == 'MTH' ? 'MY TECH HIGH' : 'Tech Trep Academy'}
                </Paragraph>
                <Paragraph
                  size='small'
                  fontWeight='bold'
                  sx={{ fontSize: '12px', color: '#CCCCCC', textAlign: 'center', paddingTop: '5px' }}
                >
                  {userRegion?.regionDetail.name}
                </Paragraph>
              </Box>
            </ListItemButton>
          </ListItem>
          <NavLink
            exact
            to={DASHBOARD}
            style={classes.navLink}
            activeStyle={{
              backgroundColor: ACTIVELINKBACKGROUND,
              color: '#4145FF',
            }}
          >
            <ListItem disablePadding style={{ backgroundColor: 'inherit' }}>
              <ListItemButton style={{ textDecoration: 'none' }}>
                <DescriptionIcon style={classes.logos} />
                <Paragraph size='medium'>Dashboard</Paragraph>
              </ListItemButton>
            </ListItem>
          </NavLink>
          {map(authorizedList, (item, index) =>
            item.label !== 'Homeroom' ? (
              <NavLink
                key={index}
                exact
                to={item.to}
                style={classes.navLink}
                activeStyle={{
                  backgroundColor: ACTIVELINKBACKGROUND,
                  color: '#4145FF',
                }}
              >
                <ListItem disablePadding style={{ backgroundColor: 'inherit' }}>
                  <ListItemButton style={{ textDecoration: 'none' }}>
                    {item.icon}
                    <Paragraph size='medium'>{item.label}</Paragraph>
                  </ListItemButton>
                </ListItem>
              </NavLink>
            ) : (
              <NavLink
                key={index}
                exact
                to={item.to}
                style={(classes.navLink, { color: isActive() ? '#4145FF' : '#CCC', textDecoration: 'none' })}
                activeStyle={{
                  backgroundColor: ACTIVELINKBACKGROUND,
                  color: '#4145FF',
                }}
              >
                <ListItem disablePadding style={{ backgroundColor: 'inherit' }}>
                  <ListItemButton style={{ textDecoration: 'none' }}>
                    {item.icon}
                    <Paragraph size='medium'>{item.label}</Paragraph>
                  </ListItemButton>
                </ListItem>
              </NavLink>
            ),
          )}
          <NavLink
            exact
            to={SETTINGS}
            style={classes.navLink}
            activeStyle={{
              backgroundColor: ACTIVELINKBACKGROUND,
              color: '#4145FF',
            }}
          >
            <ListItem disablePadding style={{ backgroundColor: 'inherit' }}>
              <ListItemButton>
                <SettingsRoundedIcon style={classes.logos} />
                <Paragraph size='medium'>Settings</Paragraph>
              </ListItemButton>
            </ListItem>
          </NavLink>

          <ListItem disablePadding style={{ position: 'absolute', bottom: 20 }} onClick={() => logout()}>
            <ListItemButton>
              <LogoutIcon style={classes.logos} sx={{ color: '#CCC' }} />
              <Paragraph size='medium' color='#CCCCCC'>
                Sign Out
              </Paragraph>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  )
}
