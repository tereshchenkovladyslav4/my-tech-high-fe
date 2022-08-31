import React from 'react'
import { Grid } from '@mui/material'
import applicationsImg from '@mth/assets/applications.png'
import enrollmentImg from '@mth/assets/enrollment.png'
import schedules from '@mth/assets/schedules.png'
import schoolAssignmentsImg from '@mth/assets/schoolAssignments.png'
import testingPreferencesImg from '@mth/assets/testingPreferences.png'
import withdrawlsImg from '@mth/assets/withdrawls.png'
import { MthTitle } from '@mth/enums'
import { ADMIN_APPLICATIONS, ENROLLMENT_PACKETS, WITHDRAWAL, SCHOOL_ENROLLMENT } from '../../../utils/constants'
import { AdminEnrollmentCard } from './components/AdminEnrollmentCard/AdminEnrollmentCard'

export const Enrollment: React.FC = () => {
  return (
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4 }}>
      <Grid item xs={4}>
        <AdminEnrollmentCard title={MthTitle.APPLICATIONS} link={ADMIN_APPLICATIONS} img={applicationsImg} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title={MthTitle.ENROLLMENT_PACKETS} link={ENROLLMENT_PACKETS} img={enrollmentImg} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Schedules' link={'https://google.com'} img={schedules} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='School of Enrollment' link={SCHOOL_ENROLLMENT} img={schoolAssignmentsImg} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Withdrawals' link={WITHDRAWAL} img={withdrawlsImg} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Testing Preference' link='https://google.com' img={testingPreferencesImg} />
      </Grid>
    </Grid>
  )
}
