import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Box } from '@mui/material'
import { Form, Formik } from 'formik'
import SignatureCanvas from 'react-signature-canvas'
import * as yup from 'yup'
import {
  FileCategory,
  MthRoute,
  ReimbursementFormType,
  ReimbursementQuestionSlug,
  ReimbursementRequestStatus,
  RoleLevel,
} from '@mth/enums'
import { saveReimbursementQuestionsMutation } from '@mth/graphql/mutation/reimbursement-question'
import { saveReimbursementRequestMutation } from '@mth/graphql/mutation/reimbursement-request'
import { useReimbursementQuestions } from '@mth/hooks'
import { ReimbursementQuestion, SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSignatureFile } from '@mth/screens/Admin/EnrollmentPackets/services'
import { uploadFile } from '@mth/services'
import { getRegionCode } from '@mth/utils'
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
  setPage?: (value: MthRoute) => void
}

export const RequestForm: React.FC<RequestFormProps> = ({
  formType,
  setFormType,
  isDirectOrder,
  selectedYearId,
  selectedYear,
  setIsChanged,
  setPage,
}) => {
  const { me } = useContext(UserContext)
  const roleLevel = me?.role?.level
  const [initialValues, setInitialValues] = useState<ReimbursementQuestion[]>(
    DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS,
  )
  const [showError, setShowError] = useState<boolean>(false)
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0)
  const [selectedFormType, setSelectedFormType] = useState<ReimbursementFormType>()
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null)
  const [signatureName, setSignatureName] = useState<string>('')
  const [signatureFileId, setSignatureFileId] = useState<number>(0)
  const [signatureFileUrl, setSignatureFileUrl] = useState<string>('')

  const [getSignatureFileUrl, { loading: signatureFileUrlLoading, data: signatureFileData }] = useLazyQuery(
    getSignatureFile,
    {
      fetchPolicy: 'network-only',
    },
  )

  const {
    loading: reimbursementQuestionsLoading,
    reimbursementQuestions,
    refetch,
  } = useReimbursementQuestions(selectedYearId, formType, isDirectOrder)

  const [submitSave] = useMutation(saveReimbursementQuestionsMutation)
  const [saveRequest] = useMutation(saveReimbursementRequestMutation)

  const validationSchema = yup.object({})

  const isInvalid = (questions: ReimbursementQuestion[]): boolean => {
    if (questions?.length > 0) {
      let invalidationCount = 0
      questions.map((question) => {
        if (
          (question.slug == ReimbursementQuestionSlug.SIGNATURE_NAME &&
            (!signatureName || (!signatureFileUrl && !signatureFileId && signatureRef?.isEmpty()))) ||
          (question.slug !== ReimbursementQuestionSlug.SIGNATURE_NAME && !question.answer)
        )
          invalidationCount++
      })
      if (invalidationCount > 0) return true
    }
    return false
  }

  const dataUrlToFile = async (dataUrl: string, fileName: string): Promise<File> => {
    const res: Response = await fetch(dataUrl)
    const blob: Blob = await res.blob()
    return new File([blob], fileName, { type: 'image/png' })
  }

  const onSubmitRequests = async (questions: ReimbursementQuestion[], status: ReimbursementRequestStatus) => {
    if (roleLevel == RoleLevel.SUPER_ADMIN) return
    let fileId = 0
    if (signatureRef && !signatureRef.isEmpty()) {
      const file = await dataUrlToFile(signatureRef?.getTrimmedCanvas()?.toDataURL('image/png') || '', 'signature')
      if (file) {
        const result = await uploadFile(
          file,
          FileCategory.SIGNATURE,
          getRegionCode(me?.userRegion?.at(-1)?.regionDetail?.name || 'Arizona'),
          selectedStudentId,
        )
        if (result?.data?.file?.file_id) {
          fileId = result?.data?.file?.file_id
          setSignatureFileId(fileId)
        }
      }
    }

    const periods = questions?.find((item) => item?.slug == ReimbursementQuestionSlug.PERIOD)?.answer
    const total_amount = questions?.find((item) => item?.slug == ReimbursementQuestionSlug.TOTAL_AMOUNT)?.answer
    const meta = questions
      ?.filter((item) => !item?.default_question)
      ?.map((question) => `"${question?.slug}":"${question?.answer}"`)
      ?.join(',')

    await saveRequest({
      variables: {
        requestInput: {
          reimbursement_request_id: 0,
          SchoolYearId: selectedYearId,
          StudentId: selectedStudentId,
          form_type: formType,
          is_direct_order: isDirectOrder,
          meta: `{${meta}}`,
          periods: periods,
          signature_file_id: fileId > 0 ? fileId : signatureFileId,
          signature_name: signatureName,
          status: status,
          total_amount: +(total_amount || 0),
        },
      },
    })
    if (setPage) setPage(MthRoute.DASHBOARD)
  }

  const onSaveRequests = (values: ReimbursementQuestion[]) => {
    if (roleLevel == RoleLevel.SUPER_ADMIN) return
    if (isInvalid(values)) {
      setShowError(true)
    } else {
      onSubmitRequests(values, ReimbursementRequestStatus.SUBMITTED)
    }
  }

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
      setInitialValues(
        reimbursementQuestions?.map((question) => {
          if (question?.slug == ReimbursementQuestionSlug.STUDENT_ID && selectedStudentId)
            return { ...question, answer: `${selectedStudentId}` }
          if (question?.slug == ReimbursementQuestionSlug.FORM_TYPE && selectedFormType)
            return { ...question, answer: `${selectedFormType}` }
          return question
        }),
      )
    } else {
      let tempInitialValues: ReimbursementQuestion[] = []
      switch (formType) {
        case ReimbursementFormType.TECHNOLOGY:
          tempInitialValues = isDirectOrder
            ? DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS
            : DEFAULT_TECHNOLOGY_QUESTIONS
          break
        case ReimbursementFormType.SUPPLEMENTAL:
          tempInitialValues = isDirectOrder
            ? DEFAULT_IS_DIRECT_ORDER_SUPPLEMENTAL_LEARNING_QUESTIONS
            : DEFAULT_SUPPLEMENTAL_LEARNING_QUESTIONS

          break
        case ReimbursementFormType.CUSTOM_BUILT:
          tempInitialValues = isDirectOrder
            ? DEFAULT_IS_DIRECT_ORDER_CUSTOM_BUILT_QUESTIONS
            : DEFAULT_CUSTOM_BUILT_QUESTIONS

          break
        case ReimbursementFormType.THIRD_PARTY_PROVIDER:
          tempInitialValues = DEFAULT_THIRD_PARTY_PROVIDER_QUESTIONS
          break
        case ReimbursementFormType.REQUIRED_SOFTWARE:
          tempInitialValues = DEFAULT_REQUIRED_SOFTWARE_QUESTIONS
          break
        default:
          tempInitialValues = DEFAULT_IS_DIRECT_ORDER_TECHNOLOGY_QUESTIONS
      }
      setInitialValues(
        tempInitialValues?.map((question) => {
          if (question?.slug == ReimbursementQuestionSlug.STUDENT_ID && selectedStudentId)
            return { ...question, answer: `${selectedStudentId}` }
          if (question?.slug == ReimbursementQuestionSlug.FORM_TYPE && selectedFormType)
            return { ...question, answer: `${selectedFormType}` }
          return question
        }),
      )
    }
  }, [reimbursementQuestionsLoading, reimbursementQuestions, formType, isDirectOrder])

  useEffect(() => {
    if (signatureFileId) {
      getSignatureFileUrl({
        variables: {
          fileId: signatureFileId,
        },
      })
    }
  }, [signatureFileId])

  useEffect(() => {
    if (!signatureFileUrlLoading && signatureFileData?.signatureFile?.signedUrl) {
      setSignatureFileUrl(signatureFileData?.signatureFile?.signedUrl)
    }
  }, [signatureFileUrlLoading, signatureFileData])

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
              isDirectOrder={isDirectOrder}
              showError={showError}
              selectedYearId={selectedYearId}
              selectedStudentId={selectedStudentId}
              selectedFormType={selectedFormType}
              signatureRef={signatureRef}
              signatureName={signatureName}
              signatureFileUrl={signatureFileUrl}
              onSubmitRequests={onSubmitRequests}
              setSignatureRef={setSignatureRef}
              setSignatureName={setSignatureName}
              setFormType={setFormType}
              setSelectedStudentId={setSelectedStudentId}
              setSelectedFormType={setSelectedFormType}
              setIsChanged={setIsChanged}
              handleSaveQuestions={onSaveQuestions}
            />
          </Form>
        </Formik>
      </Box>
    </>
  )
}
