import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box } from '@mui/material'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { ReimbursementFormType } from '@mth/enums'
import { saveReimbursementQuestionsMutation } from '@mth/graphql/mutation/reimbursement-question'
import { useReimbursementQuestions } from '@mth/hooks'
import { ReimbursementQuestion, SchoolYear } from '@mth/models'
import {
  DEFAULT_CUSTOM_BUILT_QUESTIONS,
  DEFAULT_IS_DIRECT_ORDER_CUSTOM_BUILT_QUESTIONS,
  DEFAULT_IS_DIRECT_ORDER_SUPPLEMENTAL_LEARNING_QUESTIONS,
  DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS,
  DEFAULT_REQUIRED_SOFTWARE_QUESTIONS,
  DEFAULT_SUPPLEMENTAL_LEARNING_QUESTIONS,
  DEFAULT_TECHNOLOGY_QUESTIONS,
  DEFAULT_THIRD_PARTY_PROVIDER_QUESTIONS,
} from '../../defaultValues'
import { RequestFormEdit } from './RequestFormEdit'

export type RequestFormProps = {
  formType: ReimbursementFormType | undefined
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  selectedYear: SchoolYear | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  setIsChanged: (value: boolean) => void
}

export const RequestForm: React.FC<RequestFormProps> = ({
  formType,
  setFormType,
  isDirectOrder,
  selectedYearId,
  selectedYear,
  setIsChanged,
}) => {
  const [initialValues, setInitialValues] = useState<ReimbursementQuestion[]>(
    DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS,
  )

  const {
    loading: reimbursementQuestionsLoading,
    reimbursementQuestions,
    refetch,
  } = useReimbursementQuestions(selectedYearId, formType, isDirectOrder)

  const [submitSave] = useMutation(saveReimbursementQuestionsMutation)

  const validationSchema = yup.object({})

  const onSaveRequests = () => {}

  const onSaveQuestions = async (values: ReimbursementQuestion[]) => {
    values.map((value, index) => {
      value.priority = index + 1
    })
    const response = await submitSave({
      variables: {
        questionInputs: {
          questions: values?.map((value) => ({
            reimbursement_question_id: value?.reimbursement_question_id,
            type: value?.type,
            priority: value?.priority,
            question: value?.question,
            options: JSON.stringify(value?.Options),
            required: value?.SettingList?.includes('required') || value?.required,
            SchoolYearId: selectedYearId,
            slug: value?.slug,
            default_question: value?.default_question,
            reimbursement_form_type: formType,
            is_direct_order: isDirectOrder ? true : false,
            sortable: value?.sortable,
            display_for_admin: value?.SettingList?.includes('display_for_admin') || value?.display_for_admin,
            additional_question: value?.additional_question,
          })),
        },
      },
    })
    if (response) {
      refetch()
    }
  }

  useEffect(() => {
    if (!reimbursementQuestionsLoading && reimbursementQuestions?.length > 3) {
      setInitialValues(reimbursementQuestions)
    } else {
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
    }
  }, [reimbursementQuestionsLoading, reimbursementQuestions, formType, isDirectOrder])

  return (
    <>
      <Box sx={{ width: '600px', paddingY: 3 }}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSaveRequests}
        >
          <Form>
            <RequestFormEdit
              formType={formType}
              selectedYear={selectedYear}
              setFormType={setFormType}
              isDirectOrder={isDirectOrder}
              selectedYearId={selectedYearId}
              setIsChanged={setIsChanged}
              handleSaveQuestions={onSaveQuestions}
            />
          </Form>
        </Formik>
      </Box>
    </>
  )
}
