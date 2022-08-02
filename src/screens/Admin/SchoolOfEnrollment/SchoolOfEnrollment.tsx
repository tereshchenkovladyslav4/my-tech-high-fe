import React, { useState, useContext, useEffect, FunctionComponent } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Grid } from '@mui/material'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { Filters } from './Filters/Filters'
import { EnrollmentSchoolTable } from './SchoolEnrollmentTable/SchoolEnrollmentTable'
import { GetSchoolsPartner } from './services'
import { FilterVM } from './type'

type SchoolPartner = {
  value: number
  label: string
  abb: string
}
export const SchoolOfEnrollment: FunctionComponent = () => {
  const [filter, setFilter] = useState<FilterVM>()
  const { me } = useContext(UserContext)
  const [partnerList, setPartnerList] = useState<Array<unknown>>([])

  const { data: schoolPartnerData } = useQuery(GetSchoolsPartner, {
    variables: {
      schoolPartnerArgs: {
        region_id: me?.selectedRegionId,
        school_year_id:
          parseInt(filter?.schoolYearId) < 0
            ? Math.abs(parseInt(filter?.schoolYearId))
            : parseInt(filter?.schoolYearId),
        sort: {
          column: 'name',
          direction: 'ASC',
        },
      },
    },
    skip: !filter?.schoolYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    const list: SchoolPartner[] = []
    schoolPartnerData?.getSchoolsOfEnrollmentByRegion
      ?.filter((el) => el.active === 1)
      .map((item) => {
        list.push({
          value: item.school_partner_id,
          label: item.name,
          abb: item.abbreviation,
        })
      })
    setPartnerList(list)
  }, [schoolPartnerData])

  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Filters filter={filter} setFilter={setFilter} partnerList={partnerList} />
        </Grid>
        <Grid item xs={12}>
          <EnrollmentSchoolTable filter={filter} setFilter={setFilter} partnerList={partnerList} />
        </Grid>
      </Grid>
    </Box>
  )
}
