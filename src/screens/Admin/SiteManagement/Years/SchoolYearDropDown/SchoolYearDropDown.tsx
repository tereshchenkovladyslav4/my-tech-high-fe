import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Stack } from '@mui/material'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SchoolYearVM } from '@mth/screens/Admin/SchoolOfEnrollment/type'
import { getSchoolYearsByRegionId } from '../../services'
import { SchoolYearItem, SchoolYearType } from '../types'

type SchoolYearDropDownProps = {
  setSchoolYearItem: (value: SchoolYearItem | undefined) => void
  setApplicationItem: (value: SchoolYearItem | undefined) => void
  setMidYearItem: (value: SchoolYearItem | undefined) => void
  setSelectedYearId: (value: number) => void
  setOldSelectedYearId: (value: number) => void
  setAddSchoolYearDialogOpen: (value: boolean) => void
  schoolYears: SchoolYearType[]
  setSchoolYears: (value: SchoolYearType[]) => void
  setAddSchoolYears: (value: DropDownItem[]) => void
  selectedYearId: number
}

export const SchoolYearDropDown: React.FC<SchoolYearDropDownProps> = ({
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
}) => {
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
  const handleSelectYear = (val: number) => {
    setOldSelectedYearId(selectedYearId)
    setSelectedYearId(val)
    if (!val) {
      setAddSchoolYearDialogOpen(true)
      return
    }
    if (schoolYears && schoolYears.length > 0) {
      schoolYears.forEach((schoolYear) => {
        if (schoolYear.schoolYearId == val) {
          setAllBySchoolYear(schoolYear)
        }
      })
    }
  }

  const setAllDefault = () => {
    setSelectedYearId(0)
    setSchoolYearItem({
      open: undefined,
      close: undefined,
      status: false,
    })
    setApplicationItem(undefined)
    setMidYearItem(undefined)
  }

  const setDropYears = (schoolYearsArr: SchoolYearType[]) => {
    const dropYears: DropDownItem[] = []
    const newSchoolYears: DropDownItem[] = [{ value: 'none', label: 'None' }]
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach((schoolYear) => {
        if (
          !selectedYearId &&
          parseInt(moment(schoolYear.schoolYearOpen).format('YYYY')) >= parseInt(moment().format('YYYY')) &&
          parseInt(moment(schoolYear.schoolYearClose).format('YYYY')) <= parseInt(moment().format('YYYY')) + 1
        ) {
          setSelectedYearId(schoolYear.schoolYearId)
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
        value: 0,
        label: '+ Add School Year',
      })
    } else {
      dropYears.push({
        value: 0,
        label: '+ Add School Year',
      })
    }
    setYears(dropYears)
    setAddSchoolYears(newSchoolYears)
  }

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const schoolYearsArr: SchoolYearType[] = []
      let cnt = 0

      schoolYearData?.data?.region?.SchoolYears.forEach((schoolYear: SchoolYearVM) => {
        const schoolYearId = +schoolYear.school_year_id
        if (schoolYearId == selectedYearId) {
          setSchoolYearItem({
            open: schoolYear.date_begin,
            close: schoolYear.date_end,
          })
          setApplicationItem({
            open: schoolYear.date_reg_open,
            close: schoolYear.date_reg_close,
          })
          setMidYearItem({
            open: schoolYear.midyear_application_open,
            close: schoolYear.midyear_application_close,
            status: schoolYear.midyear_application,
          })
          cnt++
        }
        schoolYearsArr.push({
          schoolYearId: schoolYearId,
          schoolYearOpen: schoolYear.date_begin,
          schoolYearClose: schoolYear.date_end,
          applicationsOpen: schoolYear.date_reg_open,
          applicationsClose: schoolYear.date_reg_close,
          midYearOpen: schoolYear.midyear_application_open,
          midYearClose: schoolYear.midyear_application_close,
          midYearStatus: schoolYear.midyear_application,
        })
      })
      if (cnt == 0) {
        setAllDefault()
      }

      setSchoolYears(sortBy(schoolYearsArr, 'schoolYearOpen'))
    }
  }, [me?.selectedRegionId, schoolYearData?.data?.region?.SchoolYears])

  useEffect(() => {
    setDropYears(schoolYears)
  }, [schoolYears])

  return (
    <Stack direction='row' spacing={1} alignItems='center'>
      {years?.length && (
        <DropDown
          dropDownItems={years}
          placeholder={'Select Year'}
          defaultValue={selectedYearId}
          borderNone={true}
          setParentValue={(val) => {
            handleSelectYear(+val)
          }}
        />
      )}
    </Stack>
  )
}
