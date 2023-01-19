import React, { useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Grid, List } from '@mui/material'
import { useFormikContext } from 'formik'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { ReimbursementFormType } from '@mth/enums'
import { ReimbursementQuestion } from '@mth/models'
import { mthButtonClasses } from '@mth/styles/button.style'
import { REIMBURSEMENT_DEFAULT_QUESTION, REIMBURSEMENT_DEFAULT_QUESTIONS } from '../../defaultValues'
import { DefaultQuestionModal } from '../DefaultQuestionModal'
import { QuestionEditModal } from '../QuestionEditModal'
import { QuestionItem } from '../QuestionItem'

export type RequestFormEditProps = {
  formType: ReimbursementFormType
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  setIsChanged: (value: boolean) => void
}

const SortableItem = SortableElement(QuestionItem)

const SortableListContainer = SortableContainer(({ items }: { items: ReimbursementQuestion[] }) => (
  <Grid item xs={12}>
    <List>
      <Grid container rowSpacing={3}>
        {items.map((item, index) => (
          <SortableItem index={index} key={`${item.slug}_${index}`} question={item} setIsChanged={() => {}} />
        ))}
      </Grid>
    </List>
  </Grid>
))

export const RequestFormEdit: React.FC<RequestFormEditProps> = ({
  formType,
  selectedYearId,
  isDirectOrder,
  setIsChanged,
}) => {
  const { values, setValues } = useFormikContext<ReimbursementQuestion[]>()
  const [showDefaultQuestionModal, setShowDefaultQuestionModal] = useState<boolean>(false)
  const [selectedDefaultQuestion, setSelectedDeafaultQuestion] = useState<REIMBURSEMENT_DEFAULT_QUESTION>()
  const [showQuestionEditModal, setShowQuestionEditModal] = useState<boolean>(false)
  const sortableList = values
    .filter((item) => item.sortable && !item.additional_question)
    .sort((a, b) => {
      if (a.priority > b.priority) return 1
      else if (a.priority > b.priority) return -1
      else return 0
    })
  const sortNonableList = values?.filter((item) => !item.sortable && !item.additional_question)

  const handleAddDefaultQuestionAction = (value: REIMBURSEMENT_DEFAULT_QUESTION) => {
    setSelectedDeafaultQuestion(value)
    setShowQuestionEditModal(true)
  }

  const handleCreateCustomQuestionAction = () => {
    setShowQuestionEditModal(true)
  }

  const handleCloseQuestionEditModal = () => {
    setShowQuestionEditModal(false)
  }

  const handleSaveQuestionEditModal = (questions: ReimbursementQuestion[]) => {
    setValues([...values, ...questions])
    setShowQuestionEditModal(false)
    setShowDefaultQuestionModal(false)
  }

  const arrangeItems = (items: ReimbursementQuestion[]) => {
    const newValues: ReimbursementQuestion[] = sortNonableList
    items.map(async (item, index) => {
      const correctPriority = index + sortNonableList?.length
      values?.map((value) => {
        if (value?.slug === item?.slug) {
          value.priority = correctPriority
          newValues.push(value)
        }
      })
    })
    setValues(newValues)
  }

  return (
    <>
      <Grid container rowSpacing={3}>
        {sortNonableList?.map((question, index) => (
          <QuestionItem key={index} question={question} setIsChanged={setIsChanged} />
        ))}
        {!!sortableList?.length && (
          <SortableListContainer
            items={sortableList}
            useDragHandle={true}
            onSortEnd={({ oldIndex, newIndex }) => {
              const newSortableList = arrayMove(sortableList, oldIndex, newIndex)
              arrangeItems(newSortableList)
            }}
          />
        )}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Button sx={{ ...mthButtonClasses.roundGray, padding: '17px 80px' }}>Save Draft</Button>
            <Button sx={{ ...mthButtonClasses.roundDark, padding: '17px 80px' }} type='submit'>
              Submit
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 5 }}>
            <Button
              sx={{ ...mthButtonClasses.primary }}
              startIcon={<AddIcon />}
              onClick={() => setShowDefaultQuestionModal(true)}
            >
              Add Question
            </Button>
          </Box>
        </Grid>
      </Grid>
      {showDefaultQuestionModal && (
        <DefaultQuestionModal
          defaultQuestions={REIMBURSEMENT_DEFAULT_QUESTIONS}
          onClose={() => setShowDefaultQuestionModal(false)}
          onAddDefaultQuestion={handleAddDefaultQuestionAction}
          onCustomQuestion={handleCreateCustomQuestionAction}
        />
      )}
      {showQuestionEditModal && (
        <QuestionEditModal
          formType={formType}
          selectedYearId={selectedYearId}
          isDirectOrder={isDirectOrder}
          defaultQuestion={selectedDefaultQuestion as REIMBURSEMENT_DEFAULT_QUESTION}
          onClose={handleCloseQuestionEditModal}
          onSave={handleSaveQuestionEditModal}
        />
      )}
    </>
  )
}
