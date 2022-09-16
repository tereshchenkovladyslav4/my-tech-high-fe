import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Card } from '@mui/material'
import { Form, Formik } from 'formik'
import { Prompt } from 'react-router-dom'
import * as yup from 'yup'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { MthColor, MthTitle } from '@mth/enums'
import { updateRegionMutation } from '@mth/graphql/mutation/region'
import { useRegionByRegionId } from '@mth/hooks'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { HeaderComponent } from '../HeaderComponent'
import { ConfirmationDetails, ConfirmationDetailsProps, HomeroomResourcePage } from '../types'
import ConfirmationDetailsForm from './ConfirmationDetailsForm'

const ConfirmationDetails: React.FC<ConfirmationDetailsProps> = ({ setPage }) => {
  const { me } = useContext(UserContext)

  const { region } = useRegionByRegionId(me?.selectedRegionId)

  const [isChanged, setIsChanged] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false)
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<ConfirmationDetails>({ details: undefined })

  const [submitSave, {}] = useMutation(updateRegionMutation)

  const handleBack = () => {
    if (isChanged) {
      setShowLeaveModal(true)
    } else {
      setPage(HomeroomResourcePage.ROOT)
    }
  }

  const handleCancel = () => {
    if (isChanged) {
      setShowCancelModal(true)
    } else {
      setPage(HomeroomResourcePage.ROOT)
    }
  }

  const validationSchema = yup.object({
    details: yup.string().nullable(),
  })

  const onSave = async (value: ConfirmationDetails) => {
    setIsSubmitted(true)
    await submitSave({
      variables: {
        updateRegionInput: {
          id: Number(region?.id),
          name: region?.name, // This is mandatory field in backend
          resource_confirm_details: value?.details,
        },
      },
    })
      .then(() => {
        setIsSubmitted(false)
        setIsChanged(false)
        setPage(HomeroomResourcePage.ROOT)
      })
      .catch(() => {
        setIsSubmitted(false)
      })
  }

  useEffect(() => {
    if (region) {
      setInitialValues({ details: region.resource_confirm_details })
    }
  }, [region])

  return (
    <Card sx={{ pt: 3, px: 3, pb: 2 }}>
      <Prompt
        when={isChanged ? true : false}
        message={JSON.stringify({
          header: MthTitle.UNSAVED_TITLE,
          content: MthTitle.UNSAVED_DESCRIPTION,
        })}
      />
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={onSave}
      >
        <Form>
          <HeaderComponent
            title={'Confirmation Details'}
            isSubmitted={isSubmitted}
            handleBack={handleBack}
            handleCancel={handleCancel}
          />
          <ConfirmationDetailsForm setIsChanged={setIsChanged} />
        </Form>
      </Formik>
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
            setPage(HomeroomResourcePage.ROOT)
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
            setPage(HomeroomResourcePage.ROOT)
          }}
        />
      )}
    </Card>
  )
}

export default ConfirmationDetails
