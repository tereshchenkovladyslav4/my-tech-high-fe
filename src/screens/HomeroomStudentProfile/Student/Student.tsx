import React, { FunctionComponent } from 'react'
import { Box, Grid } from '@mui/material'

import { ToDo } from '../../Dashboard/ToDoList/ToDo'
import { StudentProfile } from './StudentProfile/StudentProfile'
import { StudentSchedule } from './StudentSchedule/StudentSchedule'

export const Student: FunctionComponent = () => {
  const builderActive = false
  return (
    <Box display='flex' flexDirection='row'>
      <Grid container padding={4} rowSpacing={4}>
        <Grid item xs={9}>
          <StudentProfile />
        </Grid>
        <Grid item xs={3}>
          {builderActive && <StudentSchedule />}
        </Grid>
        <Grid item xs={9}>
          <ToDo />
        </Grid>
      </Grid>
    </Box>
  )
}
