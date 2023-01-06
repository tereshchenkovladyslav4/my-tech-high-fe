import React, { useContext, useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import applicationsImg from '@mth/assets/applications.png'
import enrollmentImg from '@mth/assets/enrollment.png'
import blueGradientImg from '@mth/assets/quick-link-blue.png'
import orangeImg from '@mth/assets/quick-link-orange.png'
import schedules from '@mth/assets/schedules.png'
import schoolAssignmentsImg from '@mth/assets/schoolAssignments.png'
import testingPreferencesImg from '@mth/assets/testingPreferences.png'
import { MthRoute, MthTitle } from '@mth/enums'
import { useCurrentSchoolYearByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
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
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4, marginBottom: 4 }}>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title={MthTitle.APPLICATIONS}
          link={MthRoute.ADMIN_APPLICATIONS.toString()}
          img={applicationsImg}
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title={MthTitle.ENROLLMENT_PACKETS}
          link={MthRoute.ENROLLMENT_PACKETS.toString()}
          img={enrollmentImg}
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title='Schedules'
          disabled={!enableSchedule}
          link={MthRoute.ENROLLMENT_SCHEDULE.toString()}
          img={schedules}
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title='School of Enrollment'
          link={MthRoute.SCHOOL_ENROLLMENT.toString()}
          img={schoolAssignmentsImg}
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title='Withdrawals'
          link={MthRoute.WITHDRAWAL.toString()}
          img={blueGradientImg}
          showTitle={true}
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title='Testing Preference'
          disabled={!enableSchedule}
          link='https://google.com'
          img={testingPreferencesImg}
        />
      </Grid>
      <Grid item xs={4}>
        <AdminEnrollmentCard
          title='Requests'
          fullTitle='Homeroom Resources'
          link={MthRoute.RESOURCE_REQUESTS}
          img={orangeImg}
          showTitle={true}
        />
      </Grid>
    </Grid>
  )
}
