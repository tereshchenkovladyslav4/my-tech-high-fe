import React, { useRef, useState } from 'react'
import { Box } from '@mui/material'
import { Form, Formik, FormikProps } from 'formik'
import * as yup from 'yup'
import { MthModal } from '@mth/components/MthModal/MthModal'
import { RICH_TEXT_VALID_MIN_LENGTH } from '@mth/constants'
import CustomBuiltDescriptionForm from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/CustomBuiltDescription/CustomBuiltDescriptionForm'
import {
  CustomBuiltDescription,
  CustomBuiltDescriptionEditProps,
} from '@mth/screens/Homeroom/Schedule/ScheduleBuilder/CustomBuiltDescription/types'

const CustomBuiltDescriptionEdit: React.FC<CustomBuiltDescriptionEditProps> = ({
  customBuiltDescription,
  onSave,
  setShowEditModal,
}) => {
  const formRef = useRef<FormikProps<CustomBuiltDescription>>(null)
  const [initialValues] = useState<CustomBuiltDescription>({ custom_built_description: customBuiltDescription || '' })

  const handleCancel = () => {
    setShowEditModal(false)
  }

  const validationSchema = yup.object({
    custom_built_description: yup.string().required('Required').min(RICH_TEXT_VALID_MIN_LENGTH, 'Required').nullable(),
  })

  const handleSave = async (value: CustomBuiltDescription) => {
    setShowEditModal(false)
    onSave(value.custom_built_description)
  }

  return (
    <MthModal
      open={true}
      onClose={() => handleCancel()}
      onConfirm={() => {
        if (formRef.current) {
          formRef.current.handleSubmit()
        }
      }}
      confirmStr='Save'
      noCloseOnBackdrop
      width={860}
    >
      <Box sx={{ px: 4, py: 2 }}>
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          <Form>
            <CustomBuiltDescriptionForm />
          </Form>
        </Formik>
      </Box>
    </MthModal>
  )
}

export default CustomBuiltDescriptionEdit
