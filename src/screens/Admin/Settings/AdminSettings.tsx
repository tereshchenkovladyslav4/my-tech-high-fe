import React from 'react'
import { Box, Tab, Tabs } from '@mui/material'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { MTHBLUE } from '../../../utils/constants'
import { useStyles } from './styles'
import { Account } from './Account'
import { Profile } from './Profile'

const AdminSetting: React.FC = () => {
  const classes = useStyles
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const tabTextColor = (tab: number) => (value === tab ? MTHBLUE : '')

  return (
    <Box display='flex' flexDirection='column' height={'100%'}>
      <Tabs
        value={value}
        onChange={handleChange}
        centered
        sx={classes.activeTab}
        TabIndicatorProps={{ style: { background: '#4145FF' } }}
      >
        <Tab label={<Subtitle color={tabTextColor(0)}>Profile</Subtitle>} sx={{ textTransform: 'none' }} />
        <Tab label={<Subtitle color={tabTextColor(1)}>Account</Subtitle>} sx={{ textTransform: 'none' }} />
      </Tabs>
      <Box paddingX={2} height={'100%'} paddingY={2}>
        {value === 0 ? <Profile /> : <Account />}
      </Box>
    </Box>
  )
}

export { AdminSetting as default }
