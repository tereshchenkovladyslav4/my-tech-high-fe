import { Box, Grid } from '@mui/material'
import { useQuery } from '@apollo/client'
import React, { useState, useContext, useEffect } from 'react'
import { Filters } from './Filters/Filters'
import { FilterVM } from './type'
import { EnrollmentSchoolTable } from './SchoolEnrollmentTable/SchoolEnrollmentTable'
import { GetSchoolsPartner } from './services'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { map, sortBy } from 'lodash'

export const SchoolOfEnrollment = () => {
  const [filter, setFilter] = useState<FilterVM>()
  const { me } = useContext(UserContext)
  const [partnerList, setPartnerList] = useState<Array<any>>([])

  const {
    loading: partnerLoading,
    data: schoolPartnerData,
  } = useQuery(GetSchoolsPartner, {
    variables: {
      schoolPartnerArgs: {
        region_id: me?.selectedRegionId,
        school_year_id: parseInt(filter?.schoolYearId) < 0 ? Math.abs(parseInt(filter?.schoolYearId)) : parseInt(filter?.schoolYearId) ,
        sort: {
          column: 'name',
          direction: 'ASC'
        }
      }
    },
    skip: !filter?.schoolYearId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    const list: any[] = [];
    schoolPartnerData?.getSchoolsOfEnrollmentByRegion?.filter(el => el.active === 1).map(item => {
      list.push({
        value: item.school_partner_id,
        label: item.name,
        abb: item.abbreviation
      })
    })
    setPartnerList(list);
  }, [schoolPartnerData])

  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Filters filter={filter} setFilter={setFilter} partnerList= {partnerList} />
        </Grid>
        <Grid item xs={12}>
          <EnrollmentSchoolTable filter={filter} setFilter={setFilter} partnerList={partnerList}  />
        </Grid>
      </Grid>
    </Box>
  )
}
