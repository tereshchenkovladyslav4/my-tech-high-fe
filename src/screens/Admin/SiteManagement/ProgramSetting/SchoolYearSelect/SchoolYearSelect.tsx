import React, { useContext, useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { SchoolYearSelectProps } from './SchoolYearSelectProps'
import { DropDown } from '../../components/DropDown/DropDown'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { SchoolYears } from '../types'
import { DropDownItem } from '../../components/DropDown/types'
import moment from 'moment'
import { useQuery } from '@apollo/client'
import { getSchoolYearsByRegionId } from '../../services'

export default function SchoolYearSelect({
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
  setSchoolYears
}: SchoolYearSelectProps) {
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

  const convertSpeicalEdOptions = (optionString) => {    
    var temp = []
    if (optionString != '' && optionString != null) {
      const optionArray = optionString.split(',');
      optionArray.map((option) => {
        temp.push({
          option_value: option.trim()
        });
      });
    }
    return temp;
  }

  const handleSelectYear = (val: string = '') => {
    setSelectedYearId(val)
    if (schoolYears && schoolYears.length > 0) {
      schoolYears.forEach((schoolYear) => {
        if (val == schoolYear.schoolYearId.toString()) {
          setSpecialEd(schoolYear.specialEd)
          setEnroll(schoolYear.enrollmentPacket)
          setBirthDate(schoolYear.birthDateCut)
          setGrades(schoolYear.grades)
          setSpecialEdOptions(convertSpeicalEdOptions(schoolYear.specialEdOptions))
        }
      })
    }
  }

  const setDropYears = (schoolYearsArr: SchoolYears[]) => {
    let dropYears: DropDownItem[] = []
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach((schoolYear) => {
        if (
          parseInt(moment(schoolYear.schoolYearOpen).format('YYYY')) >= parseInt(moment().format('YYYY')) &&
          parseInt(moment(schoolYear.schoolYearClose).format('YYYY')) <= parseInt(moment().format('YYYY')) + 1 &&
          selectedYearId == ''
        ) {
          setSelectedYearId(schoolYear.schoolYearId.toString())
          setSpecialEd(schoolYear.specialEd)
          setSpecialEdOptions(convertSpeicalEdOptions(schoolYear.specialEdOptions))
          setEnroll(schoolYear.enrollmentPacket)
          setBirthDate(schoolYear.birthDateCut)
          setGrades(schoolYear.grades)
        }
        dropYears.push({
          value: `${schoolYear.schoolYearId}`,
          label: `${moment(schoolYear.schoolYearOpen).format('YY')} - ${moment(schoolYear.schoolYearClose).format(
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
        SchoolYears?.map((schoolYear: any) => {
          if (selectedYearId == schoolYear.school_year_id) {
            setSpecialEd(schoolYear.special_ed)
            setSpecialEdOptions(convertSpeicalEdOptions(schoolYear.special_ed_options))
            setEnroll(schoolYear.enrollment_packet)
            setBirthDate(schoolYear.birth_date_cut)
            setGrades(schoolYear.grades)
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
          }
        }).sort((a: SchoolYears, b: SchoolYears) => {
          if (new Date(a.schoolYearOpen) > new Date(b.schoolYearOpen)) return 1
          else if (new Date(a.schoolYearOpen) == new Date(b.schoolYearOpen)) return 0
          else return -1
        }),
      )
      if (cnt == 0) {
        setSelectedYearId('')
        setSpecialEd(false)
        setSpecialEdOptions([]);
        setEnroll(false)
        setBirthDate('')
        setGrades('')
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
        sx={{ width: '200px' }}
        borderNone={true}
        setParentValue={(val) => {
          handleSelectYear(val)
        }}
      />
    </Stack>
  )
}
