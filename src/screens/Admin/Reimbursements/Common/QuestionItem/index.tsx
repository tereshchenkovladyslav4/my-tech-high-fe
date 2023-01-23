import React, { useContext, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Theme } from '@emotion/react'
import { withStyles } from '@material-ui/styles'
import DehazeIcon from '@mui/icons-material/Dehaze'
import { Box, Grid, IconButton, TextField, Tooltip } from '@mui/material'
import { SxProps } from '@mui/system'
import SignatureCanvas from 'react-signature-canvas'
import { SortableHandle } from 'react-sortable-hoc'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { CheckBoxListVM } from '@mth/components/MthCheckboxList/MthCheckboxList'
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
} from '@mth/enums'
import { SchedulePeriod } from '@mth/graphql/models/schedule-period'
import { getStudentSchedulePeriodsQuery } from '@mth/graphql/queries/schedule-period'
import { ReimbursementQuestion, SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { extractContent } from '@mth/utils'

type QuestionProps = {
  question: ReimbursementQuestion
  setQuestion: (value: ReimbursementQuestion) => void
  selectedYearId: number | undefined
  selectedYear: SchoolYear | undefined
  isDirectOrder: boolean | undefined
  selectedStudentId: number
  selectedFormType: ReimbursementFormType | undefined
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

const CssTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderWidth: '1px !important',
        borderColor: 'black',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#333333',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#333333',
    },
  },
})(TextField)

export const QuestionItem: React.FC<QuestionProps> = ({
  question,
  selectedStudentId,
  selectedYear,
  selectedYearId,
  selectedFormType,
  isDirectOrder,
  setSelectedStudentId,
  setSelectedFormType,
  setQuestion,
}) => {
  const { me } = useContext(UserContext)
  const roleLevel = me?.role?.level
  const students = me?.students
  const [signatureRef, setSignatureRef] = useState<SignatureCanvas | null>(null)
  const [formTypeItems, setFormTypeItems] = useState<DropDownItem[]>([])

  const [getStudentSchedulePeriods, { loading: studentSchedulePeriodsLoading, data: studentSchedulePeriodsData }] =
    useLazyQuery(getStudentSchedulePeriodsQuery, {
      fetchPolicy: 'network-only',
    })

  const resetSignature = () => {
    signatureRef?.clear()
  }

  const getDisableStatus = (question: ReimbursementQuestion): boolean => {
    switch (question.slug) {
      case 'reimbursement_form_type':
        if (roleLevel === RoleLevel.SUPER_ADMIN || selectedStudentId) return false
        else return true
      default:
        return false
    }
  }

  const renderDropDownItems = (question: ReimbursementQuestion): DropDownItem[] => {
    switch (question.slug) {
      case 'reimbursement_student_id':
        if (roleLevel === RoleLevel.PARENT && students?.length && students?.length > 0) {
          return students?.map((student) => ({
            label: `${student?.person?.first_name} - 100%, 0 missing`,
            value: +student?.student_id,
          })) as DropDownItem[]
        } else {
          return []
        }
      case 'reimbursement_form_type':
        if (roleLevel === RoleLevel.PARENT && students?.length && students?.length > 0) {
          return formTypeItems
        } else {
          return REIMBURSEMENT_FORM_TYPE_ITEMS
        }
      default:
        return question.Options?.filter((option) => option.value) as DropDownItem[]
    }
  }

  const handleChangeValue = (question: ReimbursementQuestion, value: string | number) => {
    if (question.slug === 'reimbursement_student_id') setSelectedStudentId(+value)
    if (question.slug === 'reimbursement_form_type') setSelectedFormType(value as ReimbursementFormType)
    setQuestion({ ...question, answer: `${value}` })
  }

  const getDefaultValue = (question: ReimbursementQuestion) => {
    switch (question.slug) {
      case 'reimbursement_student_id':
        return selectedStudentId ? selectedStudentId : question.answer
      case 'reimbursement_form_type':
        return selectedFormType && roleLevel === RoleLevel.PARENT
          ? selectedFormType
          : roleLevel === RoleLevel.SUPER_ADMIN
          ? question.reimbursement_form_type
          : question.answer
      default:
        return question.answer
    }
  }

  const renderQuestion = (question: ReimbursementQuestion) => {
    if (
      roleLevel !== RoleLevel.SUPER_ADMIN &&
      question.slug != 'reimbursement_student_id' &&
      question.slug != 'reimbursement_form_type' &&
      !selectedFormType
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
                defaultValue={getDefaultValue(question)}
                setParentValue={(value) => handleChangeValue(question, value)}
                size='medium'
                disabled={getDisableStatus(question)}
                sx={{ m: 0 }}
              />
              {roleLevel === RoleLevel.SUPER_ADMIN && question.sortable && (
                <DragHandle sx={{ right: '-90px', top: '0px' }} />
              )}
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
                  defaultValue={''}
                  placeholder='Entry'
                  fullWidth
                  sx={{ my: 1 }}
                  onChange={() => {}}
                />
                {roleLevel === RoleLevel.SUPER_ADMIN && <DragHandle sx={{ marginLeft: '100px' }} />}
              </Box>

              <Paragraph size={'large'} sx={{ paddingY: 1, textAlign: 'center' }}>
                {'Signature (use the mouse to sign):'}
              </Paragraph>
              <Box
                sx={{
                  borderBottom: `1px solid ${MthColor.BLACK}`,
                  mx: 'auto',
                  width: 500,
                  textAlign: 'center',
                }}
              >
                <SignatureCanvas
                  canvasProps={{ width: 500, height: 100 }}
                  ref={(ref) => {
                    setSignatureRef(ref)
                  }}
                />
              </Box>
              <Paragraph
                size='medium'
                sx={{ textDecoration: 'underline', cursor: 'pointer', textAlign: 'center' }}
                onClick={() => resetSignature()}
              >
                Reset
              </Paragraph>
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.TEXTBOX: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <CssTextField
                name={extractContent(question.question)}
                label={extractContent(question.question)}
                placeholder='Entry'
                fullWidth
                focused
                value={''}
                onChange={() => {}}
                InputLabelProps={{ shrink: true }}
              />
              {roleLevel === RoleLevel.SUPER_ADMIN && question.sortable && <DragHandle />}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.TEXTFIELD: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <Subtitle fontWeight='600' sx={{ cursor: 'pointer', fontSize: '14px', paddingY: 1 }}>
                {extractContent(question?.question)}
              </Subtitle>
              <MthBulletEditor value={''} setValue={() => {}} />
              {roleLevel === RoleLevel.SUPER_ADMIN && question.sortable && (
                <DragHandle sx={{ right: '-90px', top: '0px' }} />
              )}
            </Box>
          </Grid>
        )
      }
      case QUESTION_TYPE.INFORMATION: {
        return (
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              {question.slug === 'reimbursement_total_amount_requested' && (
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '20px' }}>
                    {extractContent(question.question)}
                  </Subtitle>
                  <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '20px' }}>
                    {'$0.00'}
                  </Subtitle>
                </Box>
              )}
              {question.slug !== 'reimbursement_total_amount_requested' && (
                <Subtitle fontWeight='700' color={MthColor.SYSTEM_02} sx={{ cursor: 'pointer', fontSize: '18px' }}>
                  {extractContent(question.question)}
                </Subtitle>
              )}
              {roleLevel === RoleLevel.SUPER_ADMIN && question.sortable && (
                <DragHandle sx={{ right: '-90px', top: '-5px' }} />
              )}
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
                  question?.Options
                    ? question?.Options?.filter((item) => item?.label)?.map(
                        (option) =>
                          ({
                            label: option?.label,
                            value: false,
                            action: option.action || AdditionalQuestionAction.CONTINUE_TO_NEXT,
                          } as RadioGroupOption),
                      )
                    : []
                }
                handleChangeOption={() => {}}
              />
              {roleLevel === RoleLevel.SUPER_ADMIN && question.sortable && (
                <DragHandle sx={{ right: '-90px', top: '0px' }} />
              )}
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
                values={[]}
                setValues={() => {}}
                checkboxLists={
                  question?.Options
                    ? question?.Options?.filter((item) => item?.label)?.map(
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
              />
              {roleLevel === RoleLevel.SUPER_ADMIN && question.sortable && (
                <DragHandle sx={{ right: '-90px', top: '0px' }} />
              )}
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
        setFormTypeItems(tempItems)
      }
    }
  }, [studentSchedulePeriodsLoading, studentSchedulePeriodsData, selectedYear, isDirectOrder])

  return <>{renderQuestion(question)}</>
}
