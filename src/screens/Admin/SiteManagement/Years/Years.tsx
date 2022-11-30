import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Box } from '@mui/material'
import { sortBy, toNumber } from 'lodash'
import moment from 'moment'
import { Prompt } from 'react-router-dom'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MYSQL_DATE_FORMAT } from '@mth/constants'
import { MthTitle } from '@mth/enums'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { PageHeader } from '../components/PageHeader'
import { createSchoolYearMutation, updateSchoolYearMutation } from '../services'
import { siteManagementClassess } from '../styles'
import { AddSchoolYearModal } from './AddSchoolYearModal'
import { PageContent } from './PageContent'
import { SchoolYearDropDown } from './SchoolYearDropDown'
import { SchoolYearItem } from './types'

const Years: React.FC = () => {
  const { me, setMe } = useContext(UserContext)
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [addSchoolYearDialogOpen, setAddSchoolYearDialogOpen] = useState<boolean>(false)
  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([])
  const [selectedYear, setSelectedYear] = useState<SchoolYear | undefined>(undefined)
  const [selectedYearId, setSelectedYearId] = useState<number>(0)
  const [enableSchedule, setEnableSchedule] = useState<boolean>(false)
  const [oldSelectedYearId, setOldSelectedYearId] = useState<number>(0)
  const [cloneSelectedYearId, setCloneSelectedYearId] = useState<number | undefined>(undefined)
  const [schoolYearItem, setSchoolYearItem] = useState<SchoolYearItem | undefined>(undefined)
  const [applicationItem, setApplicationItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midYearItem, setMidYearItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midYearScheduleItem, setMidYearScheduleItem] = useState<SchoolYearItem | undefined>(undefined)
  const [scheduleBuilderItem, setScheduleBuilderItem] = useState<SchoolYearItem | undefined>(undefined)
  const [homeroomResourceItem, setHomeroomResourceItem] = useState<SchoolYearItem | undefined>(undefined)
  const [directOrderItem, setDirectOrderItem] = useState<SchoolYearItem | undefined>(undefined)
  const [reimbursementItem, setReimbursementItem] = useState<SchoolYearItem | undefined>(undefined)
  const [customBuiltItem, setCustomBuiltItem] = useState<SchoolYearItem | undefined>(undefined)
  const [requireSoftwareItem, setRequireSoftwareItem] = useState<SchoolYearItem | undefined>(undefined)
  const [thirdPartyItem, setThirdPartyItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midDirectOrderItem, setMidDirectOrderItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midReimbursementItem, setMidReimbursementItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midCustomBuiltItem, setMidCustomBuiltItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midRequireSoftwareItem, setMidRequireSoftwareItem] = useState<SchoolYearItem | undefined>(undefined)
  const [midThirdPartyItem, setMidThirdPartyItem] = useState<SchoolYearItem | undefined>(undefined)
  const [secondSemesterItem, setSecondSemesterItem] = useState<SchoolYearItem | undefined>(undefined)
  const [addSchoolYears, setAddSchoolYears] = useState<DropDownItem[]>([])
  const [submitSave] = useMutation(updateSchoolYearMutation)
  const [submitCreate, {}] = useMutation(createSchoolYearMutation)

  const handleClickSave = async () => {
    if (selectedYearId) {
      const submittedResponse = await submitSave({
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
            homeroom_resource_open: homeroomResourceItem?.open,
            homeroom_resource_close: homeroomResourceItem?.close,
            direct_order_open: directOrderItem?.open,
            direct_order_close: directOrderItem?.close,
            reimbursement_open: reimbursementItem?.open,
            reimbursement_close: reimbursementItem?.close,
            custom_built_open: customBuiltItem?.open,
            custom_built_close: customBuiltItem?.close,
            require_software_open: requireSoftwareItem?.open,
            require_software_close: requireSoftwareItem?.close,
            third_party_open: thirdPartyItem?.open,
            third_party_close: thirdPartyItem?.close,
            mid_direct_order_open: midDirectOrderItem?.open,
            mid_direct_order_close: midDirectOrderItem?.close,
            mid_reimbursement_open: midReimbursementItem?.open,
            mid_reimbursement_close: midReimbursementItem?.close,
            mid_custom_built_open: midCustomBuiltItem?.open,
            mid_custom_built_close: midCustomBuiltItem?.close,
            mid_require_software_open: midRequireSoftwareItem?.open,
            mid_require_software_close: midRequireSoftwareItem?.close,
            mid_third_party_open: midThirdPartyItem?.open,
            mid_third_party_close: midThirdPartyItem?.close,
          },
        },
      })
      setSelectedYearId(+submittedResponse?.data?.updateSchoolYear.school_year_id)
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
            homeroom_resource_open: homeroomResourceItem?.open,
            homeroom_resource_close: homeroomResourceItem?.close,
            direct_order_open: directOrderItem?.open,
            direct_order_close: directOrderItem?.close,
            reimbursement_open: reimbursementItem?.open,
            reimbursement_close: reimbursementItem?.close,
            custom_built_open: customBuiltItem?.open,
            custom_built_close: customBuiltItem?.close,
            require_software_open: requireSoftwareItem?.open,
            require_software_close: requireSoftwareItem?.close,
            third_party_open: thirdPartyItem?.open,
            third_party_close: thirdPartyItem?.close,
            mid_direct_order_open: midDirectOrderItem?.open,
            mid_direct_order_close: midDirectOrderItem?.close,
            mid_reimbursement_open: midReimbursementItem?.open,
            mid_reimbursement_close: midReimbursementItem?.close,
            mid_custom_built_open: midCustomBuiltItem?.open,
            mid_custom_built_close: midCustomBuiltItem?.close,
            mid_require_software_open: midRequireSoftwareItem?.open,
            mid_require_software_close: midRequireSoftwareItem?.close,
            mid_third_party_open: midThirdPartyItem?.open,
            mid_third_party_close: midThirdPartyItem?.close,
            cloneSchoolYearId: cloneSelectedYearId || 0,
          },
          previousYearId: toNumber(sortBy(schoolYears, 'schoolYearClose').at(-1)?.school_year_id),
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
      setHomeroomResourceItem(undefined)
      setDirectOrderItem(undefined)
      setReimbursementItem(undefined)
      setCustomBuiltItem(undefined)
      setRequireSoftwareItem(undefined)
      setThirdPartyItem(undefined)
      setMidDirectOrderItem(undefined)
      setMidReimbursementItem(undefined)
      setMidCustomBuiltItem(undefined)
      setMidRequireSoftwareItem(undefined)
      setMidThirdPartyItem(undefined)
    } else if (val) {
      schoolYears.map((schoolYear) => {
        if (schoolYear.school_year_id == parseInt(val)) {
          setCloneSelectedYearId(Number(schoolYear.school_year_id))
          setSchoolYearItem({
            open: moment(schoolYear.date_begin).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.date_end).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setApplicationItem({
            open: moment(schoolYear.date_reg_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.date_reg_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setMidYearItem({
            open: moment(schoolYear.midyear_application_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.midyear_application_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
            status: schoolYear.midyear_application,
          })
          setMidYearScheduleItem({
            open: moment(schoolYear.midyear_schedule_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.midyear_schedule_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setScheduleBuilderItem({
            open: moment(schoolYear.schedule_builder_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.schedule_builder_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setSecondSemesterItem({
            open: moment(schoolYear.second_semester_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.second_semester_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setHomeroomResourceItem({
            open: moment(schoolYear.homeroom_resource_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.homeroom_resource_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setDirectOrderItem({
            open: moment(schoolYear.direct_order_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.direct_order_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setReimbursementItem({
            open: moment(schoolYear.reimbursement_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.reimbursement_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setCustomBuiltItem({
            open: moment(schoolYear.custom_built_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.custom_built_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setRequireSoftwareItem({
            open: moment(schoolYear.require_software_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.require_software_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setThirdPartyItem({
            open: moment(schoolYear.mid_third_party_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.mid_third_party_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setMidDirectOrderItem({
            open: moment(schoolYear.mid_direct_order_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.mid_direct_order_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setMidReimbursementItem({
            open: moment(schoolYear.mid_reimbursement_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.mid_reimbursement_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setMidCustomBuiltItem({
            open: moment(schoolYear.mid_custom_built_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.mid_custom_built_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setMidRequireSoftwareItem({
            open: moment(schoolYear.mid_require_software_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.mid_require_software_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
          setMidThirdPartyItem({
            open: moment(schoolYear.mid_third_party_open).add(1, 'years').format(MYSQL_DATE_FORMAT),
            close: moment(schoolYear.mid_third_party_close).add(1, 'years').format(MYSQL_DATE_FORMAT),
          })
        }
      })
    }
    setAddSchoolYearDialogOpen(false)
  }

  return (
    <Box sx={siteManagementClassess.base}>
      <Prompt
        when={isChanged}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
      <PageHeader title='Years' handleClickSave={handleClickSave} />
      <SchoolYearDropDown
        setSelectedYear={setSelectedYear}
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
        setHomeroomResourceItem={setHomeroomResourceItem}
        setDirectOrderItem={setDirectOrderItem}
        setReimbursementItem={setReimbursementItem}
        setCustomBuiltItem={setCustomBuiltItem}
        setRequireSoftwareItem={setRequireSoftwareItem}
        setThirdPartyItem={setThirdPartyItem}
        setMidDirectOrderItem={setMidDirectOrderItem}
        setMidReimbursementItem={setMidReimbursementItem}
        setMidCustomBuiltItem={setMidCustomBuiltItem}
        setMidRequireSoftwareItem={setMidRequireSoftwareItem}
        setMidThirdPartyItem={setMidThirdPartyItem}
        setSchoolYears={setSchoolYears}
        setAddSchoolYears={setAddSchoolYears}
      />
      <PageContent
        schoolYear={selectedYear}
        enableSchedule={enableSchedule}
        schoolYearItem={schoolYearItem}
        applicationItem={applicationItem}
        midYearItem={midYearItem}
        scheduleBuilderItem={scheduleBuilderItem}
        secondSemesterItem={secondSemesterItem}
        midYearScheduleItem={midYearScheduleItem}
        homeroomResourceItem={homeroomResourceItem}
        setMidYearItem={setMidYearItem}
        setApplicationItem={setApplicationItem}
        setSchoolYearItem={setSchoolYearItem}
        setScheduleBuilderItem={setScheduleBuilderItem}
        setSecondSemesterItem={setSecondSemesterItem}
        setMidYearScheduleItem={setMidYearScheduleItem}
        setHomeroomResourceItem={setHomeroomResourceItem}
        directOrderItem={directOrderItem}
        setDirectOrderItem={setDirectOrderItem}
        reimbursementItem={reimbursementItem}
        setReimbursementItem={setReimbursementItem}
        customBuiltItem={customBuiltItem}
        setCustomBuiltItem={setCustomBuiltItem}
        requireSoftwareItem={requireSoftwareItem}
        setRequireSoftwareItem={setRequireSoftwareItem}
        thirdPartyItem={thirdPartyItem}
        setThirdPartyItem={setThirdPartyItem}
        midDirectOrderItem={midDirectOrderItem}
        setMidDirectOrderItem={setMidDirectOrderItem}
        midReimbursementItem={midReimbursementItem}
        setMidReimbursementItem={setMidReimbursementItem}
        midCustomBuiltItem={midCustomBuiltItem}
        setMidCustomBuiltItem={setMidCustomBuiltItem}
        midRequireSoftwareItem={midRequireSoftwareItem}
        setMidRequireSoftwareItem={setMidRequireSoftwareItem}
        midThirdPartyItem={midThirdPartyItem}
        setMidThirdPartyItem={setMidThirdPartyItem}
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
