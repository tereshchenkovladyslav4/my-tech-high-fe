import React, { useEffect, useState } from 'react'
import { Box, Modal } from '@mui/material'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { MthColor } from '@mth/enums'
import { SaveCancelComponent } from '@mth/screens/Admin/Curriculum/CourseCatalog/Components/SaveCancelComponent'
import { defaultValue } from './defaultValues'
import ThirdPartyProviderForm from './OnSiteSplitEnrollmentForm'
import { OnSiteSplitEnrollment, OnSiteSplitEnrollmentEditProps } from './types'

const OnSiteSplitEnrollmentEdit: React.FC<OnSiteSplitEnrollmentEditProps> = ({
  onSiteSplitEnrollment,
  handleSaveAction,
  handleCancelAction,
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [initialValues, setInitialValues] = useState<OnSiteSplitEnrollment>(defaultValue)
  const handleCancel = () => {
    handleCancelAction()
  }

  const validationSchema = yup.object({
    districtSchool: yup.string().required('Required').nullable(),
    schoolDistrictName: yup.string().required('Required').nullable(),
    courseName: yup.string().required('Required').nullable(),
  })

  const onSave = async (value: OnSiteSplitEnrollment) => {
    setIsSubmitted(true)
    handleSaveAction(value)
  }

  useEffect(() => {
    if (onSiteSplitEnrollment) {
      setInitialValues(onSiteSplitEnrollment)
    }
  }, [onSiteSplitEnrollment])

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
          width: '530px',
          height: 'auto',
          bgcolor: MthColor.WHITE,
          borderRadius: 2,
          px: 8,
          py: 3,
        }}
      >
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSave}
        >
          <Form>
            <ThirdPartyProviderForm item={''} />
            <SaveCancelComponent isSubmitted={isSubmitted} handleCancel={handleCancel} />
          </Form>
        </Formik>
      </Box>
    </Modal>
  )
}

export default OnSiteSplitEnrollmentEdit
