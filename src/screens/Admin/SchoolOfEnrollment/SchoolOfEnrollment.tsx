import React, { useState, useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Grid } from '@mui/material'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../SiteManagement/services'
import { Filters } from './Filters/Filters'
import { EnrollmentSchoolTable } from './SchoolEnrollmentTable/SchoolEnrollmentTable'
import { GetSchoolsPartner } from './services'
import { FilterVM, schoolYearDataType, PartnerEnrollmentType, OptionType, SchoolPartner } from './type'

export const SchoolOfEnrollment: React.FC = () => {
  const [filter, setFilter] = useState<FilterVM>()
  const { me } = useContext(UserContext)
  const [partnerList, setPartnerList] = useState<OptionType[]>([])
  const [previousPartnerList, setPreviousPartnerList] = useState<Array<SchoolPartner>>([])

  const [schoolYears, setSchoolYears] = useState<DropDownItem[]>([])
  const [selectedYear, setSelectedYear] = useState<DropDownItem>()
  const [grades, setGrades] = useState<string[]>([])
  const [schoolYearsData, setSchoolYearsData] = useState<schoolYearDataType[]>([])
  const [previousYear, setPreviousYear] = useState<schoolYearDataType>()

  const { data: schoolPartnerData } = useQuery(GetSchoolsPartner, {
    variables: {
      schoolPartnerArgs: {
        region_id: me?.selectedRegionId,
        school_year_id: selectedYear?.value ? selectedYear.value.toString().split('-')[0] : null,
        sort: {
          column: 'name',
          direction: 'ASC',
        },
      },
    },
    skip: !selectedYear || !selectedYear.value,
    fetchPolicy: 'network-only',
  })

  const { data: previousSchoolPartnerData } = useQuery(GetSchoolsPartner, {
    variables: {
      schoolPartnerArgs: {
        region_id: me?.selectedRegionId,
        school_year_id: previousYear?.school_year_id,
        sort: {
          column: 'name',
          direction: 'ASC',
        },
      },
    },
    skip: !previousYear,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    const list: OptionType[] = []
    schoolPartnerData?.getSchoolsOfEnrollmentByRegion
      ?.filter((el: PartnerEnrollmentType) => el.active === 1)
      .map((item: PartnerEnrollmentType) => {
        list.push({
          value: item.school_partner_id,
          label: item.abbreviation,
        })
      })
    setPartnerList(list)
  }, [schoolPartnerData])

  useEffect(() => {
    const list: SchoolPartner[] = []
    previousSchoolPartnerData?.getSchoolsOfEnrollmentByRegion
      ?.filter((el: PartnerEnrollmentType) => el.active === 1)
      .map((item: PartnerEnrollmentType) => {
        list.push({
          value: item.school_partner_id,
          label: item.name,
          abb: item.abbreviation,
        })
      })
    setPreviousPartnerList(list)
  }, [previousSchoolPartnerData])

  const { data: schoolYearData } = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.region

      setSchoolYearsData(SchoolYears)
      const yearList: OptionType[] = []
      SchoolYears.map(
        (item: {
          date_begin: string
          date_end: string
          school_year_id: string
          midyear_application: number
          midyear_application_open: string
          midyear_application_close: string
          grades: string
        }): void => {
          yearList.push({
            label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
            value: item.school_year_id,
          })

          if (moment(item.date_begin).format('YYYY') === moment().format('YYYY')) {
            setSelectedYear({
              label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
              value: item.school_year_id,
            }) // set init year
            // setGrades(item.grades.split(','))
          }
          // set previous year
          if (parseInt(moment(item.date_begin).format('YYYY')) === parseInt(moment().format('YYYY')) - 1) {
            setPreviousYear(item) // set previous year
          }
        },
      )

      setSchoolYears(yearList.sort((a, b) => (a.label > b.label ? 1 : -1)))
    }
  }, [schoolYearData?.region?.SchoolYears])

  useEffect(() => {
    const yearItem = schoolYearsData.find(
      (item: { school_year_id: string }) =>
        item.school_year_id == (selectedYear?.value ? selectedYear.value.toString().split('-')[0] : null),
    )
    const newGrades = yearItem?.grades?.split(',') || []
    setGrades(newGrades.sort((a, b) => (parseInt(a) > parseInt(b) ? 1 : -1)))

    // set previous year
    const previousYear = parseInt(moment(yearItem?.date_begin).format('YYYY')) - 1
    const previousOb = schoolYearsData.find((item) => parseInt(moment(item.date_begin).format('YYYY')) === previousYear)
    setPreviousYear(previousOb)

    setFilter({})
  }, [selectedYear])

  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Filters
            filter={filter}
            setFilter={setFilter}
            partnerList={partnerList}
            previousPartnerList={previousPartnerList}
            selectedYear={selectedYear}
            gradesList={grades}
          />
        </Grid>
        <Grid item xs={12}>
          <EnrollmentSchoolTable
            filter={filter}
            setFilter={setFilter}
            partnerList={partnerList}
            schoolYears={schoolYears}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            previousYear={previousYear}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
