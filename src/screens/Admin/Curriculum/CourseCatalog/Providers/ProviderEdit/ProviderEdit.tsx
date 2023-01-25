import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { RICH_TEXT_VALID_MIN_LENGTH } from '@mth/constants'
import { MthColor, MthTitle, ReduceFunds } from '@mth/enums'
import { usePeriods } from '@mth/hooks'
import { Period } from '@mth/models'
import { defaultProviderFormData } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/defaultValues'
import ProviderForm from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/ProviderEdit/ProviderForm'
import { createOrUpdateProviderMutation } from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import SaveCancelComponent from '../../Components/SaveCancelComponent/SaveCancelComponent'
import { ProviderEditProps, Provider } from '../types'

const ProviderEdit: React.FC<ProviderEditProps> = ({
  schoolYearData,
  schoolYearId,
  item,
  providers,
  refetch,
  setShowEditModal,
}) => {
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<Provider>(defaultProviderFormData)
  const [submitSave, {}] = useMutation(createOrUpdateProviderMutation)

  const { checkBoxItems: periodsItems } = usePeriods(
    +schoolYearId,
    undefined,
    undefined,
    (item?.Periods || []).reduce((acc: number[], cur: Period) => acc.concat([cur.id]), []),
  )

  const handleCancel = () => {
    if (isChanged) {
      setShowCancelModal(true)
    } else {
      setShowEditModal(false)
    }
  }

  const validationSchema = yup.object({
    name: yup.string().required('Required').nullable(),
    reduce_funds: yup.string().required('Required').nullable(),
    price: yup
      .number()
      .when('reduce_funds', {
        is: (reduce_funds: ReduceFunds) =>
          reduce_funds == ReduceFunds.TECHNOLOGY || reduce_funds == ReduceFunds.SUPPLEMENTAL,
        then: yup.number().required('Required').positive('Should be greater than 0').nullable(),
      })
      .nullable(),
    reduce_funds_notification: yup
      .string()
      .when('reduce_funds', {
        is: (reduce_funds: ReduceFunds) =>
          reduce_funds == ReduceFunds.TECHNOLOGY || reduce_funds == ReduceFunds.SUPPLEMENTAL,
        then: yup.string().required('Required').min(RICH_TEXT_VALID_MIN_LENGTH, 'Required').nullable(),
      })
      .nullable(),
    PeriodIds: yup
      .array()
      .when('multiple_periods', {
        is: true,
        then: yup.array().min(2, 'Select a minimum of two').required('Required'),
      })
      .nullable(),
  })

  const onSave = async (value: Provider) => {
    setIsSubmitted(true)
    const dataToSave = {
      id: Number(value.id),
      school_year_id: +schoolYearId,
      name: value.name,
      is_display: value.is_display,
      reduce_funds: value.reduce_funds,
      price: value.price || null,
      reduce_funds_notification: value.reduce_funds_notification,
      multiple_periods: value.multiple_periods,
      multi_periods_notification: value.multi_periods_notification,
      periods: value.PeriodIds?.join(','),
    }

    const priorityIndex = [...(providers ? providers : []), dataToSave]
      .sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1
        }

        return 0
      })
      .findIndex((obj) => obj.name.includes(value.name))

    await submitSave({
      variables: {
        createProviderInput: {
          ...dataToSave,
          ...(!value.id &&
            (providers?.filter((obj) => obj.priority)?.length ?? 0) > 1 && { priority: priorityIndex + 1 }),
        },
      },
    })
      .then(() => {
        setIsSubmitted(false)
        setIsChanged(false)
        refetch()
        setShowEditModal(false)
      })
      .catch(() => {
        setIsSubmitted(false)
      })
  }

  useEffect(() => {
    if (item?.id)
      setInitialValues({
        ...item,
        PeriodIds: item.Periods.map((x: Period) => x.id.toString()),
        price: item.price || null,
      })
    else
      setInitialValues({
        ...defaultProviderFormData,
        reduce_funds: schoolYearData?.reimbursements || ReduceFunds.NONE,
      })
  }, [item, schoolYearData])

  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '630px',
          height: 'auto',
          backgroundColor: MthColor.WHITE,
          borderRadius: 2,
          p: 6,
        }}
      >
        <Prompt
          when={isChanged}
          message={JSON.stringify({
            header: MthTitle.UNSAVED_TITLE,
            content: MthTitle.UNSAVED_DESCRIPTION,
          })}
        />
        <Box
          sx={{
            maxHeight: '90vh',
            overflow: 'auto',
            p: 1,
          }}
        >
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSave}
          >
            <Form>
              <ProviderForm setIsChanged={setIsChanged} periodsItems={periodsItems} />
              <SaveCancelComponent isSubmitted={isSubmitted} handleCancel={handleCancel} />
            </Form>
          </Formik>
        </Box>
        {showCancelModal && (
          <CustomModal
            title='Cancel Changes'
            description='Are you sure you want to cancel changes made?'
            cancelStr='Cancel'
            confirmStr='Yes'
            backgroundColor={MthColor.WHITE}
            onClose={() => {
              setShowCancelModal(false)
            }}
            onConfirm={() => {
              setShowCancelModal(false)
              setIsChanged(false)
              setShowEditModal(false)
            }}
          />
        )}
        {showLeaveModal && (
          <CustomModal
            title={MthTitle.UNSAVED_TITLE}
            description={MthTitle.UNSAVED_DESCRIPTION}
            cancelStr='Cancel'
            confirmStr='Yes'
            backgroundColor={MthColor.WHITE}
            onClose={() => {
              setShowLeaveModal(false)
            }}
            onConfirm={() => {
              setShowLeaveModal(false)
              setIsChanged(false)
              setShowEditModal(false)
            }}
          />
        )}
      </Box>
    </Modal>
  )
}

export default ProviderEdit
