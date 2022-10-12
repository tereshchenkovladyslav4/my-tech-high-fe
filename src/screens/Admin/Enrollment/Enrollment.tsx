import React, { useContext, useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import applicationsImg from '@mth/assets/applications.png'
import enrollmentImg from '@mth/assets/enrollment.png'
import withdrawlsImg from '@mth/assets/quick-link-blue.png'
import schedules from '@mth/assets/schedules.png'
import schoolAssignmentsImg from '@mth/assets/schoolAssignments.png'
import testingPreferencesImg from '@mth/assets/testingPreferences.png'
import { MthColor, MthTitle } from '@mth/enums'
import { useCurrentSchoolYearByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ADMIN_APPLICATIONS, ENROLLMENT_PACKETS, WITHDRAWAL, SCHOOL_ENROLLMENT } from '../../../utils/constants'
import { AdminEnrollmentCard } from './components/AdminEnrollmentCard/AdminEnrollmentCard'

export const Enrollment: React.FC = () => {
  const { me } = useContext(UserContext)
  const [enableSchedule, setEnableSchedule] = useState<boolean>(false)
  const { data: schoolYear } = useCurrentSchoolYearByRegionId(Number(me?.selectedRegionId))

  useEffect(() => {
    if (schoolYear) {
      setEnableSchedule(schoolYear.schedule)
    } else {
      setEnableSchedule(false)
    }
  }, [schoolYear])
  return (
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4 }}>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title={MthTitle.APPLICATIONS}
          link={ADMIN_APPLICATIONS}
          img={applicationsImg}
          color='none'
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title={MthTitle.ENROLLMENT_PACKETS}
          link={ENROLLMENT_PACKETS}
          img={enrollmentImg}
          color='none'
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title='Schedules'
          disabled={enableSchedule ? false : true}
          link={'https://google.com'}
          img={schedules}
          color='none'
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title='School of Enrollment'
          link={SCHOOL_ENROLLMENT}
          img={schoolAssignmentsImg}
          color='none'
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard title='Withdrawals' link={WITHDRAWAL} img={withdrawlsImg} color={MthColor.MTHBLUE} />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title='Testing Preference'
          disabled={enableSchedule ? false : true}
          link='https://google.com'
          img={testingPreferencesImg}
          color='none'
        />
      </Grid>
    </Grid>
  )
}
