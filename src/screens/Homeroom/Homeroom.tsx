import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Grid } from '@mui/material'
import { useRouteMatch } from 'react-router-dom'
import { MthRoute } from '@mth/enums'
import { UserContext } from '../../providers/UserContext/UserProvider'
import { SchoolYearType } from '../../utils/utils.types'
import { getSchoolYearsByRegionId } from '../Admin/Dashboard/SchoolYear/SchoolYear'
import { ToDo } from '../Dashboard/ToDoList/ToDo'
import { Students } from './Students/Students'

export const Homeroom: React.FC = () => {
  const isExact = useRouteMatch(MthRoute.HOMEROOM)?.isExact
  const { me } = useContext(UserContext)
  const region_id = me?.userRegion?.at(-1)?.region_id
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
        SchoolYears.map((item: SchoolYearType) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
        })),
      )
    }
  }, [region_id, schoolYearData?.data?.region?.SchoolYears])

  return (
    <Box>
      {isExact && (
        <Grid container padding={4} rowSpacing={4}>
          <Grid item xs={12}>
            <Students schoolYears={schoolYears} />
          </Grid>
          <Grid item xs={12}>
            {schoolYears.length > 0 && <ToDo schoolYears={schoolYears} />}
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
