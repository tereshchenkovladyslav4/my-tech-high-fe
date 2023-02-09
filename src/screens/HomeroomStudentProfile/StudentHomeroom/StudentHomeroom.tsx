import React from 'react'
import { Grid } from '@mui/material'
import { StudentSchedule } from '../Student/StudentSchedule/StudentSchedule'
import { Feedback } from './Feedback'
import { HomeroomInfo } from './HomeroomInfo'
import { LearningLog } from './LearningLog'

const StudentHomeroom: React.FC = () => {
  return (
    <Grid container padding={3}>
      <Grid item xs={12} sm={7}>
        <Grid container padding={1} rowSpacing={1}>
          <Grid item xs={12} sm={12}>
            <HomeroomInfo />
          </Grid>
          <Grid item xs={12} sm={12}>
            <LearningLog />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={5}>
        <Grid container padding={1} rowSpacing={1}>
          <Grid item xs={12} sm={12}>
            <Feedback />
          </Grid>
          <Grid item xs={12} sm={12}>
            <StudentSchedule />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default StudentHomeroom
