import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Grid } from '@mui/material'
import { sortBy } from 'lodash'
import moment from 'moment'
import { useRouteMatch } from 'react-router-dom'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthRoute } from '@mth/enums'
import { getActiveSchoolYearsByRegionId } from '@mth/graphql/queries/school-year'
import { SchoolYear, SchoolYearType } from '@mth/models'
import { UserContext } from '../../providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../Admin/Dashboard/SchoolYear/SchoolYear'
import { ToDo } from '../Dashboard/ToDoList/ToDo'
import { Students } from './Students/Students'

export const Homeroom: React.FC = () => {
  const isExact = useRouteMatch(MthRoute.HOMEROOM)?.isExact
  const { me } = useContext(UserContext)
  const region_id = me?.userRegion?.at(-1)?.region_id
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [schoolYearsDropdown, setSchoolYearsDropdown] = useState<DropDownItem[]>([])
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
      setSchoolYears(
        SchoolYears.map((item: SchoolYearType) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
          schedule: item.schedule,
        })),
      )
    }
  }, [region_id, schoolYearData?.data?.region?.SchoolYears])

  const { loading, data } = useQuery(getActiveSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.getActiveSchoolYears) {
      const schoolYearsArray: Array<DropDownItem> = []
      data.getActiveSchoolYears.map((item: SchoolYearType): void => {
        if (
          moment(item.date_reg_open).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD') &&
          moment(item.date_reg_close).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')
        ) {
          schoolYearsArray.push({
            label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
            value: item.school_year_id,
          })
        }

        if (
          item.midyear_application &&
          moment(item.midyear_application_open).format('YYYY-MM-DD') <= moment().format('YYYY-MM-DD') &&
          moment(item.midyear_application_close).format('YYYY-MM-DD') >= moment().format('YYYY-MM-DD')
        ) {
          schoolYearsArray.push({
            label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')} Mid-year Program`,
            value: `${item.school_year_id}-mid`,
          })
        }
      })
      setSchoolYearsDropdown(sortBy(schoolYearsArray, 'label'))
    }
  }, [loading, data])

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
