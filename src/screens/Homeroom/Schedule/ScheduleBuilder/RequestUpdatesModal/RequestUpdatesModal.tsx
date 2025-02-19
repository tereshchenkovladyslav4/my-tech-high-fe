import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { Form, Formik, FormikProps } from 'formik'
import * as yup from 'yup'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/types'
import { MthModal } from '@mth/components/MthModal/MthModal'
import { MthTitle } from '@mth/enums'
import { SEMESTER_TYPE } from '@mth/screens/Admin/Curriculum/types'
import RequestUpdatesForm from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/RequestUpdatesModal/RequestUpdatesForm'
import {
  PeriodSelect,
  RequestUpdatesModalProps,
} from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/RequestUpdatesModal/types'

const RequestUpdatesModal: React.FC<RequestUpdatesModalProps> = ({
  scheduleData,
  isSecondSemester,
  onSave,
  setShowEditModal,
}) => {
  const formRef = useRef<FormikProps<PeriodSelect>>(null)
  const [initialValues] = useState<PeriodSelect>({ PeriodIds: [] })
  const [periodsItems, setPeriodsItems] = useState<CheckBoxListVM[]>([])

  const handleCancel = () => {
    setShowEditModal(false)
  }

  const validationSchema = yup.object({
    PeriodIds: yup.array().min(1, 'Select a minimum of one').required('Required').nullable(),
  })

  const handleSave = async (value: PeriodSelect) => {
    setShowEditModal(false)
    onSave(value.PeriodIds.map((x) => +x))
  }

  useEffect(() => {
    if (scheduleData?.length) {
      if (isSecondSemester) {
        const filteredScheduleData = scheduleData.filter(
          (item) =>
            item.FirstSemesterSchedule?.Period?.semester !== SEMESTER_TYPE.NONE ||
            item.FirstSemesterSchedule.Title?.always_unlock ||
            item.FirstSemesterSchedule.Course?.always_unlock,
        )
        setPeriodsItems(
          filteredScheduleData.length
            ? filteredScheduleData.map((item) => ({
                label: `Period ${item.period} - ${item.Period?.category}`,
                value: item.period.toString(),
              }))
            : scheduleData.map((item) => ({
                label: `Period ${item.period} - ${item.Period?.category}`,
                value: item.period.toString(),
              })),
        )
      } else
        setPeriodsItems(
          scheduleData.map((item) => ({
            label: `Period ${item.period} - ${item.Period?.category}`,
            value: item.period.toString(),
          })),
        )
    }
  }, [scheduleData, isSecondSemester])

  return (
    <MthModal
      open={true}
      title={MthTitle.REQUEST_UPDATES}
      onClose={() => handleCancel()}
      onConfirm={() => {
        if (formRef.current) {
          formRef.current.handleSubmit()
        }
      }}
      confirmStr={MthTitle.REQUEST_UPDATES}
      confirmBtnType='roundPrimary'
      cancelBtnType='roundGray'
      noCloseOnBackdrop
      width={700}
    >
      <Box sx={{ pt: 6 }}>
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          <Form>
            <RequestUpdatesForm periodsItems={periodsItems} isSecondSemester={isSecondSemester} />
          </Form>
        </Formik>
      </Box>
    </MthModal>
  )
}

export default RequestUpdatesModal
