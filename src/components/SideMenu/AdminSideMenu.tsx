import React, { useContext } from 'react'
import AllInboxOutlinedIcon from '@mui/icons-material/AllInboxOutlined'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import DatRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined'
import DescriptionIcon from '@mui/icons-material/Description'
import LogoutIcon from '@mui/icons-material/Logout'
import MarkunreadMailboxOutlinedIcon from '@mui/icons-material/MarkunreadMailboxOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined'
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import KeyIcon from '@mui/icons-material/VpnKey'
import { List, ListItem, Box, ListItemButton } from '@mui/material'
import { map } from 'lodash'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { MthRoute, MthTitle } from '@mth/enums'
import { AuthContext } from '@mth/providers/AuthProvider/AuthContext'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { MTHLogo } from '../SVG/MTHLogo'
import { useStyles } from './styles'

export const AdminSideMenu: React.FC = () => {
  const history = useHistory()
  const classes = useStyles

  const { setMe } = useContext(UserContext)
  const { signOut } = useContext(AuthContext)

  const logout = () => {
    setMe(null)
    signOut()
    history.push(`${MthRoute.DASHBOARD}`)
  }

  const location = useLocation()
  const isActive = (path: string, exact: boolean) =>
    exact ? location.pathname === path : location.pathname.includes(path)

  const unExactPages = [
    `${MthRoute.SITE_MANAGEMENT}`,
    `${MthRoute.ENROLLMENT}`,
    `${MthRoute.ANNOUNCEMENTS}`,
    `${MthRoute.CALENDAR}`,
    `${MthRoute.COMMUNICATION}`,
    `${MthRoute.CURRICULUM}`,
    `${MthRoute.HOMEROOM}`,
    `${MthRoute.REIMBURSEMENTS}`,
  ]

  const navigationList = [
    {
      to: `${MthRoute.DASHBOARD}`,
      label: 'Dashboard',
      icon: <BackupTableIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.ENROLLMENT}`,
      label: 'Enrollment',
      icon: <DescriptionIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.REIMBURSEMENTS}`,
      label: MthTitle.DIRECT_ORDERS_REIMBURSEMENTS,
      icon: <CreditCardRoundedIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.HOMEROOM}`,
      label: 'Homeroom',
      icon: <PeopleAltOutlinedIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.COMMUNICATION}`,
      label: 'Communication',
      icon: <MarkunreadMailboxOutlinedIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.CALENDAR}`,
      label: 'Calendar',
      icon: <DatRangeOutlinedIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.CURRICULUM}`,
      label: 'Curriculum',
      icon: <AllInboxOutlinedIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.REPORTS}`,
      label: 'Reports',
      icon: <CallMadeRoundedIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.SITE_MANAGEMENT}`,
      label: 'Site Management',
      icon: <KeyIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.RECORDS}`,
      label: 'Records',
      icon: <RecentActorsOutlinedIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.USERS}`,
      label: 'Users',
      icon: <PermIdentityOutlinedIcon style={classes.logos} />,
    },
    {
      to: `${MthRoute.SETTINGS}`,
      label: 'Settings',
      icon: <SettingsOutlinedIcon style={classes.logos} />,
    },
  ]

  return (
    <Box sx={classes.container}>
      <nav aria-label='secondary mailbox folders' style={classes.navbar}>
        <List style={classes.navbar}>
          <ListItem disablePadding style={classes.myTechHigh}>
            <ListItemButton>
              <MTHLogo />
              <Paragraph fontFamily='Helvetica' size='medium' fontWeight='bold'>
                MY TECH HIGH
              </Paragraph>
            </ListItemButton>
          </ListItem>
          {map(navigationList, (item, index) => (
            <NavLink
              key={index}
              exact={!unExactPages.includes(item.to)}
              to={item.to}
              style={classes.navLink}
              activeStyle={classes.activeNavLink}
            >
              <ListItem disablePadding style={{ backgroundColor: 'inherit' }}>
                <ListItemButton
                  style={{
                    textDecoration: 'none',
                    paddingLeft: isActive(item.to, !unExactPages.includes(item.to)) ? '13px' : '16px',
                  }}
                >
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
