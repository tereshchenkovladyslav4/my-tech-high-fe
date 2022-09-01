import React, { useState, useContext, useEffect, FunctionComponent } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Grid } from '@mui/material'
import moment from 'moment'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import { DropDownItem } from '../SiteManagement/components/DropDown/types'
import { getSchoolYearsByRegionId } from '../SiteManagement/services'
import { Filters } from './Filters/Filters'
import { EnrollmentSchoolTable } from './SchoolEnrollmentTable/SchoolEnrollmentTable'
import { GetSchoolsPartner } from './services'
import { FilterVM, PartnerItem, schoolYearDataType } from './type'

type SchoolPartner = {
  value: number
  label: string
  abb: string
}
export const SchoolOfEnrollment: FunctionComponent = () => {
  const [filter, setFilter] = useState<FilterVM>()
  const { me } = useContext(UserContext)
  const [partnerList, setPartnerList] = useState<Array<PartnerItem>>([])
  const [previousPartnerList, setPreviousPartnerList] = useState<Array<PartnerItem>>([])

  const [schoolYears, setSchoolYears] = useState<DropDownItem[]>([])
  const [selectedYear, setSelectedYear] = useState<DropDownItem>()
  const [grades, setGrades] = useState<string[] | number[]>([])
  const [schoolYearsData, setSchoolYearsData] = useState<schoolYearDataType[]>([])
  const [previousYear, setPreviousYear] = useState<schoolYearDataType>({})

  const { data: schoolPartnerData } = useQuery(GetSchoolsPartner, {
    variables: {
      schoolPartnerArgs: {
        region_id: me?.selectedRegionId,
        school_year_id: selectedYear?.value.split('-')[0],
        sort: {
          column: 'name',
          direction: 'ASC',
        },
      },
    },
    skip: !selectedYear,
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

  useEffect(() => {
    const list: SchoolPartner[] = []
    previousSchoolPartnerData?.getSchoolsOfEnrollmentByRegion
      ?.filter((el) => el.active === 1)
      .map((item) => {
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
      const yearList = []
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
            label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YY')}`,
            value: item.school_year_id,
          })

          if (moment(item.date_begin).format('YYYY') === moment().format('YYYY')) {
            setSelectedYear({
              label: `${moment(item.date_begin).format('YYYY')} - ${moment(item.date_end).format('YY')}`,
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
      setFilter({
        schoolYear: yearList[0]?.label,
      })
    }
  }, [schoolYearData?.region?.SchoolYears])

  useEffect(() => {
    const yearItem = schoolYearsData.find(
      (item: { school_year_id: string }) => item.school_year_id == selectedYear?.value?.split('-')[0],
    )
    const newGrades = yearItem?.grades?.split(',')
    setGrades(newGrades?.sort((a, b) => (parseInt(a) > parseInt(b) ? 1 : -1)))

    // set previous year
    const previuosYear = parseInt(moment(yearItem?.date_begin).format('YYYY')) - 1
    const previousOb = schoolYearsData.find((item) => parseInt(moment(item.date_begin).format('YYYY')) === previuosYear)
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
            schoolYears={schoolYears}
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
