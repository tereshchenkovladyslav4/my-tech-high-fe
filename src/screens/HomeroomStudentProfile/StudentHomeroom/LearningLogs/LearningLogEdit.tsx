import React, { useMemo, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Button, Grid } from '@mui/material'
import { cloneDeep } from 'lodash'
import { DropDownItem } from '@mth/components/DropDown/types'
import { RadioGroupOption } from '@mth/components/MthRadioGroup/types'
import { MthStepper } from '@mth/components/MthStepper'
import { PageBlock } from '@mth/components/PageBlock'
import { SuccessModal } from '@mth/components/SuccessModal/SuccessModal'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { QuestionTypes } from '@mth/constants'
import { MthColor, StudentLearningLogStatus } from '@mth/enums'
import { saveStudentLearningLogMutation } from '@mth/graphql/mutation/student-learning-log'
import { useLearningLogQuestionsByAssignmentId } from '@mth/hooks/useLearningLogQuestionsByAssignmentId'
import { Assignment, LearningLogQuestion } from '@mth/models'
import { requestComponentClasses } from '@mth/screens/Admin/Reimbursements/Common/styles'
import { mthButtonClasses } from '@mth/styles/button.style'
import { LearningLogQuestionItem } from './LearningLogQuestionItem'

type LearningLogEditProps = {
  learningLog: Assignment
  schoolYearId: number
  setSelectedLearningLog: (value: Assignment | undefined) => void
}

export const LearningLogEdit: React.FC<LearningLogEditProps> = ({
  learningLog,
  schoolYearId,
  setSelectedLearningLog,
}) => {
  const [selectedPageNumber, setSelectedPageNumber] = useState<number>(1)
  const [activeStep, setActiveStep] = useState<number>(0)
  const [showError, setShowError] = useState<boolean>(false)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const currentStudentId = Number(location.pathname.split('/').at(-1))
  const totalPageCount = useMemo(() => {
    return learningLog?.page_count || 1
  }, [learningLog])

  const { learningLogQuestions, setLearingLogQuestions } = useLearningLogQuestionsByAssignmentId(learningLog?.id)

  const selectedQuestions = useMemo(() => {
    if (learningLogQuestions?.length) {
      return learningLogQuestions?.filter((question) => question?.page == selectedPageNumber && question?.active)
    } else return []
  }, [learningLogQuestions, selectedPageNumber])

  const studentLearningLogId = useMemo(() => {
    if (learningLog?.StudentLearningLogs?.length) return learningLog?.StudentLearningLogs?.at(0)?.id
    else return 0
  }, [learningLog])

  const [submitSave] = useMutation(saveStudentLearningLogMutation)

  const handleNextStep = () => {
    setActiveStep(activeStep + 1)
    setSelectedPageNumber(selectedPageNumber + 1)
  }

  const handleSelectStep = (step: number) => {
    setActiveStep(step)
    setSelectedPageNumber(step + 1)
  }

  const handleChangeValue = (question: LearningLogQuestion) => {
    const questionIndex = learningLogQuestions?.findIndex((value) => value?.slug == question.slug)
    const newQuestions = [...learningLogQuestions]
    newQuestions[questionIndex] = question
    newQuestions.forEach((item: LearningLogQuestion, index: number) => {
      if (item.parent_slug) {
        const parent = newQuestions.find((x) => item.parent_slug == x.slug)
        if (
          (parent?.type !== QuestionTypes.AGREEMENT &&
            parent?.answer &&
            parent?.Options?.find((x: DropDownItem | RadioGroupOption) => x.value == parent.answer)?.action == 2 &&
            parent?.active) ||
          (parent?.type === QuestionTypes.AGREEMENT && !!parent.answer)
        ) {
          newQuestions[index] = {
            ...item,
            active: true,
          }
        } else {
          newQuestions[index] = {
            ...item,
            active: false,
          }
        }
      } else {
        newQuestions[index] = item
      }
    })
    setLearingLogQuestions(cloneDeep(newQuestions))
  }

  const isInvalid = (questions: LearningLogQuestion[]): boolean => {
    if (questions?.length > 0) {
      let invalidationCount = 0
      questions?.map((question) => {
        if (!question.parent_slug && !question.answer && question.required) {
          invalidationCount++
        }
        if (question.parent_slug) {
          const parent = questions?.find((x) => question.parent_slug == x.slug)
          if (
            (parent?.type !== QuestionTypes.AGREEMENT &&
              parent?.answer &&
              parent?.Options?.find((x: DropDownItem | RadioGroupOption) => x.value == parent.answer)?.action == 2 &&
              parent?.active) ||
            (parent?.type === QuestionTypes.AGREEMENT && !!parent.answer)
          ) {
            if (!question.answer && question.required) {
              invalidationCount++
            }
          }
        }
      })
      if (invalidationCount > 0) return true
    }
    return false
  }

  const onSave = async () => {
    const meta = learningLogQuestions?.map((question) => `"${question?.slug}":"${question?.answer}"`)?.join(',')
    const response = await submitSave({
      variables: {
        createStudentLearningLogInput: {
          id: studentLearningLogId || 0,
          StudentId: currentStudentId,
          SchoolYearId: schoolYearId,
          AssignmentId: +(learningLog?.id || 0),
          meta: `{${meta}}`,
          status: StudentLearningLogStatus.SUBMITTED,
        },
      },
    })
    if (response?.data?.createOrUpdateStudentLearningLog?.id) {
      setShowSuccessModal(true)
    }
  }

  const handleSubmit = () => {
    if (isInvalid(learningLogQuestions)) {
      setShowError(true)
      const invalidPageNumber = learningLogQuestions?.find((question) => !question.answer && question.required)?.page
      setSelectedPageNumber(invalidPageNumber || 1)
      setActiveStep(invalidPageNumber ? invalidPageNumber - 1 : 0)
    } else {
      onSave()
    }
  }

  return (
    <PageBlock>
      <Box sx={{ ...requestComponentClasses.container, backgroundSize: 'cover' }}>
        <Box sx={{ paddingY: 4, paddingX: 10, textAlign: 'left', minWidth: '400px' }}>
          <Grid container rowSpacing={3}>
            {selectedQuestions?.map((question, index) => {
              return (
                <LearningLogQuestionItem
                  key={index}
                  question={question}
                  showError={showError}
                  schoolYearId={schoolYearId}
                  handleChangeValue={handleChangeValue}
                />
              )
            })}
          </Grid>
        </Box>
        <Box sx={{ paddingY: 4 }}></Box>
        {selectedPageNumber < totalPageCount ? (
          <Button sx={{ ...mthButtonClasses.roundDark, width: '170px' }} onClick={() => handleNextStep()}>
            Next
          </Button>
        ) : (
          <Button
            name={'Submit'}
            sx={{ ...mthButtonClasses.roundPrimary, width: '170px' }}
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        )}
        <Box sx={{ paddingY: 4 }}>
          <Subtitle
            sx={{ fontSize: '20.62px', fontWeight: 700, color: MthColor.SYSTEM_02 }}
          >{`${selectedPageNumber}/${totalPageCount}`}</Subtitle>
        </Box>
        <Box sx={{ paddingY: 4, width: '100%' }}>
          <MthStepper activeStep={activeStep} totalPageCount={totalPageCount} setSelectStep={handleSelectStep} />
        </Box>
        {showSuccessModal && (
          <SuccessModal
            title='Success'
            subtitle={
              <Paragraph size='large' color={MthColor.SYSTEM_01} textAlign='center'>
                {'This Weekly Learning Log has been submitted.'}
              </Paragraph>
            }
            btntitle='Done'
            handleSubmit={() => {
              setShowSuccessModal(false)
              setSelectedLearningLog(undefined)
            }}
          />
        )}
      </Box>
    </PageBlock>
  )
}
