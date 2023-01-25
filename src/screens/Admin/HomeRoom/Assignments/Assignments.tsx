import React, { useState, useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Grid } from '@mui/material'
import moment from 'moment'
import { DropDownItem } from '@mth/components/DropDown/types'
import { AssignmentStatus } from '@mth/enums'
import { useProviders } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../../SiteManagement/services'
import { Assignment } from '../LearningLogs/Master/types'
import { Classes, Master } from '../LearningLogs/types'
import { GetMastersBySchoolYearIDGql } from '../services'
import { AssignmentTable } from './AssignmentTable/AssignmentTable'
import { Filters } from './Filters/Filters'
import { GetSchoolsPartner } from './services'
import { FilterVM, schoolYearDataType, PartnerEnrollmentType, OptionType } from './type'

export const Assignments: React.FC = () => {
  const [filter, setFilter] = useState<FilterVM>()
  const { me } = useContext(UserContext)

  const [schoolYears, setSchoolYears] = useState<DropDownItem[]>([])
  const [selectedYear, setSelectedYear] = useState<DropDownItem>()
  const [grades, setGrades] = useState<string[]>([])
  const [schoolYearsData, setSchoolYearsData] = useState<schoolYearDataType[]>([])
  const [partnerList, setPartnerList] = useState<OptionType[]>([])

  const [previousYear, setPreviousYear] = useState<schoolYearDataType>()

  const [specEd, setSpecEd] = useState<string[]>([])
  const [currentHomeroomes, setCurrentHomeroomes] = useState<OptionType[]>([])
  const [prevHomeroomes, setPrevHomeroomes] = useState<OptionType[]>([])
  const [providers, setProviders] = useState<OptionType[]>([])

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

  useEffect(() => {
    const list: OptionType[] = [
      {
        value: AssignmentStatus.UNASSIGNED.toLowerCase(),
        label: AssignmentStatus.UNASSIGNED,
      },
    ]
    schoolPartnerData?.getSchoolsOfEnrollmentByRegion
      ?.filter((el: PartnerEnrollmentType) => el.active === 1)
      .sort((a, b) => (a.abbreviation.toLowerCase() > b.abbreviation.toLowerCase() ? 1 : -1))
      .map((item: PartnerEnrollmentType) => {
        list.push({
          value: item.school_partner_id,
          label: item.abbreviation,
        })
      })
    setPartnerList(list)
  }, [schoolPartnerData])

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
          special_ed_options: string
          grades: string
        }): void => {
          yearList.push({
            label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
            value: item.school_year_id,
          })

          if (new Date() >= new Date(item.date_begin) && new Date() <= new Date(item.date_end)) {
            setSelectedYear({
              label: `${moment(item.date_begin).format('YYYY')}-${moment(item.date_end).format('YY')}`,
              value: item.school_year_id,
            }) // set init year

            setGrades(item.grades.split(',').sort((a, b) => (parseInt(a) > parseInt(b) ? 1 : -1)))

            setSpecEd(item.special_ed_options.split(','))
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

  const { loading: currentHomeroomLoading, data: currentHomeroomData } = useQuery(GetMastersBySchoolYearIDGql, {
    variables: {
      schoolYearId: selectedYear?.value,
    },
    skip: selectedYear?.value ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!currentHomeroomLoading && currentHomeroomData) {
      const currentHomes = []
      currentHomeroomData.getMastersBySchoolId.map((item: Master) => {
        let dueStatus = false
        if (item?.masterAssignments?.length && item?.masterAssignments?.length > 0) {
          item?.masterAssignments.map((assignment: Assignment) => {
            if (
              assignment.due_date < moment(`${moment().tz('America/Denver').format('yyyy-MM-DD hh:mm')}`).toISOString()
            ) {
              dueStatus = true
            }
          })
        }

        item?.masterClasses?.map((mclass: Classes) => {
          currentHomes.push({
            value: mclass.class_id,
            label: mclass.class_name,
            dueStatus,
          })
        })
      })
      setCurrentHomeroomes([
        {
          value: 'all',
          label: 'Select All',
        },
        {
          value: AssignmentStatus.UNASSIGNED.toLowerCase(),
          label: AssignmentStatus.UNASSIGNED,
        },
        ...currentHomes.sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1)),
      ])
    }
  }, [currentHomeroomData, currentHomeroomLoading])

  const { loading: prevHomeroomLoading, data: prevHomeroomData } = useQuery(GetMastersBySchoolYearIDGql, {
    variables: {
      schoolYearId: previousYear?.school_year_id,
    },
    skip: previousYear?.school_year_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!prevHomeroomLoading && prevHomeroomData) {
      const homerooms = []
      prevHomeroomData.getMastersBySchoolId.map((item: Master) => {
        item?.masterClasses?.map((mclass: Classes) => {
          homerooms.push({
            value: mclass.class_id,
            label: mclass.class_name,
          })
        })
      })
      homerooms.unshift(
        {
          value: 'all',
          label: 'Select All',
        },
        {
          value: AssignmentStatus.UNASSIGNED.toLowerCase(),
          label: AssignmentStatus.UNASSIGNED,
        },
      )

      setPrevHomeroomes(homerooms)
    }
  }, [prevHomeroomLoading, prevHomeroomData])

  const { providers: providerData } = useProviders(selectedYear?.value, '')

  useEffect(() => {
    if (providerData) {
      setProviders(
        (providerData || []).map((item) => {
          return {
            value: item.id,
            label: item.name,
          }
        }),
      )
    }
  }, [providerData])

  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <Filters
            filter={filter}
            setFilter={setFilter}
            partnerList={partnerList}
            previousPartnerList={[]}
            selectedYear={selectedYear}
            gradesList={grades}
            specEd={specEd}
            currentHomeroomes={currentHomeroomes}
            prevHomeroomes={prevHomeroomes}
            providers={providers}
            previousYear={previousYear}
          />
        </Grid>
        <Grid item xs={12}>
          <AssignmentTable
            filter={filter}
            setFilter={setFilter}
            partnerList={[]}
            schoolYears={schoolYears}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            previousYear={previousYear}
            currentHomeroomes={currentHomeroomes}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
