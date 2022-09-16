import React, { useContext, useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import { sortBy } from 'lodash'
import moment from 'moment'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { SchoolYearRespnoseType, useSchoolYearsByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SchoolYearItem, SchoolYearType } from '../types'

type SchoolYearDropDownProps = {
  setSchoolYearItem: (value: SchoolYearItem | undefined) => void
  setApplicationItem: (value: SchoolYearItem | undefined) => void
  setMidYearItem: (value: SchoolYearItem | undefined) => void
  setSelectedYearId: (value: number) => void
  setOldSelectedYearId: (value: number) => void
  setEnableSchedule: (value: boolean) => void
  setAddSchoolYearDialogOpen: (value: boolean) => void
  setScheduleBuilderItem: (value: SchoolYearItem | undefined) => void
  setSecondSemesterItem: (value: SchoolYearItem | undefined) => void
  setMidYearScheduleItem: (value: SchoolYearItem | undefined) => void
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
  setScheduleBuilderItem,
  setSecondSemesterItem,
  setMidYearScheduleItem,
  setEnableSchedule,
  selectedYearId,
  setSchoolYears,
  setAddSchoolYears,
  schoolYears,
}) => {
  const { me } = useContext(UserContext)
  const [years, setYears] = useState<DropDownItem[]>([])
  const { schoolYears: schoolYearData } = useSchoolYearsByRegionId(Number(me?.selectedRegionId))

  const setAllBySchoolYear = (schoolYear: SchoolYearType) => {
    setEnableSchedule(schoolYear.schedule)
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
    setMidYearScheduleItem({
      open: schoolYear.midYearScheduleOpen,
      close: schoolYear.midYearScheduleClose,
    })
    setSecondSemesterItem({
      open: schoolYear.secondSemesterOpen,
      close: schoolYear.secondSemesterClose,
    })
    setScheduleBuilderItem({
      open: schoolYear.scheduleBuilderOpen,
      close: schoolYear.scheduleBuilderClose,
    })
  }

  const handleSelectYear = (val: number) => {
    setOldSelectedYearId(selectedYearId)
    setSelectedYearId(val)
    if (!val) {
      setAddSchoolYearDialogOpen(true)
      setEnableSchedule(false)
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
    setMidYearScheduleItem(undefined)
    setSecondSemesterItem(undefined)
    setScheduleBuilderItem(undefined)
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
          setEnableSchedule(schoolYear.schedule)
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
    if (schoolYearData) {
      const schoolYearsArr: SchoolYearType[] = []
      let cnt = 0

      schoolYearData?.forEach((schoolYear: SchoolYearRespnoseType) => {
        const schoolYearId = +schoolYear.school_year_id
        if (schoolYearId == selectedYearId) {
          setEnableSchedule(schoolYear.schedule)
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
          setMidYearScheduleItem({
            open: schoolYear.midyear_schedule_open,
            close: schoolYear.midyear_schedule_close,
          })
          setSecondSemesterItem({
            open: schoolYear.second_semester_open,
            close: schoolYear.second_semester_close,
          })
          setScheduleBuilderItem({
            open: schoolYear.schedule_builder_open,
            close: schoolYear.schedule_builder_close,
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
          midYearScheduleOpen: schoolYear.midyear_schedule_open,
          midYearScheduleClose: schoolYear.midyear_schedule_close,
          scheduleBuilderOpen: schoolYear.schedule_builder_open,
          scheduleBuilderClose: schoolYear.schedule_builder_close,
          secondSemesterOpen: schoolYear.second_semester_open,
          secondSemesterClose: schoolYear.second_semester_close,
          schedule: schoolYear.schedule,
        })
      })
      if (cnt == 0) {
        setAllDefault()
      }

      setSchoolYears(sortBy(schoolYearsArr, 'schoolYearOpen'))
    }
  }, [me?.selectedRegionId, schoolYearData])

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
