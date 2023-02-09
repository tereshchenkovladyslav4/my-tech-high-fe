import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Grid } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { MthRoute } from '@mth/enums'
import { getSchoolYearsByRegionId } from '@mth/graphql/queries/school-year'
import { SchoolYear, SchoolYearType, Student } from '@mth/models'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { ToDo } from '../../Dashboard/ToDoList/ToDo'
import { StudentProfile } from './StudentProfile/StudentProfile'
import { StudentSchedule } from './StudentSchedule/StudentSchedule'

type StudentProps = {
  student?: Student | undefined
}

export const StudentPage: React.FC<StudentProps> = () => {
  const history = useHistory()
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo
  const region_id = me?.userRegion?.at(-1)?.region_id
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const studentId = location.pathname.split('/').at(-1)

  const currStudent: Student | undefined = students?.find((student) => student.student_id == studentId)

  if (!studentId) {
    history.push(MthRoute.HOMEROOM)
  }

  if (!currStudent) {
    history.push(MthRoute.HOMEROOM)
  }

  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: !region_id,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.getSchoolYearsByRegionId) {
      setSchoolYears(
        schoolYearData?.data?.getSchoolYearsByRegionId.map((item: SchoolYearType) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
          schedule: item.schedule,
        })),
      )
    }
  }, [region_id, schoolYearData])

  return (
    <Grid container padding={4} rowSpacing={4}>
      <Grid item xs={12} sm={9}>
        <StudentProfile currStudent={currStudent} />
      </Grid>
      <Grid item xs={12} sm={3} sx={{ paddingX: 1 }}>
        <StudentSchedule />
      </Grid>
      <Grid item xs={12} sm={9}>
        <ToDo
          schoolYears={schoolYears}
          filteredByStudent={students?.find((student) => student.student_id == studentId)}
        />
      </Grid>
    </Grid>
  )
}

export default StudentPage
