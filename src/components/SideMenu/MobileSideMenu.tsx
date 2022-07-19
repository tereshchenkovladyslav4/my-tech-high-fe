import { List, ListItem, Box, ListItemButton, IconButton } from '@mui/material'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import { TTALogo } from '../SVG/TTALogo'
import { MTHLogo } from '../SVG/MTHLogo'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import { useStyles } from './styles'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import {
  ACTIVELINKBACKGROUND,
  ANNOUNCEMENTS,
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
import { UserContext } from '../../providers/UserContext/UserProvider'
import { AuthContext } from '../../providers/AuthProvider/AuthContext'
import LogoutIcon from '@mui/icons-material/Logout'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined'
import DatRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import DescriptionIcon from '@mui/icons-material/Description'
import { map, some } from 'lodash'
const noSidebarUsers = [15, 14, 16, 11, 9, 10, 13, 12]

type Props = {
  handleDrawerClose: (type: string, name: string) => void
}

export const MobileSideMenu: FunctionComponent<Props> = ({ handleDrawerClose }) => {
  const history = useHistory()
  const classes = useStyles
  const location = useLocation()
  const { me, setMe } = useContext(UserContext)
  const userRegion = me?.userRegion?.at(-1)
  const isActive = () => location.pathname.includes('homeroom')
  const [authorizedList, setAuthorizedList] = useState([])
  const checkAdminAccessOnSidebar = (label) => {
    const adminAccessArr = me.userAccess
    const role = some(adminAccessArr, (access: any) => access?.accessDetail?.name === label)
    if (role) {
      return me.level
    } else {
      ; -1
    }
  }

  const navigationList = [
    {
      to: COMMUNICATION,
      label: 'Communication',
      access: [7, checkAdminAccessOnSidebar('Communication')],
    },    
    {
      to: CALENDAR,
      label: 'Calender',
      access: [7, checkAdminAccessOnSidebar('Calender')],
    },
    {
      to: CURRICULUM,
      label: 'Curriculum',
      access: [6, 8, checkAdminAccessOnSidebar('Curriculum')],
    },
    {
      to: ENROLLMENT,
      label: 'Enrollment',
      access: [4, checkAdminAccessOnSidebar('Enrollment')],
    },
    {
      to: HOMEROOM,
      label: 'Homeroom',
      access: [5, 15, checkAdminAccessOnSidebar('Homeroom Resources')],
    },
    {
      to: PARENT_LINK,
      label: 'Quick Links',
      access: [15, checkAdminAccessOnSidebar('Parent Link')],
    },
    {
      to: RECORDS,
      label: 'Records',
      access: [4, 6, 8, checkAdminAccessOnSidebar('Records')],
    },
    {
      to: REIMBURSMENTS,
      label: 'Reimbursements & Direct Orders',
      access: [3, 15, checkAdminAccessOnSidebar('Reimbursements & Direct Orders')],
    },
    {
      to: REPORTS,
      label: 'Reports',
      access: [6, 8, checkAdminAccessOnSidebar('Reports')],
    },
    {
      to: USERS,
      label: 'Users',
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
  const [unauthorizedAtAll, setUnauthorizedAtAll] = useState(true)

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
    <Box sx={classes.mobileContainer}>
      <nav aria-label='secondary mailbox folders' style={classes.navbar}>
        <List style={classes.navbar}>
          <NavLink
            exact
            to={DASHBOARD}
            style={classes.navLink}
            activeStyle={{
              backgroundColor: ACTIVELINKBACKGROUND,
              color: '#4145FF',
            }}
          >
            <ListItem disablePadding style={{ backgroundColor: 'inherit' }} onClick={() => handleDrawerClose('side', 'dashboard')}>
              <ListItemButton style={{ textDecoration: 'none', justifyContent: 'space-between' }}>
                <Paragraph sx={classes.mobileNavText}>Dashboard</Paragraph>
                <IconButton
                  sx={{
                    color: '#0E0E0E',
                  }}>
                  <ArrowForwardIcon />
                </IconButton>
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
                <ListItem disablePadding style={{ backgroundColor: 'inherit' }} onClick={() => handleDrawerClose('side', item.label)}>
                  <ListItemButton style={{ textDecoration: 'none', justifyContent: 'space-between' }}>
                    <Paragraph sx={classes.mobileNavText}>{item.label}</Paragraph>
                    <IconButton
                      sx={{
                        color: '#0E0E0E',
                      }}>
                      <ArrowForwardIcon />
                    </IconButton>
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
                <ListItem disablePadding style={{ backgroundColor: 'inherit' }} onClick={() => handleDrawerClose('side', item.label)}>
                  <ListItemButton style={{ textDecoration: 'none', justifyContent: 'space-between' }}>
                    {item.icon}
                    <Paragraph sx={classes.mobileNavText}>{item.label}</Paragraph>
                    <IconButton
                      sx={{
                        color: '#0E0E0E',
                      }}>
                      <ArrowForwardIcon />
                    </IconButton>
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
            <ListItem disablePadding style={{ backgroundColor: 'inherit' }} onClick={() => handleDrawerClose('side', 'settings')}>
              <ListItemButton style={{ justifyContent: 'space-between' }}>
                <Paragraph sx={classes.mobileNavText}>Settings</Paragraph>
                <IconButton
                  sx={{
                    color: '#0E0E0E',
                  }}>
                  <ArrowForwardIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          </NavLink>

          <ListItem disablePadding style={{ position: 'absolute', bottom: 64 }} onClick={() => logout()}>
            <ListItemButton style={{ justifyContent: 'space-between' }}>
              {/* <LogoutIcon style={classes.logos} sx={{ color: '#CCC' }} /> */}
              <Paragraph sx={classes.mobileNavText} color='#CCCCCC' style={{ justifyContent: 'space-between' }}>
                Sign Out
              </Paragraph>
              <IconButton
                sx={{
                  color: '#0E0E0E',
                }}>
                <ArrowForwardIcon />
              </IconButton>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  )
}
