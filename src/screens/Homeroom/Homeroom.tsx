import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Grid } from '@mui/material'
import moment from 'moment'
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
  const [schoolYearsDropdown, setSchoolYearsDropdown] = useState<unknown[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

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
      const yearList = []
      SchoolYears.sort((a, b) => (a.date_begin > b.date_begin ? 1 : -1))
        .filter((item) => moment(item.date_begin).format('YYYY') >= moment().format('YYYY'))
        .map(
          (item: {
            date_begin: string
            date_end: string
            school_year_id: string
            midyear_application: number
            midyear_application_open: string
            midyear_application_close: string
          }): void => {
            yearList.push({
              label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
              value: item.school_year_id,
            })
            if (item && item.midyear_application === 1) {
              yearList.push({
                label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format(
                  'YY',
                )} Mid-year Program`,
                value: `${item.school_year_id}-mid`,
              })
            }
          },
        )
      setSchoolYearsDropdown(yearList.sort((a, b) => (a.label > b.label ? 1 : -1)))
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
            <Students isLoading={isLoading} schoolYears={schoolYears} schoolYearsDropdown={schoolYearsDropdown} />
          </Grid>
          <Grid item xs={12}>
            {schoolYears.length > 0 && <ToDo schoolYears={schoolYears} setIsLoading={setIsLoading} />}
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
