import React, { useContext } from 'react'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import LogoutIcon from '@mui/icons-material/Logout'
import MarkunreadMailboxOutlinedIcon from '@mui/icons-material/MarkunreadMailboxOutlined'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import RecentActorsOutlinedIcon from '@mui/icons-material/RecentActorsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { List, ListItem, Box, ListItemButton } from '@mui/material'
import { map } from 'lodash'
import { NavLink, useHistory } from 'react-router-dom'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { MthColor, MthRoute } from '@mth/enums'
import { AuthContext } from '@mth/providers/AuthProvider/AuthContext'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { MTHLogo } from '../SVG/MTHLogo'
import { TTALogo } from '../SVG/TTALogo'
import { useStyles } from './styles'

export const TeacherSideMenu: React.FC = () => {
  const history = useHistory()
  const classes = useStyles

  const { me, setMe } = useContext(UserContext)
  const { signOut } = useContext(AuthContext)
  const userRegion = me?.userRegion?.at(-1)
  const logout = () => {
    setMe(null)
    signOut()
    history.push(`${MthRoute.DASHBOARD}`)
  }

  const unExactPages = [`${MthRoute.COMMUNICATION}`, `${MthRoute.HOMEROOM}`]

  const navigationList = [
    {
      to: `${MthRoute.DASHBOARD}`,
      label: 'Dashboard',
      icon: <BackupTableIcon style={classes.logos} />,
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
      to: `${MthRoute.GRADEBOOK}`,
      label: 'Gradebook',
      icon: <RecentActorsOutlinedIcon style={classes.logos} />,
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
          <ListItem disablePadding style={classes.myTechHigh} onClick={() => history.push(`${MthRoute.DASHBOARD}`)}>
            <ListItemButton component='a'>
              {userRegion?.regionDetail.program == 'MTH' ? <MTHLogo /> : <TTALogo />}
              <Box sx={classes.logoTitle}>
                <Paragraph size='medium' fontWeight='bold'>
                  {userRegion?.regionDetail.program == 'MTH' ? 'MY TECH HIGH' : 'Tech Trep Academy'}
                </Paragraph>
                <Paragraph
                  size='small'
                  fontWeight='500'
                  sx={{ fontSize: '12px', color: MthColor.BLACK, textAlign: 'center', paddingTop: '5px' }}
                >
                  {userRegion?.regionDetail.name}
                </Paragraph>
              </Box>
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
