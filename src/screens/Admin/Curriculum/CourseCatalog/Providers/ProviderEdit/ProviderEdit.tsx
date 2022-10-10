import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Box, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
import { MthColor, MthTitle, ReduceFunds } from '@mth/enums'
import { defaultProviderFormData } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/defaultValues'
import ProviderForm from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers/ProviderEdit/ProviderForm'
import { createOrUpdateProviderMutation } from '@mth/screens/Admin/Curriculum/CourseCatalog/services'
import { getPeriods } from '@mth/screens/Admin/Curriculum/services'
import SaveCancelComponent from '../../Components/SaveCancelComponent/SaveCancelComponent'
import { Period, ProviderEditProps, Provider } from '../types'

const ProviderEdit: React.FC<ProviderEditProps> = ({ schoolYearId, item, refetch, setShowEditModal }) => {
  const [periodsItems, setPeriodsItems] = useState<CheckBoxListVM[]>([])
  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<Provider>(defaultProviderFormData)
  const [submitSave, {}] = useMutation(createOrUpdateProviderMutation)

  const { loading, data: periodsData } = useQuery(getPeriods, {
    variables: { school_year_id: +schoolYearId, hide_archived: true },
    skip: !schoolYearId,
    fetchPolicy: 'network-only',
  })

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
          reduce_funds == ReduceFunds.TECHNOLOGY_ALLOWANCE || reduce_funds == ReduceFunds.SUPPLEMENTAL_LEARNING_FUNDS,
        then: yup.number().required('Price Required').moreThan(0, 'Should be greater than 0').positive('Price Invaild'),
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

    await submitSave({
      variables: {
        createProviderInput: {
          id: Number(value.id),
          school_year_id: +schoolYearId,
          name: value.name,
          is_display: value.is_display,
          reduce_funds: value.reduce_funds,
          price: value.price,
          reduce_funds_notification: value.reduce_funds_notification,
          multiple_periods: value.multiple_periods,
          multi_periods_notification: value.multi_periods_notification,
          periods: value.PeriodIds?.join(','),
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
    if (!loading && periodsData) {
      const { periods } = periodsData
      setPeriodsItems(
        (periods || []).map((item: Period): CheckBoxListVM => {
          return {
            label: `Period ${item.period} - ${item.category}`,
            value: item.id.toString(),
          }
        }),
      )
    }
  }, [loading, periodsData])

  useEffect(() => {
    if (item?.id) setInitialValues({ ...item, PeriodIds: item.Periods.map((x: Period) => x.id.toString()) })
  }, [item])

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
          bgcolor: MthColor.WHITE,
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
