import { useQuery } from '@apollo/client'
import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { UserContext } from '../../providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../Admin/Dashboard/SchoolYear/SchoolYear'
import { SchoolYearType } from '../Dashboard/HomeroomGrade/components/StudentGrade/types'
import { ToDo } from '../Dashboard/ToDoList/ToDo'
import { Students } from './Students/Students'

export const Homeroom: FunctionComponent = () => {
  const { me } = useContext(UserContext)
  const { region_id } = me?.userRegion?.at(-1)
  const [schoolYears, setSchoolYears] = useState<SchoolYearType[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears.map((item) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
        })),
      )
    }
  }, [region_id, schoolYearData?.data?.region?.SchoolYears])
  return (
    <Grid container padding={4} rowSpacing={4}>
      <Grid item xs={12}>
        <Students />
      </Grid>
      <Grid item xs={12}>
        {schoolYears.length > 0 && <ToDo schoolYears={schoolYears} />}
      </Grid>
    </Grid>
  )
}
