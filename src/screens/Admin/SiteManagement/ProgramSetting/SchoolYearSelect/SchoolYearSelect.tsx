import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Stack } from '@mui/material'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { ReduceFunds } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSchoolYearsByRegionId } from '../../services'
import { SchoolYears } from '../types'
import { SchoolYearSelectProps } from './SchoolYearSelectProps'

export const SchoolYearSelect: React.FC<SchoolYearSelectProps> = ({
  setSelectedYearId,
  setSpecialEd,
  setSpecialEdOptions,
  setEnroll,
  setBirthDate,
  setGrades,
  selectedYearId,
  setCounty,
  setSchoolDistrict,
  schoolYears,
  setSchoolYears,
  setSchedule,
  setDiplomaSeeking,
  setTestingPreference,
  setLearningLogs,
  setLearningLogsFirstSecondSemesters,
  setReimbursements,
  setRequireSoftware,
  setDirectOrders,
}) => {
  const { me } = useContext(UserContext)
  // const [schoolYears, setSchoolYears] = useState<SchoolYears[]>([])
  const [years, setYears] = useState<DropDownItem[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  const convertSpeicalEdOptions = (optionString: string) => {
    const temp: { option_value: string }[] = []
    if (optionString != '' && optionString != null) {
      const optionArray = optionString.split(',')
      optionArray.map((option) => {
        temp.push({
          option_value: option.trim(),
        })
      })
    }
    return temp
  }

  const handleSelectYear = (val = '') => {
    setSelectedYearId(val)
    if (schoolYears && schoolYears.length > 0) {
      schoolYears.forEach((schoolYear) => {
        if (val == schoolYear.schoolYearId.toString()) {
          setSpecialEd(schoolYear.specialEd)
          setEnroll(schoolYear.enrollmentPacket)
          setBirthDate(schoolYear.birthDateCut)
          setGrades(schoolYear.grades)
          setSpecialEdOptions(convertSpeicalEdOptions(schoolYear.specialEdOptions))
          setSchedule(schoolYear.schedule)
          setDiplomaSeeking(schoolYear.diplomaSeeking)
          setTestingPreference(schoolYear.testingPreference)
          setLearningLogs(schoolYear.learningLogs)
          setLearningLogsFirstSecondSemesters(schoolYear.learningLogsFirstSecondSemesters)
          setReimbursements(schoolYear.reimbursements)
          setRequireSoftware(schoolYear.requireSoftware)
          setDirectOrders(schoolYear.directOrders)
        }
      })
    }
  }

  const setDropYears = (schoolYearsArr: SchoolYears[]) => {
    const dropYears: DropDownItem[] = []
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach((schoolYear) => {
        if (
          new Date(schoolYear.schoolYearOpen) <= new Date() &&
          new Date(schoolYear.schoolYearClose) >= new Date() &&
          selectedYearId == ''
        ) {
          setSelectedYearId(schoolYear.schoolYearId.toString())
          setSpecialEd(schoolYear.specialEd)
          setSpecialEdOptions(convertSpeicalEdOptions(schoolYear.specialEdOptions))
          setEnroll(schoolYear.enrollmentPacket)
          setBirthDate(schoolYear.birthDateCut)
          setGrades(schoolYear.grades)
          setSchedule(schoolYear.schedule)
          setDiplomaSeeking(schoolYear.diplomaSeeking)
          setTestingPreference(schoolYear.testingPreference)
          setLearningLogs(schoolYear.learningLogs)
          setLearningLogsFirstSecondSemesters(schoolYear.learningLogsFirstSecondSemesters)
          setReimbursements(schoolYear.reimbursements)
          setRequireSoftware(schoolYear.requireSoftware)
          setDirectOrders(schoolYear.directOrders)
        }
        dropYears.push({
          value: `${schoolYear.schoolYearId}`,
          label: `${moment(schoolYear.schoolYearOpen).format('YYYY')}-${moment(schoolYear.schoolYearClose).format(
            'YY',
          )}`,
        })
      })
    }
    setYears(dropYears)
  }

  useEffect(() => {
    if (schoolYearData && schoolYearData?.data?.region) {
      setCounty({
        name: schoolYearData?.data?.region.county_file_name,
        path: schoolYearData?.data?.region.county_file_path,
        file: undefined,
      })
      setSchoolDistrict({
        name: schoolYearData?.data?.region.school_district_file_name,
        path: schoolYearData?.data?.region.school_district_file_path,
        file: undefined,
      })
      let cnt = 0
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears?.map(
          (schoolYear: {
            school_year_id: string
            special_ed: boolean
            special_ed_options: string
            enrollment_packet: boolean
            birth_date_cut: string
            grades: string
            date_begin: Date
            date_end: Date
            schedule: boolean
            diploma_seeking: boolean
            testing_preference: boolean
            learning_logs: boolean
            learning_logs_first_second_semesters: boolean
            reimbursements: ReduceFunds
            require_software: boolean
            direct_orders: ReduceFunds
          }) => {
            if (selectedYearId == schoolYear?.school_year_id) {
              setSpecialEd(schoolYear?.special_ed)
              setSpecialEdOptions(convertSpeicalEdOptions(schoolYear.special_ed_options))
              setEnroll(schoolYear.enrollment_packet)
              setBirthDate(schoolYear.birth_date_cut)
              setGrades(schoolYear.grades)
              setSchedule(schoolYear.schedule)
              setDiplomaSeeking(schoolYear.diploma_seeking)
              setTestingPreference(schoolYear.testing_preference)
              setLearningLogs(schoolYear.learning_logs)
              setLearningLogsFirstSecondSemesters(schoolYear.learning_logs_first_second_semesters)
              setReimbursements(schoolYear.reimbursements)
              setRequireSoftware(schoolYear.require_software)
              setDirectOrders(schoolYear.direct_orders)
              cnt++
            }
            return {
              schoolYearId: schoolYear.school_year_id,
              schoolYearOpen: schoolYear.date_begin,
              schoolYearClose: schoolYear.date_end,
              grades: schoolYear.grades,
              birthDateCut: schoolYear.birth_date_cut,
              specialEd: schoolYear.special_ed,
              specialEdOptions: schoolYear.special_ed_options,
              enrollmentPacket: schoolYear.enrollment_packet,
              schedule: schoolYear.schedule,
              diplomaSeeking: schoolYear.diploma_seeking,
              testingPreference: schoolYear.testing_preference,
              learningLogs: schoolYear.learning_logs,
              learningLogsFirstSecondSemesters: schoolYear.learning_logs_first_second_semesters,
              reimbursements: schoolYear.reimbursements,
              requireSoftware: schoolYear.require_software,
              directOrders: schoolYear.direct_orders,
            }
          },
        ).sort((a: SchoolYears, b: SchoolYears) => {
          if (new Date(a.schoolYearOpen) > new Date(b.schoolYearOpen)) return 1
          else if (new Date(a.schoolYearOpen) == new Date(b.schoolYearOpen)) return 0
          else return -1
        }),
      )
      if (cnt == 0) {
        setSelectedYearId('')
        setSpecialEd(false)
        setSpecialEdOptions([])
        setEnroll(false)
        setBirthDate('')
        setGrades('')
        setDiplomaSeeking(false)
        setSchedule(false)
        setTestingPreference(false)
        setLearningLogs(undefined)
        setLearningLogsFirstSecondSemesters(false)
        setReimbursements(undefined)
        setRequireSoftware(false)
        setDirectOrders(undefined)
      }
    }
  }, [me?.selectedRegionId, schoolYearData?.data?.region])

  useEffect(() => {
    setDropYears(schoolYears)
  }, [schoolYears])
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <DropDown
        dropDownItems={years}
        placeholder={'Select Year'}
        defaultValue={selectedYearId}
        borderNone={true}
        setParentValue={(val) => {
          handleSelectYear(`${val}`)
        }}
      />
    </Stack>
  )
}
