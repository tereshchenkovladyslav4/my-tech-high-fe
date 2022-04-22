import { List, ListItem, Box, ListItemButton } from '@mui/material'
import React, { FunctionComponent, useContext } from 'react'
import { Logo } from '../../components/SVG/Logo'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { useStyles } from './styles'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import { map } from 'lodash'

import {
  ACTIVELINKBACKGROUND,
  ANNOUNCEMENTS,
  CALENDAR,
  CURRICULUM,
  DASHBOARD,
  ENROLLMENT,
  HOMEROOM,
  REIMBURSMENTS,
  REPORTS,
  SETTINGS,
  SITE_MANAGEMENT,
  RECORDS,
  USERS,
  SITEMANAGEMENT,
} from '../../utils/constants'
import { UserContext } from '../../providers/UserContext/UserProvider'
import { AuthContext } from '../../providers/AuthProvider/AuthContext'
import LogoutIcon from '@mui/icons-material/Logout'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined'
import DatRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import KeyIcon from '@mui/icons-material/VpnKey';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';

export const AdminSideMenu: FunctionComponent = () => {
  const history = useHistory()
  const classes = useStyles
  const location = useLocation()
  //this isActive function will be used temporarily with enrollment till its routes are imporved/refactored
  const isActiveTemp = () =>
    (location.pathname.includes('enrollment') || location.pathname.includes('applications')) &&
      !location.pathname.includes('setting')
      ? true
      : false

  const isActive = (basePath: string): boolean => {
    const match = basePath.match(/^\/settings/)

    return !!match
  }

  const { setMe } = useContext(UserContext)
  const { signOut } = useContext(AuthContext)

  const logout = () => {
    setMe(null)
    signOut()
    history.push(DASHBOARD)
  }

  const navigationList = [
    {
      to: DASHBOARD,
      label: 'Dashboard',
      icon: <BackupTableIcon style={classes.logos} />,
    },
    {
      to: ENROLLMENT,
      label: 'Enrollment',
      icon: <DescriptionIcon style={classes.logos} />,
    },
    {
      to: REIMBURSMENTS,
      label: 'Reimbursements & Direct Orders',
      icon: <CreditCardRoundedIcon style={classes.logos} />,
    },
    {
      to: HOMEROOM,
      label: 'Homeroom',
      icon: <BackupTableIcon style={classes.logos} />,
    },
    {
      to: ANNOUNCEMENTS,
      label: 'Announcements',
      icon: <AllInboxOutlinedIcon style={classes.logos} />,
    },
    {
      to: CALENDAR,
      label: 'Calender',
      icon: <DatRangeOutlinedIcon style={classes.logos} />,
    },
    {
      to: CURRICULUM,
      label: 'Curriculum',
      icon: <AllInboxOutlinedIcon style={classes.logos} />,
    },
    {
      to: REPORTS,
      label: 'Reports',
      icon: <CallMadeRoundedIcon style={classes.logos} />,
    },
    {
      to: SITE_MANAGEMENT,
      label: 'Site Management',
      icon: <KeyIcon style={classes.logos} />,
    },
    {
      to: RECORDS,
      label: 'Records',
      icon: <StorageIcon style={classes.logos} />,
    },
    {
      to: USERS,
      label: 'Users',
      icon: <PeopleAltOutlinedIcon style={classes.logos} />,
    },
    {
      to: SETTINGS,
      label: 'Settings',
      icon: <SettingsOutlinedIcon style={classes.logos} />,
    },
  ];

  return (
    <Box sx={classes.container}>
      <nav aria-label='secondary mailbox folders' style={classes.navbar}>
        <List style={classes.navbar}>
          <ListItem disablePadding style={classes.myTechHigh}>
            <ListItemButton>
              <Logo style={classes.logos} />
              <Paragraph fontFamily='Helvetica' size='medium' fontWeight='bold'>
                MY TECH HIGH
              </Paragraph>
            </ListItemButton>
          </ListItem>
          {map(navigationList, (item, index) => (
            <NavLink
              key={index}
              exact={item.to !== SITE_MANAGEMENT ? true : false}
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
          ))}
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
