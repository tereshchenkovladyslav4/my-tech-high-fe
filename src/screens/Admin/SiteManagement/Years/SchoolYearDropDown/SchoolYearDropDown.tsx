import React, { useContext, useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { DropDown } from '../../components/DropDown/DropDown'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { DropDownItem } from '../../components/DropDown/types'
import moment from 'moment'
import { useQuery } from '@apollo/client'
import { getSchoolYearsByRegionId } from '../../services'
import { SchoolYearItem, SchoolYearType } from '../types'

type SchoolYearDropDownProps = {
  setSchoolYearItem: (value: SchoolYearItem | undefined) => void
  setApplicationItem: (value: SchoolYearItem | undefined) => void
  setMidYearItem: (value: SchoolYearItem | undefined) => void
  setSelectedYearId: (value: string) => void
  setOldSelectedYearId: (value: string) => void
  setAddSchoolYearDialogOpen: (value: boolean) => void
  schoolYears: SchoolYearType[]
  setSchoolYears: (value: SchoolYearType[]) => void
  setAddSchoolYears: (value: DropDownItem[]) => void
  selectedYearId: string
}

export default function SchoolYearDropDown({
  setSelectedYearId,
  setSchoolYearItem,
  setApplicationItem,
  setMidYearItem,
  setOldSelectedYearId,
  setAddSchoolYearDialogOpen,
  selectedYearId,
  setSchoolYears,
  setAddSchoolYears,
  schoolYears,
}: SchoolYearDropDownProps) {
  const { me } = useContext(UserContext)
  const [years, setYears] = useState<DropDownItem[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })
  const setAllBySchoolYear = (schoolYear: SchoolYearType) => {
    setSchoolYearItem({
      open: schoolYear.schoolYearOpen,
      close: schoolYear.schoolYearClose,
    })
    setApplicationItem({
      open: schoolYear.applicationsOpen,
      close: schoolYear.applicationsClose,
    })
    setMidYearItem({
      open: schoolYear.midYearOpen,
      close: schoolYear.midYearClose,
      status: schoolYear.midYearStatus,
    })
  }
  const handleSelectYear = (val: string) => {
    setOldSelectedYearId(selectedYearId)
    setSelectedYearId(val)
    if (val == 'add') {
      setAddSchoolYearDialogOpen(true)
      return
    }
    if (schoolYears && schoolYears.length > 0) {
      schoolYears.forEach((schoolYear) => {
        if (schoolYear.schoolYearId == parseInt(val)) {
          setAllBySchoolYear(schoolYear)
        }
      })
    }
  }

  const setAllDefault = () => {
    setSelectedYearId('')
    setSchoolYearItem(undefined)
    setApplicationItem(undefined)
    setMidYearItem(undefined)
  }

  const setDropYears = (schoolYearsArr: SchoolYearType[]) => {
    const dropYears: DropDownItem[] = []
    const newSchoolYears: DropDownItem[] = [{ value: 'none', label: 'None' }]
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach((schoolYear) => {
        if (
          selectedYearId == '' &&
          parseInt(moment(schoolYear.schoolYearOpen).format('YYYY')) >= parseInt(moment().format('YYYY')) &&
          parseInt(moment(schoolYear.schoolYearClose).format('YYYY')) <= parseInt(moment().format('YYYY')) + 1
        ) {
          setSelectedYearId(schoolYear.schoolYearId.toString())
          setAllBySchoolYear(schoolYear)
        }
        dropYears.push({
          value: schoolYear.schoolYearId + '',
          label:
            moment(schoolYear.schoolYearOpen).format('YYYY') + '-' + moment(schoolYear.schoolYearClose).format('YY'),
        })
        newSchoolYears.push({
          value: schoolYear.schoolYearId + '',
          label:
            moment(schoolYear.schoolYearOpen).format('YYYY') + '-' + moment(schoolYear.schoolYearClose).format('YY'),
        })
      })
      dropYears.push({
        value: 'add',
        label: '+ Add School Year',
      })
    } else {
      dropYears.push({
        value: 'add',
        label: '+ Add School Year',
      })
    }
    setYears(dropYears)
    setAddSchoolYears(newSchoolYears)
  }

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      let schoolYearsArr: SchoolYearType[] = []
      let cnt = 0

      schoolYearData?.data?.region?.SchoolYears.forEach((schoolYear: any) => {
        const schoolYear_date_begin = moment(schoolYear.date_begin?.substring(0, 10)).toISOString()
        const schoolYear_date_end = moment(schoolYear.date_end?.substring(0, 10)).toISOString()
        const schoolYear_date_reg_open = moment(schoolYear.date_reg_open?.substring(0, 10)).toISOString()
        const schoolYear_date_reg_close = moment(schoolYear.date_reg_close?.substring(0, 10)).toISOString()
        const schoolYear_midyear_application_open = moment(
          schoolYear.midyear_application_open?.substring(0, 10),
        ).toISOString()
        const schoolYear_midyear_application_close = moment(
          schoolYear.midyear_application_close?.substring(0, 10),
        ).toISOString()

        if (schoolYear.school_year_id == selectedYearId) {
          setSchoolYearItem({
            open: schoolYear_date_begin,
            close: schoolYear_date_end,
          })
          setApplicationItem({
            open: schoolYear_date_reg_open,
            close: schoolYear_date_reg_close,
          })
          setMidYearItem({
            open: schoolYear_midyear_application_open,
            close: schoolYear_midyear_application_close,
            status: schoolYear.midyear_application,
          })
          cnt++
        }
        schoolYearsArr.push({
          schoolYearId: schoolYear.school_year_id,
          schoolYearOpen: schoolYear_date_begin,
          schoolYearClose: schoolYear_date_end,
          applicationsOpen: schoolYear_date_reg_open,
          applicationsClose: schoolYear_date_reg_close,
          midYearOpen: schoolYear_midyear_application_open,
          midYearClose: schoolYear_midyear_application_close,
          midYearStatus: schoolYear.midyear_application,
        })
      })
      if (cnt == 0) {
        setAllDefault()
      }

      setSchoolYears(
        schoolYearsArr.sort((a, b) => {
          if (new Date(a.schoolYearOpen) > new Date(b.schoolYearOpen)) return 1
          else if (new Date(a.schoolYearOpen) == new Date(b.schoolYearOpen)) return 0
          else return -1
        }),
      )
    }
  }, [me?.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    setDropYears(schoolYears)
  }, [schoolYears])
  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      <DropDown
        dropDownItems={years}
        placeholder={'Select Year'}
        defaultValue={selectedYearId}
        sx={{ minWidth: '250px', textAlign: 'center' }}
        borderNone={true}
        setParentValue={(val) => {
          handleSelectYear(val)
        }}
      />
    </Stack>
  )
}
