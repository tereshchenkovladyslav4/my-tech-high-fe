import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Box, Grid, List } from '@mui/material'
import { Form, Formik } from 'formik'
import SignatureCanvas from 'react-signature-canvas'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import * as yup from 'yup'
import {
  FileCategory,
  MthRoute,
  QUESTION_TYPE,
  ReimbursementFormType,
  ReimbursementQuestionSlug,
  ReimbursementRequestStatus,
  RoleLevel,
} from '@mth/enums'
import { saveReimbursementQuestionsMutation } from '@mth/graphql/mutation/reimbursement-question'
import {
  deleteReimbursementReceiptsMutation,
  saveReimbursementReceiptMutation,
} from '@mth/graphql/mutation/reimbursement-receipt'
import { saveReimbursementRequestMutation } from '@mth/graphql/mutation/reimbursement-request'
import { useReimbursementQuestions } from '@mth/hooks/useReimbursementQuestions'
import { ReimbursementQuestion, ReimbursementReceipt, ReimbursementRequest, SchoolYear, Student } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getSignatureFile } from '@mth/screens/Admin/EnrollmentPackets/services'
import { uploadFile } from '@mth/services/file-upload.service'
import { dataUrlToFile } from '@mth/utils/file.util'
import { getRegionCode } from '@mth/utils/region.util'
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
import { QuestionItem } from '../QuestionItem'
import { RequestFormEdit } from './RequestFormEdit'

type SortableContainerProps = {
  isToBuildForm: boolean
  items: ReimbursementQuestion[]
  selectedYearId: number | undefined
  selectedStudentId: number
  selectedYear: SchoolYear | undefined
  selectedFormType: ReimbursementFormType | undefined
  isDirectOrder: boolean | undefined
  showError: boolean
  signatureRef: SignatureCanvas | null
  signatureName: string
  signatureFileUrl: string
  students: Student[]
  receipts: ReimbursementReceipt[]
  setReceipts: (value: ReimbursementReceipt[]) => void
  setSignatureRef: (value: SignatureCanvas | null) => void
  setSignatureName: (value: string) => void
  setSelectedStudentId: (value: number) => void
  setSelectedFormType: (value: ReimbursementFormType | undefined) => void
  setIsChanged: (value: boolean) => void
}

const SortableItem = SortableElement(QuestionItem)

const SortableListContainer = SortableContainer(
  ({
    isToBuildForm,
    items,
    selectedStudentId,
    selectedFormType,
    selectedYearId,
    selectedYear,
    isDirectOrder,
    showError,
    signatureRef,
    signatureName,
    signatureFileUrl,
    students,
    receipts,
    setReceipts,
    setSignatureRef,
    setSignatureName,
    setSelectedStudentId,
    setSelectedFormType,
    setIsChanged,
  }: SortableContainerProps) => (
    <Grid item xs={12}>
      <List>
        <Grid container rowSpacing={3}>
          {items.map((item, index) => (
            <SortableItem
              index={index}
              key={`${item.slug}_${index}`}
              isToBuildForm={isToBuildForm}
              question={item}
              isDirectOrder={isDirectOrder}
              showError={showError}
              selectedYearId={selectedYearId}
              selectedYear={selectedYear}
              selectedStudentId={selectedStudentId}
              selectedFormType={selectedFormType}
              signatureRef={signatureRef}
              signatureName={signatureName}
              signatureFileUrl={signatureFileUrl}
              students={students}
              receipts={receipts}
              setReceipts={setReceipts}
              setSignatureRef={setSignatureRef}
              setSignatureName={setSignatureName}
              setSelectedStudentId={setSelectedStudentId}
              setSelectedFormType={setSelectedFormType}
              setIsChanged={setIsChanged}
            />
          ))}
        </Grid>
      </List>
    </Grid>
  ),
)

export type RequestFormProps = {
  isToBuildForm: boolean
  formType: ReimbursementFormType | undefined
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  selectedYear: SchoolYear | undefined
  selectedReimbursementRequest?: ReimbursementRequest
  requestStatus?: ReimbursementRequestStatus
  setFormType: (value: ReimbursementFormType | undefined) => void
  setIsChanged: (value: boolean) => void
  setPage?: (value: MthRoute) => void
  refetchReimbursementRequest?: () => void
}

export const RequestForm: React.FC<RequestFormProps> = ({
  isToBuildForm,
  formType,
  isDirectOrder,
  selectedYearId,
  selectedYear,
  selectedReimbursementRequest,
  requestStatus,
  setFormType,
  setIsChanged,
  setPage,
  refetchReimbursementRequest,
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
  const [receipts, setReceipts] = useState<ReimbursementReceipt[]>([])

  const students = useMemo(() => {
    if (isToBuildForm) return []
    if (roleLevel == RoleLevel.PARENT) {
      return me?.students || []
    }
    return selectedReimbursementRequest?.Student?.parent?.students || []
  }, [isToBuildForm, me?.students, selectedReimbursementRequest])

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
  const [saveReceipts] = useMutation(saveReimbursementReceiptMutation)
  const [deleteReceipts] = useMutation(deleteReimbursementReceiptsMutation)

  const validationSchema = yup.object({})

  const isInvalid = (questions: ReimbursementQuestion[]): boolean => {
    if (questions?.length > 0) {
      let invalidationCount = 0
      questions
        ?.filter(
          (question) =>
            question?.slug !== ReimbursementQuestionSlug.RECEIPTS &&
            !(question?.slug == ReimbursementQuestionSlug.TOTAL_AMOUNT && question?.type == QUESTION_TYPE.INFORMATION),
        )
        .map((question) => {
          if (
            (question.slug == ReimbursementQuestionSlug.SIGNATURE_NAME &&
              (!signatureName || (!signatureFileUrl && !signatureFileId && signatureRef?.isEmpty()))) ||
            (question.slug !== ReimbursementQuestionSlug.SIGNATURE_NAME && !question.answer)
          )
            invalidationCount++
        })
      receipts?.map((receipt) => {
        if (!receipt?.amount) invalidationCount++
      })
      if (invalidationCount > 0) return true
    }
    return false
  }

  const onSubmitRequests = async (
    questions: ReimbursementQuestion[],
    status: ReimbursementRequestStatus | undefined = requestStatus,
  ) => {
    if (isToBuildForm) return
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
    let total_amount = 0
    const receiptQuestion = questions?.find(
      (item) => item?.type == QUESTION_TYPE.INFORMATION && item?.slug == ReimbursementQuestionSlug.RECEIPTS,
    )
    if (receiptQuestion) {
      receipts?.forEach((receipt) => {
        total_amount += receipt?.amount || 0
      })
    } else {
      total_amount = +(
        (questions?.find((item) => item?.slug == ReimbursementQuestionSlug.TOTAL_AMOUNT)?.answer as number) || 0
      )
    }

    const meta: { [key: string]: string | number | boolean } = {}
    questions
      ?.filter((item) => !item?.default_question)
      ?.map((question) => {
        if (!!question?.slug && question?.answer != undefined) {
          meta[question.slug] = question?.answer
        }
      })

    const response = await saveRequest({
      variables: {
        requestInput: {
          reimbursement_request_id: selectedReimbursementRequest
            ? selectedReimbursementRequest?.reimbursement_request_id
            : 0,
          SchoolYearId: selectedYearId,
          StudentId: selectedStudentId,
          form_type: formType,
          is_direct_order: isDirectOrder,
          meta: JSON.stringify(meta),
          periods: periods,
          signature_file_id: fileId > 0 ? fileId : signatureFileId,
          signature_name: signatureName,
          status: status || selectedReimbursementRequest?.status,
          total_amount: total_amount,
        },
      },
    })

    if (response && receiptQuestion) {
      const reimbursementRequestId = response.data?.createOrUpdateReimbursementRequest?.reimbursement_request_id
      const newReceipts = [...receipts?.filter((receipt) => !receipt?.file_id)]
      const deletedReceipts = selectedReimbursementRequest?.ReimbursementReceipts?.filter(
        (receipt) => receipts.findIndex((x) => x.reimbursement_receipt_id == receipt.reimbursement_receipt_id) < 0,
      )
      if (newReceipts?.length) {
        for (const receipt of newReceipts) {
          if (receipt?.file) {
            const result = await uploadFile(
              receipt?.file,
              FileCategory.RECEIPT,
              getRegionCode(me?.userRegion?.at(-1)?.regionDetail?.name || 'Arizona'),
              selectedStudentId,
            )
            if (result?.data?.file?.file_id) {
              receipt.file_id = result?.data?.file?.file_id
            }
          }
        }
      }

      await saveReceipts({
        variables: {
          requestInput: {
            receipts: receipts?.map((receipt) => ({
              reimbursement_receipt_id: receipt.reimbursement_receipt_id || null,
              file_name: receipt.file_name,
              file_id: receipt.file_id,
              amount: receipt.amount,
              ReimbursementRequestId: reimbursementRequestId,
            })),
          },
        },
      })

      if (deletedReceipts?.length) {
        await deleteReceipts({
          variables: {
            reimbursementReceiptsActionInput: {
              receiptIds: deletedReceipts.map((item) => item.reimbursement_receipt_id),
            },
          },
        })
      }
    }
    if (refetchReimbursementRequest) refetchReimbursementRequest()
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
            is_direct_order: !!isDirectOrder,
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

  const arrangeItems = (
    items: ReimbursementQuestion[],
    values: ReimbursementQuestion[],
    setValues: (value: ReimbursementQuestion[]) => void,
  ) => {
    const newValues: ReimbursementQuestion[] = []
    items.map(async (item, index) => {
      const correctPriority = index
      values?.map((value) => {
        if (value?.slug === item?.slug) {
          value.priority = correctPriority
          newValues.push(value)
        }
      })
    })
    onSaveQuestions(newValues)
    setValues(newValues)
  }

  useEffect(() => {
    if (!reimbursementQuestionsLoading && reimbursementQuestions) {
      let tempInitialValues: ReimbursementQuestion[] = []
      if (reimbursementQuestions?.length > 3) {
        tempInitialValues = reimbursementQuestions
      } else {
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
      }

      let meta: { [key: string]: string | number | boolean }
      try {
        meta = JSON.parse(selectedReimbursementRequest?.meta || '')
      } catch {
        meta = {}
      }

      setInitialValues(
        tempInitialValues?.map((question) => {
          if (question?.slug == ReimbursementQuestionSlug.STUDENT_ID && selectedStudentId)
            return { ...question, answer: `${selectedStudentId}` }
          if (question?.slug == ReimbursementQuestionSlug.FORM_TYPE && selectedFormType)
            return { ...question, answer: `${selectedFormType}` }
          const metaAnswer = meta[question?.slug]
          if (!!metaAnswer) {
            return { ...question, answer: metaAnswer }
          }
          return question
        }),
      )
    }
  }, [reimbursementQuestionsLoading, reimbursementQuestions, formType, isDirectOrder, selectedReimbursementRequest])

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

  useEffect(() => {
    if (selectedReimbursementRequest) {
      setSelectedStudentId(selectedReimbursementRequest?.StudentId)
      setSelectedFormType(selectedReimbursementRequest?.form_type)
      setReceipts(selectedReimbursementRequest?.ReimbursementReceipts || [])
    }
  }, [selectedReimbursementRequest])

  return (
    <>
      <Box sx={{ width: '600px', paddingY: 3 }}>
        <Formik
          initialValues={initialValues}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={onSaveRequests}
        >
          {({ values, setValues }) => {
            return (
              <Form>
                <RequestFormEdit
                  isToBuildForm={isToBuildForm}
                  formType={formType}
                  isDirectOrder={isDirectOrder}
                  selectedYearId={selectedYearId}
                  selectedStudentId={selectedStudentId}
                  selectedFormType={selectedFormType}
                  onSubmitRequests={onSubmitRequests}
                  setFormType={setFormType}
                  setIsChanged={setIsChanged}
                  handleSaveQuestions={onSaveQuestions}
                >
                  <SortableListContainer
                    isToBuildForm={isToBuildForm}
                    items={values}
                    useDragHandle={true}
                    selectedYear={selectedYear}
                    isDirectOrder={isDirectOrder}
                    selectedYearId={selectedYearId}
                    showError={showError}
                    selectedStudentId={selectedStudentId}
                    selectedFormType={selectedFormType}
                    signatureRef={signatureRef}
                    signatureName={signatureName}
                    signatureFileUrl={signatureFileUrl}
                    students={students}
                    receipts={receipts}
                    setReceipts={setReceipts}
                    setSignatureRef={setSignatureRef}
                    setSignatureName={setSignatureName}
                    setSelectedStudentId={setSelectedStudentId}
                    setSelectedFormType={setSelectedFormType}
                    onSortEnd={({ oldIndex, newIndex }) => {
                      const newSortableList = arrayMove(values, oldIndex, newIndex)
                      arrangeItems(newSortableList, values, setValues)
                    }}
                    setIsChanged={setIsChanged}
                  />
                </RequestFormEdit>
              </Form>
            )
          }}
        </Formik>
      </Box>
    </>
  )
}
