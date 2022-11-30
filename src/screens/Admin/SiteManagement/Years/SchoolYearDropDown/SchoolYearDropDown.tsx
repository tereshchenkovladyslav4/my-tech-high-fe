import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Stack } from '@mui/material'
import { sortBy } from 'lodash'
import moment from 'moment'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { deleteSchoolYearByIdMutation } from '@mth/graphql/mutation/schoolYear'
import { useSchoolYearsByRegionId } from '@mth/hooks'
import { SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { SchoolYearItem } from '../types'

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
  setHomeroomResourceItem: (value: SchoolYearItem | undefined) => void
  setDirectOrderItem: (value: SchoolYearItem | undefined) => void
  setReimbursementItem: (value: SchoolYearItem | undefined) => void
  setCustomBuiltItem: (value: SchoolYearItem | undefined) => void
  setRequireSoftwareItem: (value: SchoolYearItem | undefined) => void
  setThirdPartyItem: (value: SchoolYearItem | undefined) => void
  setMidDirectOrderItem: (value: SchoolYearItem | undefined) => void
  setMidReimbursementItem: (value: SchoolYearItem | undefined) => void
  setMidCustomBuiltItem: (value: SchoolYearItem | undefined) => void
  setMidRequireSoftwareItem: (value: SchoolYearItem | undefined) => void
  setMidThirdPartyItem: (value: SchoolYearItem | undefined) => void
  schoolYears: SchoolYear[]
  setSchoolYears: (value: SchoolYear[]) => void
  setAddSchoolYears: (value: DropDownItem[]) => void
  selectedYearId: number
  setSelectedYear: (value: SchoolYear) => void
}

export const SchoolYearDropDown: React.FC<SchoolYearDropDownProps> = ({
  setSelectedYear,
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
  setHomeroomResourceItem,
  setDirectOrderItem,
  setReimbursementItem,
  setCustomBuiltItem,
  setRequireSoftwareItem,
  setThirdPartyItem,
  setMidDirectOrderItem,
  setMidReimbursementItem,
  setMidCustomBuiltItem,
  setMidRequireSoftwareItem,
  setMidThirdPartyItem,
  selectedYearId,
  setSchoolYears,
  setAddSchoolYears,
  schoolYears,
}) => {
  const { me } = useContext(UserContext)
  const [years, setYears] = useState<DropDownItem[]>([])
  const [selectedSchoolYearId, setSelectedSchoolYearId] = useState<number>(0)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)
  const { schoolYears: schoolYearData, refetchSchoolYear } = useSchoolYearsByRegionId(Number(me?.selectedRegionId))

  const [deleteAction] = useMutation(deleteSchoolYearByIdMutation)

  const setAllBySchoolYear = (schoolYear: SchoolYear) => {
    setSelectedYear(schoolYear)
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
    setHomeroomResourceItem({
      open: schoolYear.homeroom_resource_open,
      close: schoolYear.homeroom_resource_close,
    })
    setDirectOrderItem({
      open: schoolYear.direct_order_open,
      close: schoolYear.direct_order_close,
    })
    setReimbursementItem({
      open: schoolYear.reimbursement_open,
      close: schoolYear.reimbursement_close,
    })
    setCustomBuiltItem({
      open: schoolYear.custom_built_open,
      close: schoolYear.custom_built_close,
    })
    setRequireSoftwareItem({
      open: schoolYear.require_software_open,
      close: schoolYear.require_software_close,
    })
    setThirdPartyItem({
      open: schoolYear.third_party_open,
      close: schoolYear.third_party_close,
    })
    setMidDirectOrderItem({
      open: schoolYear.mid_direct_order_open,
      close: schoolYear.mid_direct_order_close,
    })
    setMidReimbursementItem({
      open: schoolYear.mid_reimbursement_open,
      close: schoolYear.mid_reimbursement_close,
    })
    setMidCustomBuiltItem({
      open: schoolYear.mid_custom_built_open,
      close: schoolYear.mid_custom_built_close,
    })
    setMidRequireSoftwareItem({
      open: schoolYear.mid_require_software_open,
      close: schoolYear.mid_require_software_close,
    })
    setMidThirdPartyItem({
      open: schoolYear.mid_third_party_open,
      close: schoolYear.mid_third_party_close,
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
        if (schoolYear.school_year_id == val) {
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
  }

  const handleDeleteItem = (value: string | number | boolean) => {
    setSelectedSchoolYearId(Number(value))
    setShowDeleteModal(true)
  }

  const handleDeleteAction = async () => {
    await deleteAction({
      variables: {
        schoolYearId: selectedSchoolYearId,
      },
    })
    refetchSchoolYear()
  }

  const setDropYears = (schoolYearsArr: SchoolYear[]) => {
    const dropYears: DropDownItem[] = []
    const newSchoolYears: DropDownItem[] = [{ value: 'none', label: 'None' }]
    if (schoolYearsArr && schoolYearsArr.length > 0) {
      schoolYearsArr.forEach((schoolYear) => {
        if (
          !selectedYearId &&
          parseInt(moment(schoolYear.date_begin).format('YYYY')) >= parseInt(moment().format('YYYY')) &&
          parseInt(moment(schoolYear.date_end).format('YYYY')) <= parseInt(moment().format('YYYY')) + 1
        ) {
          setSelectedYearId(schoolYear.school_year_id)
          setEnableSchedule(schoolYear.schedule)
          setAllBySchoolYear(schoolYear)
        }
        dropYears.push({
          value: schoolYear.school_year_id + '',
          label: moment(schoolYear.date_begin).format('YYYY') + '-' + moment(schoolYear.date_end).format('YY'),
          hasDeleteIcon:
            parseInt(moment(schoolYear.date_begin).format('YYYY')) > parseInt(moment().format('YYYY')) ? true : false,
          handleDeleteItem: handleDeleteItem,
        })
        newSchoolYears.push({
          value: schoolYear.school_year_id + '',
          label: moment(schoolYear.date_begin).format('YYYY') + '-' + moment(schoolYear.date_end).format('YY'),
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
      const schoolYearsArr: SchoolYear[] = []
      let cnt = 0

      schoolYearData?.forEach((schoolYear: SchoolYear) => {
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
          setHomeroomResourceItem({
            open: schoolYear.homeroom_resource_open,
            close: schoolYear.homeroom_resource_close,
          })
          setDirectOrderItem({
            open: schoolYear.direct_order_open,
            close: schoolYear.direct_order_close,
          })
          setReimbursementItem({
            open: schoolYear.reimbursement_open,
            close: schoolYear.reimbursement_close,
          })
          setCustomBuiltItem({
            open: schoolYear.custom_built_open,
            close: schoolYear.custom_built_close,
          })
          setRequireSoftwareItem({
            open: schoolYear.require_software_open,
            close: schoolYear.require_software_close,
          })
          setThirdPartyItem({
            open: schoolYear.third_party_open,
            close: schoolYear.third_party_close,
          })
          setMidDirectOrderItem({
            open: schoolYear.mid_direct_order_open,
            close: schoolYear.mid_direct_order_close,
          })
          setMidReimbursementItem({
            open: schoolYear.mid_reimbursement_open,
            close: schoolYear.mid_reimbursement_close,
          })
          setMidCustomBuiltItem({
            open: schoolYear.mid_custom_built_open,
            close: schoolYear.mid_custom_built_close,
          })
          setMidRequireSoftwareItem({
            open: schoolYear.mid_require_software_open,
            close: schoolYear.mid_require_software_close,
          })
          setMidThirdPartyItem({
            open: schoolYear.mid_third_party_open,
            close: schoolYear.mid_third_party_close,
          })
          cnt++
        }
        schoolYearsArr.push(schoolYear)
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
      {showDeleteModal && (
        <CustomModal
          title='Delete'
          description='Are you sure you want to delete this year?'
          cancelStr='Cancel'
          confirmStr='Delete'
          backgroundColor='#FFFFFF'
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onConfirm={() => {
            handleDeleteAction()
            setShowDeleteModal(false)
          }}
        />
      )}
    </Stack>
  )
}
