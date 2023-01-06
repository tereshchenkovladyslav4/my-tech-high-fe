import React, { useEffect, useState } from 'react'
import { Box, Button, Modal } from '@mui/material'
import { QUESTION_TYPE } from '@mth/enums'
import { ReimbursementFormType } from '@mth/enums'
import { ReimbursementQuestion } from '@mth/models'
import { mthButtonClasses } from '@mth/styles/button.style'
import { QuestionEdit } from './QuestionEdit'
import { questionEditClasses } from './styles'

export type QuestionEditModalProps = {
  defaultQuestionOptionId: number
  questions?: ReimbursementQuestion[]
  formType: ReimbursementFormType
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  onClose: () => void
  onSave: (value: ReimbursementQuestion[]) => void
}

export const QuestionEditModal: React.FC<QuestionEditModalProps> = ({
  defaultQuestionOptionId,
  questions,
  formType,
  isDirectOrder,
  selectedYearId,
  onClose,
  onSave,
}) => {
  const [editQuestions, setEditQuestions] = useState<ReimbursementQuestion[]>([
    {
      type: QUESTION_TYPE.TEXTFIELD,
      default_question: defaultQuestionOptionId ? true : false,
      required: false,
      display_for_admin: false,
      priority: 0,
      question: '',
      options: '',
      SchoolYearId: selectedYearId || 0,
      slug: `meta_${+new Date()}`,
      reimbursement_form_type: formType,
      is_direct_order: isDirectOrder ? true : false,
      sortable: true,
    },
  ])

  const handleClickSave = async () => {
    onSave(editQuestions)
  }

  const handleResetEditQuestion = (question: ReimbursementQuestion) => {
    setEditQuestions(
      editQuestions?.map((item) => {
        if (item?.slug === question?.slug) return question
        else return item
      }),
    )
  }

  const handleDeleteAdditionalQuestion = (question: ReimbursementQuestion) => {
    if (!question?.additional_question)
      setEditQuestions(
        editQuestions
          ?.filter((item) => !item.additional_question)
          .map((item) => {
            if (item?.slug === question?.slug) return question
            else return item
          }),
      )
    else
      setEditQuestions(
        editQuestions
          ?.filter((item) => item.additional_question !== question.slug)
          .map((item) => {
            if (item?.slug === question?.slug) return question
            else return item
          }),
      )
  }

  const handleAddAdditionalQuestion = (question: ReimbursementQuestion, additionalQuestion: ReimbursementQuestion) => {
    setEditQuestions([
      ...editQuestions?.map((item) => {
        if (item?.slug === question?.slug) return question
        else return item
      }),
      additionalQuestion,
    ])
  }

  useEffect(() => {
    if (questions?.length) setEditQuestions(questions)
  }, [questions])

  return (
    <Modal open={true} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={questionEditClasses.modalContainer}>
        <Box sx={questionEditClasses.btnGroup}>
          <Button sx={mthButtonClasses.roundSmallGray} onClick={onClose}>
            Cancel
          </Button>
          <Button sx={mthButtonClasses.roundSmallDark} onClick={handleClickSave}>
            Save
          </Button>
        </Box>
        {editQuestions?.map((editQuestion, index) => (
          <QuestionEdit
            key={index}
            editQuestion={editQuestion}
            setEditQuestion={handleResetEditQuestion}
            addAdditionalQuestion={handleAddAdditionalQuestion}
            deleteAdditionalQuestion={handleDeleteAdditionalQuestion}
          />
        ))}
      </Box>
    </Modal>
  )
}
