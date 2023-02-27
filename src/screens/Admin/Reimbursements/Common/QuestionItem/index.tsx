import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Theme } from '@emotion/react'
import { DeleteForeverOutlined } from '@mui/icons-material'
import AddIcon from '@mui/icons-material/Add'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { Box, Button, Grid, IconButton, TextField, Tooltip } from '@mui/material'
import { SxProps } from '@mui/system'
import { useFormikContext } from 'formik'
import SignatureCanvas from 'react-signature-canvas'
import { SortableHandle } from 'react-sortable-hoc'
import { DocumentUploadModal } from '@mth/components/DocumentUploadModal/DocumentUploadModal'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { FormError } from '@mth/components/FormError'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/types'
import { MthNumberInput } from '@mth/components/MthNumberInput'
import { MthRadioGroup } from '@mth/components/MthRadioGroup'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { REIMBURSEMENT_FORM_TYPE_ITEMS } from '@mth/constants'
import {
  QUESTION_TYPE,
  RoleLevel,
  AdditionalQuestionAction,
  MthColor,
  ReimbursementFormType,
  ScheduleStatus,
  CourseType,
  ReduceFunds,
  ReimbursementQuestionSlug,
} from '@mth/enums'
import { SchedulePeriod } from '@mth/graphql/models/schedule-period'
import { getStudentSchedulePeriodsQuery } from '@mth/graphql/queries/schedule-period'
import { ReimbursementQuestion, ReimbursementReceipt, SchoolYear, Student } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { mthButtonClasses } from '@mth/styles/button.style'
import { arrayToString, extractContent } from '@mth/utils/string.util'

type QuestionProps = {
  isToBuildForm: boolean
  question: ReimbursementQuestion
  selectedYearId: number | undefined
  selectedYear: SchoolYear | undefined
  isDirectOrder: boolean | undefined
  selectedStudentId: number
  selectedFormType: ReimbursementFormType | undefined
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

const DragHandle = SortableHandle(({ sx }: { sx?: SxProps<Theme> }) => (
  <Tooltip title='Move'>
    <IconButton
      sx={
        sx
          ? { position: 'absolute', top: '10px', marginLeft: '50px', ...sx }
          : { position: 'absolute', top: '10px', marginLeft: '50px' }
      }
    >
      <DehazeIcon />
    </IconButton>
  </Tooltip>
))

export const QuestionItem: React.FC<QuestionProps> = ({
  isToBuildForm,
  question,
  selectedStudentId,
  selectedYear,
  selectedYearId,
  selectedFormType,
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
}) => {
  const { me } = useContext(UserContext)
  const { values, setValues } = useFormikContext<ReimbursementQuestion[]>()
  const roleLevel = me?.role?.level
  const [formTypeItems, setFormTypeItems] = useState<DropDownItem[]>([])
  const [periodsItems, setPeriodsItems] = useState<DropDownItem[]>([])
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [maxReceipt, setMaxReceipt] = useState<number>(1)

  const [getStudentSchedulePeriods, { loading: studentSchedulePeriodsLoading, data: studentSchedulePeriodsData }] =
    useLazyQuery(getStudentSchedulePeriodsQuery, {
      fetchPolicy: 'network-only',
    })

  const resetSignature = () => {
    signatureRef?.clear()
  }

  const getDisableStatus = (question: ReimbursementQuestion): boolean => {
    switch (question.slug) {
      case ReimbursementQuestionSlug.FORM_TYPE:
        if (roleLevel === RoleLevel.SUPER_ADMIN || selectedStudentId) return false
        else return true
      default:
        return false
    }
  }

  const renderDropDownItems = (question: ReimbursementQuestion): DropDownItem[] => {
    switch (question.slug) {
      case ReimbursementQuestionSlug.STUDENT_ID:
        if (!isToBuildForm && !!students?.length) {
          return students?.map((student) => ({
            label: `${student?.person?.first_name} - 100%, 0 missing`,
            value: +student?.student_id,
          })) as DropDownItem[]
        } else {
          return []
        }
      case ReimbursementQuestionSlug.FORM_TYPE:
        if (roleLevel === RoleLevel.PARENT && !!students?.length) {
          return formTypeItems
        } else {
          return REIMBURSEMENT_FORM_TYPE_ITEMS
        }
      case ReimbursementQuestionSlug.PERIOD:
        if (roleLevel === RoleLevel.PARENT) return periodsItems
        else return []
      default:
        return (question.Options as DropDownItem[])?.filter((option) => option.value) as DropDownItem[]
    }
  }

  const setQuestion = (question: ReimbursementQuestion) => {
    const questionIndex = values?.findIndex((value) => value?.slug == question.slug)
    values[questionIndex] = question
    setValues(JSON.parse(JSON.stringify(values)))
  }

  const getTotalAmount = (): number => {
    if (receipts?.length > 0) {
      let sum = 0
      receipts?.forEach((receipt) => {
        sum += receipt?.amount || 0
      })
      return sum
    } else {
      return 0
    }
  }

  const deleteReceipt = (index: number) => {
    const temp = [...receipts]
    temp?.splice(index, 1)
    setReceipts(temp)
  }

  const handleChangeReceipts = (index: number, value: number | null) => {
    setReceipts(
      receipts?.map((receipt, i) => {
        if (index == i) return { ...receipt, amount: value }
        else return receipt
      }),
    )
  }

  const handleFileChange = (files: File[]) => {
    if (files?.length) {
      setReceipts([
        ...receipts,
        ...files?.map((file) => ({
          reimbursement_receipt_id: 0,
          ReimbursementRequestId: 0,
          file_id: 0,
          file_name: file?.name,
          amount: 0,
          file: file,
        })),
      ])
      setShowUploadModal(false)
    }
  }

  const handleChangeValue = (question: ReimbursementQuestion, value: string | number | boolean) => {
    if (question.slug === ReimbursementQuestionSlug.STUDENT_ID) setSelectedStudentId(+value)
    if (question.slug === ReimbursementQuestionSlug.FORM_TYPE) setSelectedFormType(value as ReimbursementFormType)
    setQuestion({ ...question, answer: value })
  }

  const getDefaultValue = (question: ReimbursementQuestion) => {
    switch (question.slug) {
      case ReimbursementQuestionSlug.STUDENT_ID:
        return selectedStudentId ? selectedStudentId : question.answer
      case ReimbursementQuestionSlug.FORM_TYPE:
        return selectedFormType && roleLevel === RoleLevel.PARENT
          ? selectedFormType
          : roleLevel === RoleLevel.SUPER_ADMIN
          ? question.reimbursement_form_type
          : question.answer
      default:
        return question.answer
    }
  }

  const renderReceipts = () => {
    return (
      <Box sx={{ marginTop: 2 }}>
        <Grid container rowSpacing={3} sx={{ marginBottom: 4 }}>
          {receipts?.map((receipt, index) => (
            <Fragment key={index}>
              <Grid item xs={8}>
                <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                  <Paragraph
                    size={'large'}
                    sx={{ paddingY: 1, fontSize: '18px', fontWeight: 600, textAlign: 'center' }}
                  >
                    {`${index + 1}`}
                  </Paragraph>
                  <Paragraph
                    size={'large'}
                    sx={{
                      paddingX: 3,
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: MthColor.MTHBLUE,
                      textAlign: 'center',
                    }}
                  >
                    {`${receipt?.file_name}`}
                  </Paragraph>
                  <IconButton onClick={() => deleteReceipt(index)}>
                    <Tooltip title='Delete' color='primary' placement='top'>
                      <DeleteForeverOutlined fontSize='medium' />
                    </Tooltip>
                  </IconButton>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <MthNumberInput
                  numberType='price'
                  label={'Amount of Receipt'}
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={+(receipt?.amount?.toFixed(2) || 0)}
                  onChangeValue={(value: number | null) => {
                    handleChangeReceipts(index, value)
                  }}
                  error={showError && !receipt?.amount}
                  helperText={showError && !receipt?.amount && 'Required'}
                />
              </Grid>
            </Fragment>
          ))}
        </Grid>
        {maxReceipt > receipts?.length && (
          <Button sx={{ ...mthButtonClasses.primary }} startIcon={<AddIcon />} onClick={() => setShowUploadModal(true)}>
            Add Receipt
          </Button>
        )}
      </Box>
    )
  }

  const renderQuestion = (question: ReimbursementQuestion) => {
    if (
      (roleLevel !== RoleLevel.SUPER_ADMIN &&
        question.slug != ReimbursementQuestionSlug.STUDENT_ID &&
        question.slug != ReimbursementQuestionSlug.FORM_TYPE &&
        !selectedFormType) ||
      (roleLevel == RoleLevel.SUPER_ADMIN && !isToBuildForm && question.type == QUESTION_TYPE.SIGNATURE)
    ) {
      return (
        <Box sx={{ display: 'none' }}>
          <DragHandle />
        </Box>
      )
    }

    switch (question.type) {
      case QUESTION_TYPE.DROPDOWN: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <DropDown
                dropDownItems={renderDropDownItems(question)}
                placeholder={extractContent(question.question)}
                labelTop
                defaultValue={getDefaultValue(question) as string}
                setParentValue={(value) => handleChangeValue(question, value)}
                size='medium'
                disabled={getDisableStatus(question)}
                sx={{ m: 0 }}
                error={{
                  error: showError && question?.required && !question?.answer,
                  errorMsg: 'Required',
                }}
              />
              {isToBuildForm && question.sortable && <DragHandle sx={{ right: '-90px', top: '0px' }} />}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.SIGNATURE: {
        return (
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'left',
                marginX: 'auto',
                paddingY: 5,
                width: '500px',
              }}
            >
              <Paragraph size={'large'} sx={{ paddingY: 1, textAlign: 'center' }}>
                {'Type full legal parent name and provide a digital signature below:'}
              </Paragraph>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  name='title'
                  defaultValue={signatureName}
                  placeholder='Entry'
                  fullWidth
                  sx={{ my: 1 }}
                  onChange={(e) => setSignatureName(e?.target?.value)}
                  error={showError && question?.required && !signatureName}
                  helperText={showError && question?.required && !signatureName && 'Required'}
                />
                {isToBuildForm && <DragHandle sx={{ marginLeft: '100px' }} />}
              </Box>

              <Paragraph size={'large'} sx={{ paddingY: 1, textAlign: 'center' }}>
                {'Signature (use the mouse to sign)'}
              </Paragraph>
              <Box
                sx={{
                  borderBottom:
                    showError && question?.required && !signatureFileUrl && signatureRef?.isEmpty()
                      ? `1px solid ${MthColor.ERROR_RED}`
                      : `1px solid ${MthColor.BLACK}`,
                  mx: 'auto',
                  width: 500,
                  textAlign: 'center',
                }}
              >
                {signatureFileUrl ? (
                  <img src={signatureFileUrl} alt='signature' style={{ width: 'auto' }} />
                ) : (
                  <SignatureCanvas
                    canvasProps={{ width: 500, height: 100 }}
                    ref={(ref) => {
                      setSignatureRef(ref)
                    }}
                  />
                )}
              </Box>
              <Paragraph
                size='medium'
                sx={{ textDecoration: 'underline', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => resetSignature()}
              >
                Reset
              </Paragraph>
              {showError && question?.required && !signatureFileUrl && signatureRef?.isEmpty() && (
                <FormError error={'Required'} />
              )}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.TEXTBOX: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              {question?.slug == ReimbursementQuestionSlug.TOTAL_AMOUNT ? (
                <MthNumberInput
                  numberType='price'
                  label={extractContent(question?.question)}
                  placeholder='Entry'
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  className='MthFormField'
                  value={+(+(question?.answer || 0))?.toFixed(2)}
                  onChangeValue={(value: number | null) => {
                    handleChangeValue(question, value || 0)
                  }}
                  error={showError && question?.required && !question.answer}
                />
              ) : (
                <TextField
                  name={extractContent(question.question)}
                  label={extractContent(question.question)}
                  placeholder='Entry'
                  fullWidth
                  focused
                  className='MthFormField'
                  value={question?.answer}
                  onChange={(event) => handleChangeValue(question, event?.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={showError && question?.required && !question.answer}
                  helperText={showError && question?.required && !question.answer && 'Required'}
                />
              )}
              {isToBuildForm && question.sortable && <DragHandle />}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.TEXTFIELD: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle
                fontWeight='600'
                sx={{
                  cursor: 'pointer',
                  fontSize: '14px',
                  paddingY: 1,
                  color: showError && question?.required && !question.answer ? MthColor.ERROR_RED : '',
                }}
              >
                {extractContent(question?.question)}
              </Subtitle>
              <MthBulletEditor
                value={question?.answer as string}
                setValue={(value) => handleChangeValue(question, value)}
                error={showError && question?.required && !question.answer}
              />
              {isToBuildForm && question.sortable && <DragHandle sx={{ right: '-90px', top: '0px' }} />}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.INFORMATION: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              {question.slug === ReimbursementQuestionSlug.TOTAL_AMOUNT && (
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '20px' }}>
                    {extractContent(question.question)}
                  </Subtitle>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '20px' }}>
                    {`$${getTotalAmount()?.toFixed(2)}`}
                  </Subtitle>
                </Box>
              )}
              {question.slug !== ReimbursementQuestionSlug.TOTAL_AMOUNT && (
                <>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '18px' }}>
                    {extractContent(question.question)}
                  </Subtitle>
                  {!isToBuildForm && question.slug == ReimbursementQuestionSlug.RECEIPTS && renderReceipts()}
                </>
              )}
              {isToBuildForm && question.sortable && <DragHandle sx={{ right: '-90px', top: '-5px' }} />}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.MULTIPLECHOICES: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
                {extractContent(question?.question)}
              </Subtitle>
              <MthRadioGroup
                ariaLabel='reimbursement-questions'
                options={
                  question?.answer
                    ? JSON.parse(question?.answer as string)
                    : question?.Options
                    ? (question?.Options as RadioGroupOption[])
                        ?.filter((item: RadioGroupOption) => item?.label)
                        ?.map(
                          (option: RadioGroupOption) =>
                            ({
                              label: option?.label,
                              value: false,
                              action: option.action || AdditionalQuestionAction.CONTINUE_TO_NEXT,
                              option_id: option.option_id || 0,
                            } as RadioGroupOption),
                        )
                    : []
                }
                handleChangeOption={(values) => handleChangeValue(question, JSON.stringify(values))}
                isError={showError && question?.required && !question.answer}
              />
              {isToBuildForm && question.sortable && <DragHandle sx={{ right: '-90px', top: '0px' }} />}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.CHECKBOX: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <MthCheckboxList
                title={extractContent(question?.question)}
                values={question?.answer ? JSON.parse(question.answer as string) : []}
                setValues={(values: string[]) => handleChangeValue(question, JSON.stringify(values))}
                checkboxLists={
                  question?.Options
                    ? (question?.Options as DropDownItem[])
                        ?.filter((item) => item?.label)
                        ?.map(
                          (option) =>
                            ({
                              label: option?.label,
                              value: option?.value,
                              action: option.action || AdditionalQuestionAction.CONTINUE_TO_NEXT,
                            } as CheckBoxListVM),
                        )
                    : []
                }
                haveSelectAll={false}
                showError={showError && question?.required && !question.answer}
                error={'Required'}
              />
              {isToBuildForm && question.sortable && <DragHandle sx={{ right: '-90px', top: '0px' }} />}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.AGREEMENT: {
        return (
          <Grid item xs={12}>
            <Box sx={{ width: '100%', position: 'relative' }}>
              <MthCheckbox
                label={extractContent(question?.question)}
                checked={!!question?.answer}
                onChange={(e) => handleChangeValue(question, e.target.checked)}
              />
              {showError && question?.required && question?.answer == undefined && <FormError error={'Required'} />}
              {isToBuildForm && question.sortable && <DragHandle sx={{ right: '-90px', top: '0px' }} />}
            </Box>
          </Grid>
        )
      }
      default:
        return (
          <Box sx={{ display: 'none' }}>
            <DragHandle />
          </Box>
        )
    }
  }

  useEffect(() => {
    if (selectedStudentId && selectedYearId) {
      getStudentSchedulePeriods({
        variables: {
          schoolYearId: selectedYearId,
          studentId: selectedStudentId,
        },
      })
    }
  }, [selectedStudentId, selectedYearId])

  useEffect(() => {
    if (!studentSchedulePeriodsLoading && studentSchedulePeriodsData?.schedulePeriods && selectedYear) {
      const schedulePeriods: SchedulePeriod[] = studentSchedulePeriodsData?.schedulePeriods as SchedulePeriod[]
      if (schedulePeriods?.length && schedulePeriods?.at(0)?.Schedule?.status === ScheduleStatus.ACCEPTED) {
        const selectedCourseTypes: string[] = schedulePeriods
          ?.filter((schedulePeriod) => schedulePeriod.course_type)
          .map((schedulePeriod) => schedulePeriod.course_type)
        const tempItems: DropDownItem[] = []
        const tempPeriods: DropDownItem[] = []
        if (isDirectOrder) {
          if (selectedCourseTypes?.includes(`${CourseType.CUSTOM_BUILT}`))
            tempItems.push({ label: 'Custom-built', value: ReimbursementFormType.CUSTOM_BUILT.toString() })
          if (selectedCourseTypes?.includes(`${CourseType.MTH_DIRECT}`)) {
            if (selectedYear.direct_orders === ReduceFunds.TECHNOLOGY)
              tempItems.push({ label: 'Technology Allowance', value: ReimbursementFormType.TECHNOLOGY.toString() })
            else if (selectedYear.direct_orders === ReduceFunds.SUPPLEMENTAL)
              tempItems.push({
                label: 'Supplemental Learning Funds',
                value: ReimbursementFormType.SUPPLEMENTAL.toString(),
              })
          }
        } else {
          if (selectedCourseTypes?.includes(`${CourseType.CUSTOM_BUILT}`))
            tempItems.push({ label: 'Custom-built', value: ReimbursementFormType.CUSTOM_BUILT.toString() })
          if (selectedCourseTypes?.includes(`${CourseType.MTH_DIRECT}`)) {
            if (selectedYear.reimbursements === ReduceFunds.TECHNOLOGY)
              tempItems.push({ label: 'Technology Allowance', value: ReimbursementFormType.TECHNOLOGY.toString() })
            else if (selectedYear.reimbursements === ReduceFunds.SUPPLEMENTAL)
              tempItems.push({
                label: 'Supplemental Learning Funds',
                value: ReimbursementFormType.SUPPLEMENTAL.toString(),
              })
          }
          if (selectedCourseTypes?.includes(`${CourseType.THIRD_PARTY_PROVIDER}`))
            tempItems.push({
              label: '3rd Party Provider',
              value: ReimbursementFormType.THIRD_PARTY_PROVIDER.toString(),
            })
        }

        let mergedPeriods: string[] = []
        if (selectedYear?.ReimbursementSetting?.max_receipts)
          setMaxReceipt(selectedYear?.ReimbursementSetting?.max_receipts)
        if (selectedYear?.ReimbursementSetting?.is_merged_periods && selectedYear.ReimbursementSetting.merged_periods) {
          mergedPeriods = selectedYear.ReimbursementSetting.merged_periods.includes(',')
            ? selectedYear.ReimbursementSetting.merged_periods?.split(',')
            : [selectedYear.ReimbursementSetting.merged_periods]
        }

        const newPeriods: number[] = []
        const newSubjects: string[] = []
        const newPeriodIds: number[] = []

        schedulePeriods?.map((schedulePeriod) => {
          if (schedulePeriod?.Period?.period && mergedPeriods.includes(`${schedulePeriod?.Period?.period}`)) {
            newPeriods.push(schedulePeriod?.Period?.period)
            newSubjects.push(`${schedulePeriod?.Title?.Subject?.name}`)
            newPeriodIds.push(schedulePeriod?.PeriodId)
          } else {
            tempPeriods.push({
              label: `Period ${schedulePeriod?.Period?.period} - ${schedulePeriod?.Title?.Subject?.name}`,
              value: schedulePeriod?.PeriodId,
            })
          }
        })
        if (newPeriodIds.length > 0) {
          tempPeriods.push({
            label: `Period ${arrayToString(newPeriods)} - ${arrayToString(newSubjects)}`,
            value: newPeriodIds.join(','),
          })
        }

        setPeriodsItems(tempPeriods)
        setFormTypeItems(tempItems)
      }
    }
  }, [studentSchedulePeriodsLoading, studentSchedulePeriodsData, selectedYear, isDirectOrder])

  return (
    <>
      {renderQuestion(question)}
      {showUploadModal && (
        <DocumentUploadModal
          handleModem={() => setShowUploadModal(false)}
          handleFile={(files: File[]) => handleFileChange(files)}
          limit={maxReceipt - receipts?.length}
        />
      )}
    </>
  )
}
