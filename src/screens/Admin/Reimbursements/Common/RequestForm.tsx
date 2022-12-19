import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { ReimbursementFormType } from '@mth/enums'
import { ReimbursementQuestion } from '@mth/models'
import {
  DEFAULT_CUSTOM_BUILT_QUESTIONS,
  DEFAULT_IS_DIRECT_ORDER_CUSTOM_BUILT_QUESTIONS,
  DEFAULT_IS_DIRECT_ORDER_SUPPLEMENTAL_LEARNING_QUESTIONS,
  DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS,
  DEFAULT_REQUIRED_SOFTWARE_QUESTIONS,
  DEFAULT_SUPPLEMENTAL_LEARNING_QUESTIONS,
  DEFAULT_TECHNOLOGY_QUESTIONS,
  DEFAULT_THIRD_PARTY_PROVIDER_QUESTIONS,
} from '../defaultValues'
import RequestFormEdit from './RequestFormEdit'

export type RequestFormProps = {
  formType: ReimbursementFormType
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  setIsChanged: (value: boolean) => void
}

const RequestForm: React.FC<RequestFormProps> = ({
  formType,
  setFormType,
  isDirectOrder,
  selectedYearId,
  setIsChanged,
}) => {
  const [initialValues, setInitialValues] = useState<ReimbursementQuestion[]>(
    DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS,
  )

  const validationSchema = yup.object({})

  const onSave = (values: ReimbursementQuestion[]) => {
    //console.log(values, 'values')
    values.map((value, index) => {
      value.priority = index
    })
  }

  useEffect(() => {
    switch (formType) {
      case ReimbursementFormType.TECHNOLOGY:
        setInitialValues(isDirectOrder ? DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS : DEFAULT_TECHNOLOGY_QUESTIONS)
        break
      case ReimbursementFormType.SUPPLEMENTAL:
        setInitialValues(
          isDirectOrder
            ? DEFAULT_IS_DIRECT_ORDER_SUPPLEMENTAL_LEARNING_QUESTIONS
            : DEFAULT_SUPPLEMENTAL_LEARNING_QUESTIONS,
        )
        break
      case ReimbursementFormType.CUSTOM_BUILT:
        setInitialValues(
          isDirectOrder ? DEFAULT_IS_DIRECT_ORDER_CUSTOM_BUILT_QUESTIONS : DEFAULT_CUSTOM_BUILT_QUESTIONS,
        )
        break
      case ReimbursementFormType.THIRD_PARTY_PROVIDER:
        setInitialValues(DEFAULT_THIRD_PARTY_PROVIDER_QUESTIONS)
        break
      case ReimbursementFormType.REQUIRED_SOFTWARE:
        setInitialValues(DEFAULT_REQUIRED_SOFTWARE_QUESTIONS)
        break
      default:
        setInitialValues(DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS)
    }
  }, [formType, isDirectOrder])

  return (
    <>
      <Box sx={{ width: '600px', paddingY: 3 }}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSave}
        >
          <Form>
            <RequestFormEdit
              formType={formType}
              setFormType={setFormType}
              isDirectOrder={isDirectOrder}
              selectedYearId={selectedYearId}
              setIsChanged={setIsChanged}
            />
          </Form>
        </Formik>
      </Box>
    </>
  )
}

export default RequestForm
