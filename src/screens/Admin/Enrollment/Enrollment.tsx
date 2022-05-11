import { Grid } from '@mui/material'
import React from 'react'
import { ADMIN_APPLICATIONS, ENROLLMENT_PACKETS, WITHDRAW } from '../../../utils/constants'
import { AdminEnrollmentCard } from './components/AdminEnrollmentCard/AdminEnrollmentCard'
import applicationsImg from '../../../assets/applications.png'
import enrollmentImg from '../../../assets/enrollment.png'
import schedules from '../../../assets/schedules.png'
import schoolAssignmentsImg from '../../../assets/schoolAssignments.png'
import testingPreferencesImg from '../../../assets/testingPreferences.png'
import withdrawlsImg from '../../../assets/withdrawls.png'

export default function Enrollment() {
  return (
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4 }}>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Applications' link={ADMIN_APPLICATIONS} img={applicationsImg} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Packets' link={ENROLLMENT_PACKETS} img={enrollmentImg} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Schedules' link={'https://google.com'} img={schedules} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='School Assignments' link='https://google.com' img={schoolAssignmentsImg} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Withdrawls' link={WITHDRAW} img={withdrawlsImg} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Testing Preference' link='https://google.com' img={testingPreferencesImg} />
      </Grid>
    </Grid>
  )
}
