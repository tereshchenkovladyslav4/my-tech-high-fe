import React, { FunctionComponent } from 'react'
import { Tabs, Tab } from '@mui/material'
import { Box } from '@mui/system'

import { Paragraph } from '../../components/Typography/Paragraph/Paragraph'
import { MTHBLUE, SYSTEM_01 } from '../../utils/constants'
import { Student } from './Student/Student'
import { useStyles } from './styles'

export const HomeroomStudentProfile: FunctionComponent = () => {
  const [value, setValue] = React.useState(0)
  const classes = useStyles
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const tabTextColor = (tab: number) => (value === tab ? MTHBLUE : SYSTEM_01)

  return (
    <Box display='flex' flexDirection='column'>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label='basic tabs example'
        centered
        sx={classes.activeTab}
        TabIndicatorProps={{ style: { background: '#4145FF' } }}
      >
        <Tab
          label={
            <Paragraph size={'large'} color={tabTextColor(0)}>
              Student
            </Paragraph>
          }
          sx={{ textTransform: 'none' }}
        />
        <Tab
          label={
            <Paragraph size={'large'} color={tabTextColor(1)}>
              Homeroom
            </Paragraph>
          }
          sx={{ textTransform: 'none', marginX: 12 }}
        />
        <Tab
          label={
            <Paragraph size={'large'} color={tabTextColor(2)}>
              Resources
            </Paragraph>
          }
          sx={{ textTransform: 'none' }}
        />
      </Tabs>
      {value === 0 ? <Student /> : value === 1 ? <h1> Coming Soon </h1> : <h1> Coming Soon </h1>}
    </Box>
  )
}
