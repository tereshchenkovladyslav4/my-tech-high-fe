import React, { useContext, useEffect, useState } from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { List, ListItem, Box, ListItemButton, IconButton } from '@mui/material'
import { map, some } from 'lodash'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { MthColor, MthRoute } from '@mth/enums'
import { MthTitle } from '@mth/enums'
import { AuthContext } from '@mth/providers/AuthProvider/AuthContext'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { useStyles } from './styles'
const noSidebarUsers = [15, 14, 16, 11, 9, 10, 13, 12]

type Props = {
  handleDrawerClose: (type: string, name: string) => void
}

export const MobileSideMenu: React.FC<Props> = ({ handleDrawerClose }) => {
  const history = useHistory()
  const classes = useStyles
  const location = useLocation()
  const { me, setMe } = useContext(UserContext)
  const isActive = () => location.pathname.includes('homeroom')
  const [authorizedList, setAuthorizedList] = useState([])
  const checkAdminAccessOnSidebar = (label: string) => {
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
      to: `${MthRoute.COMMUNICATION}`,
      label: 'Communication',
      access: [7, checkAdminAccessOnSidebar('Communication')],
    },
    {
      to: `${MthRoute.CALENDAR}`,
      label: 'Calender',
      access: [7, checkAdminAccessOnSidebar('Calender')],
    },
    {
      to: `${MthRoute.CURRICULUM}`,
      label: 'Curriculum',
      access: [6, 8, checkAdminAccessOnSidebar('Curriculum')],
    },
    {
      to: `${MthRoute.ENROLLMENT}`,
      label: 'Enrollment',
      access: [4, checkAdminAccessOnSidebar('Enrollment')],
    },
    {
      to: `${MthRoute.HOMEROOM}`,
      label: 'Homeroom',
      access: [5, 15, checkAdminAccessOnSidebar('Homeroom Resources')],
    },
    {
      to: `${MthRoute.RECORDS}`,
      label: 'Records',
      access: [4, 6, 8, checkAdminAccessOnSidebar('Records')],
    },
    {
      to: `${MthRoute.REIMBURSEMENTS}`,
      label: MthTitle.DIRECT_ORDERS_REIMBURSEMENTS,
      access: [3, 15, checkAdminAccessOnSidebar(MthTitle.DIRECT_ORDERS_REIMBURSEMENTS)],
    },
    {
      to: `${MthRoute.PARENT_LINK}`,
      label: 'Quick Links',
      access: [15, checkAdminAccessOnSidebar('Parent Link')],
    },
    {
      to: `${MthRoute.REPORTS}`,
      label: 'Reports',
      access: [6, 8, checkAdminAccessOnSidebar('Reports')],
    },
    {
      to: `${MthRoute.USERS}`,
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
    history.push(`${MthRoute.DASHBOARD}`)
  }

  return (
    <Box sx={classes.mobileContainer}>
      <nav aria-label='secondary mailbox folders' style={classes.navbar}>
        <List style={classes.navbar}>
          <NavLink
            exact
            to={`${MthRoute.DASHBOARD}`}
            style={classes.navLink}
            activeStyle={{
              backgroundColor: MthColor.ACTIVE_LINK_BG,
              color: '#4145FF',
            }}
          >
            <ListItem
              disablePadding
              style={{ backgroundColor: 'inherit' }}
              onClick={() => handleDrawerClose('side', 'dashboard')}
            >
              <ListItemButton style={{ textDecoration: 'none', justifyContent: 'space-between' }}>
                <Paragraph sx={classes.mobileNavText}>Dashboard</Paragraph>
                <IconButton
                  sx={{
                    color: '#0E0E0E',
                  }}
                >
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
                  backgroundColor: MthColor.ACTIVE_LINK_BG,
                  color: '#4145FF',
                }}
              >
                <ListItem
                  disablePadding
                  style={{ backgroundColor: 'inherit' }}
                  onClick={() => handleDrawerClose('side', item.label)}
                >
                  <ListItemButton style={{ textDecoration: 'none', justifyContent: 'space-between' }}>
                    <Paragraph sx={classes.mobileNavText}>{item.label}</Paragraph>
                    <IconButton
                      sx={{
                        color: '#0E0E0E',
                      }}
                    >
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
                  backgroundColor: MthColor.ACTIVE_LINK_BG,
                  color: '#4145FF',
                }}
              >
                <ListItem
                  disablePadding
                  style={{ backgroundColor: 'inherit' }}
                  onClick={() => handleDrawerClose('side', item.label)}
                >
                  <ListItemButton style={{ textDecoration: 'none', justifyContent: 'space-between' }}>
                    {item.icon}
                    <Paragraph sx={classes.mobileNavText}>{item.label}</Paragraph>
                    <IconButton
                      sx={{
                        color: '#0E0E0E',
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              </NavLink>
            ),
          )}
          <NavLink
            exact
            to={`${MthRoute.SETTINGS}`}
            style={classes.navLink}
            activeStyle={{
              backgroundColor: MthColor.ACTIVE_LINK_BG,
              color: '#4145FF',
            }}
          >
            <ListItem
              disablePadding
              style={{ backgroundColor: 'inherit' }}
              onClick={() => handleDrawerClose('side', 'settings')}
            >
              <ListItemButton style={{ justifyContent: 'space-between' }}>
                <Paragraph sx={classes.mobileNavText}>Settings</Paragraph>
                <IconButton
                  sx={{
                    color: '#0E0E0E',
                  }}
                >
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
                }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  )
}
