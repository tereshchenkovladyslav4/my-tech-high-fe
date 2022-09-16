import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Box } from '@mui/material'
import { sortBy, toNumber } from 'lodash'
import moment from 'moment'
import { Prompt } from 'react-router-dom'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MYSQL_DATE_FORMAT } from '@mth/constants'
import { MthTitle } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { PageHeader } from '../components/PageHeader'
import { createSchoolYearMutation, updateSchoolYearMutation } from '../services'
import { siteManagementClassess } from '../styles'
import { AddSchoolYearModal } from './AddSchoolYearModal'
import { PageContent } from './PageContent'
import { SchoolYearDropDown } from './SchoolYearDropDown'
import { SchoolYearItem, SchoolYearType } from './types'

const Years: React.FC = () => {
  const { me, setMe } = useContext(UserContext)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [addSchoolYearDialogOpen, setAddSchoolYearDialogOpen] = useState<boolean>(false)
  const [schoolYears, setSchoolYears] = useState<SchoolYearType[]>([])
  const [selectedYearId, setSelectedYearId] = useState<number>(0)
  const [enableSchedule, setEnableSchedule] = useState<boolean>(false)
  const [oldSelectedYearId, setOldSelectedYearId] = useState<number>(0)
  const [cloneSelectedYearId, setCloneSelectedYearId] = useState<number | undefined>(undefined)
  const [schoolYearItem, setSchoolYearItem] = useState<SchoolYearItem | undefined>(undefined)
  const [applicationItem, setApplicationItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midYearItem, setMidYearItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midYearScheduleItem, setMidYearScheduleItem] = useState<SchoolYearItem | undefined>(undefined)
  const [scheduleBuilderItem, setScheduleBuilderItem] = useState<SchoolYearItem | undefined>(undefined)
  const [secondSemesterItem, setSecondSemesterItem] = useState<SchoolYearItem | undefined>(undefined)
  const [addSchoolYears, setAddSchoolYears] = useState<DropDownItem[]>([])
  const [submitSave] = useMutation(updateSchoolYearMutation)
  const [submitCreate, {}] = useMutation(createSchoolYearMutation)

  const handleClickSave = async () => {
    if (selectedYearId) {
      const submitedResponse = await submitSave({
        variables: {
          updateSchoolYearInput: {
            school_year_id: selectedYearId,
            date_begin: schoolYearItem?.open,
            date_end: schoolYearItem?.close,
            date_reg_open: applicationItem?.open,
            date_reg_close: applicationItem?.close,
            midyear_application: midYearItem?.status ? 1 : 0,
            midyear_application_open: midYearItem?.open,
            midyear_application_close: midYearItem?.close,
            schedule_builder_open: scheduleBuilderItem?.open,
            schedule_builder_close: scheduleBuilderItem?.close,
            second_semester_open: secondSemesterItem?.open,
            second_semester_close: secondSemesterItem?.close,
            midyear_schedule_open: midYearScheduleItem?.open,
            midyear_schedule_close: midYearScheduleItem?.close,
          },
        },
      })
      setSelectedYearId(+submitedResponse?.data?.updateSchoolYear.school_year_id)
    } else {
      const submittedCreateResponse = await submitCreate({
        variables: {
          createSchoolYearInput: {
            RegionId: me?.selectedRegionId,
            date_begin: schoolYearItem?.open,
            date_end: schoolYearItem?.close,
            date_reg_open: applicationItem?.open,
            date_reg_close: applicationItem?.close,
            midyear_application: midYearItem?.status ? 1 : 0,
            midyear_application_open: midYearItem?.open,
            midyear_application_close: midYearItem?.close,
            cloneSchoolYearId: cloneSelectedYearId || null,
          },
          previousYearId: toNumber(sortBy(schoolYears, 'schoolYearClose').at(-1)?.schoolYearId),
        },
      })
      setSelectedYearId(+submittedCreateResponse?.data?.createSchoolYear.school_year_id)
    }
    if (me) setMe({ ...me, selectedRegionId: me.selectedRegionId })
    setIsChanged(false)
  }

  const handleParentClose = () => {
    setAddSchoolYearDialogOpen(false)
    setSelectedYearId(oldSelectedYearId)
  }

  const handleParentSave = (val: string) => {
    if (val && val == 'none') {
      setCloneSelectedYearId(undefined)
      setSchoolYearItem(undefined)
      setApplicationItem(undefined)
      setMidYearItem(undefined)
      setMidYearScheduleItem(undefined)
      setScheduleBuilderItem(undefined)
      setSecondSemesterItem(undefined)
    } else if (val) {
      schoolYears.map((schoolYear) => {
        if (schoolYear.schoolYearId == parseInt(val)) {
          setCloneSelectedYearId(Number(schoolYear.schoolYearId))
          setSchoolYearItem({
            open: moment(schoolYear.schoolYearOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.schoolYearClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setApplicationItem({
            open: moment(schoolYear.applicationsOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.applicationsClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setMidYearItem({
            open: moment(schoolYear.midYearOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.midYearClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
            status: schoolYear.midYearStatus,
          })
          setMidYearScheduleItem({
            open: moment(schoolYear.midYearScheduleOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.midYearScheduleClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setScheduleBuilderItem({
            open: moment(schoolYear.scheduleBuilderOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.scheduleBuilderClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setSecondSemesterItem({
            open: moment(schoolYear.secondSemesterOpen).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.secondSemesterClose).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
        }
      })
    }
    setAddSchoolYearDialogOpen(false)
  }

  return (
    <Box sx={siteManagementClassess.base}>
      <Prompt
        when={isChanged ? true : false}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
      <PageHeader title='Years' handleClickSave={handleClickSave} />
      <SchoolYearDropDown
        selectedYearId={selectedYearId}
        schoolYears={schoolYears}
        setSelectedYearId={setSelectedYearId}
        setEnableSchedule={setEnableSchedule}
        setSchoolYearItem={setSchoolYearItem}
        setApplicationItem={setApplicationItem}
        setScheduleBuilderItem={setScheduleBuilderItem}
        setSecondSemesterItem={setSecondSemesterItem}
        setMidYearScheduleItem={setMidYearScheduleItem}
        setMidYearItem={setMidYearItem}
        setOldSelectedYearId={setOldSelectedYearId}
        setAddSchoolYearDialogOpen={setAddSchoolYearDialogOpen}
        setSchoolYears={setSchoolYears}
        setAddSchoolYears={setAddSchoolYears}
      />
      <PageContent
        enableSchedule={enableSchedule}
        schoolYearItem={schoolYearItem}
        applicationItem={applicationItem}
        midYearItem={midYearItem}
        scheduleBuilderItem={scheduleBuilderItem}
        secondSemesterItem={secondSemesterItem}
        midYearScheduleItem={midYearScheduleItem}
        setMidYearItem={setMidYearItem}
        setApplicationItem={setApplicationItem}
        setSchoolYearItem={setSchoolYearItem}
        setScheduleBuilderItem={setScheduleBuilderItem}
        setSecondSemesterItem={setSecondSemesterItem}
        setMidYearScheduleItem={setMidYearScheduleItem}
        setIsChanged={setIsChanged}
      />
      <AddSchoolYearModal
        addSchoolYears={addSchoolYears}
        addSchoolYearDialogOpen={addSchoolYearDialogOpen}
        handleParentClose={handleParentClose}
        handleParentSave={handleParentSave}
      />
    </Box>
  )
}

export { Years as default }
