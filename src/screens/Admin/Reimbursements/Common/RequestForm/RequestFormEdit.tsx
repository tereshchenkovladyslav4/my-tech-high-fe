import React, { useContext, useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Grid, List } from '@mui/material'
import { useFormikContext } from 'formik'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'
import { ReimbursementFormType, RoleLevel } from '@mth/enums'
import { ReimbursementQuestion, SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { mthButtonClasses } from '@mth/styles/button.style'
import { REIMBURSEMENT_DEFAULT_QUESTION, REIMBURSEMENT_DEFAULT_QUESTIONS } from '../../defaultValues'
import { DefaultQuestionModal } from '../DefaultQuestionModal'
import { QuestionEditModal } from '../QuestionEditModal'
import { QuestionItem } from '../QuestionItem'

export type RequestFormEditProps = {
  formType: ReimbursementFormType | undefined
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  selectedYear: SchoolYear | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  setIsChanged: (value: boolean) => void
  handleSaveQuestions: (value: ReimbursementQuestion[]) => void
}

type SortableContainerProps = {
  items: ReimbursementQuestion[]
  selectedYearId: number | undefined
  selectedStudentId: number
  selectedYear: SchoolYear | undefined
  selectedFormType: ReimbursementFormType | undefined
  isDirectOrder: boolean | undefined
  setQuestion: (value: ReimbursementQuestion) => void
  setSelectedStudentId: (value: number) => void
  setSelectedFormType: (value: ReimbursementFormType | undefined) => void
}
const SortableItem = SortableElement(QuestionItem)

const SortableListContainer = SortableContainer(
  ({
    items,
    selectedStudentId,
    selectedFormType,
    selectedYearId,
    selectedYear,
    isDirectOrder,
    setQuestion,
    setSelectedStudentId,
    setSelectedFormType,
  }: SortableContainerProps) => (
    <Grid item xs={12}>
      <List>
        <Grid container rowSpacing={3}>
          {items.map((item, index) => (
            <SortableItem
              index={index}
              key={`${item.slug}_${index}`}
              question={item}
              isDirectOrder={isDirectOrder}
              setQuestion={setQuestion}
              selectedYearId={selectedYearId}
              selectedYear={selectedYear}
              selectedStudentId={selectedStudentId}
              selectedFormType={selectedFormType}
              setSelectedStudentId={setSelectedStudentId}
              setSelectedFormType={setSelectedFormType}
              setIsChanged={() => {}}
            />
          ))}
        </Grid>
      </List>
    </Grid>
  ),
)

export const RequestFormEdit: React.FC<RequestFormEditProps> = ({
  formType,
  selectedYearId,
  isDirectOrder,
  selectedYear,
  setFormType,
  setIsChanged,
  handleSaveQuestions,
}) => {
  const { me } = useContext(UserContext)
  const roleLevel = me?.role?.level
  const { values, setValues } = useFormikContext<ReimbursementQuestion[]>()
  const [showDefaultQuestionModal, setShowDefaultQuestionModal] = useState<boolean>(false)
  const [selectedDefaultQuestion, setSelectedDeafaultQuestion] = useState<REIMBURSEMENT_DEFAULT_QUESTION>()
  const [showQuestionEditModal, setShowQuestionEditModal] = useState<boolean>(false)
  const [selectedStudentId, setSelectedStudentId] = useState<number>(0)
  const [selectedFormType, setSelectedFormType] = useState<ReimbursementFormType>()
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
    handleSaveQuestions([...values, ...questions])
    setValues([...values, ...questions])
    setShowQuestionEditModal(false)
    setShowDefaultQuestionModal(false)
  }

  const setQuestion = (question: ReimbursementQuestion) => {
    const questionIndex = values?.findIndex((value) => value?.slug == question.slug)
    values[questionIndex] = question
    setValues(JSON.parse(JSON.stringify(values)))
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
    handleSaveQuestions(newValues)
    setValues(newValues)
  }

  useEffect(() => {
    if (selectedFormType) setFormType(selectedFormType)
  }, [selectedFormType])

  return (
    <>
      <Grid container rowSpacing={3}>
        {sortNonableList?.map((question, index) => (
          <QuestionItem
            key={index}
            question={question}
            setQuestion={setQuestion}
            isDirectOrder={isDirectOrder}
            selectedYear={selectedYear}
            selectedYearId={selectedYearId}
            selectedStudentId={selectedStudentId}
            selectedFormType={selectedFormType}
            setSelectedStudentId={setSelectedStudentId}
            setSelectedFormType={setSelectedFormType}
            setIsChanged={setIsChanged}
          />
        ))}
        {!!sortableList?.length && (
          <SortableListContainer
            items={sortableList}
            useDragHandle={true}
            setQuestion={setQuestion}
            selectedYear={selectedYear}
            isDirectOrder={isDirectOrder}
            selectedYearId={selectedYearId}
            selectedStudentId={selectedStudentId}
            selectedFormType={selectedFormType}
            setSelectedStudentId={setSelectedStudentId}
            setSelectedFormType={setSelectedFormType}
            onSortEnd={({ oldIndex, newIndex }) => {
              const newSortableList = arrayMove(sortableList, oldIndex, newIndex)
              arrangeItems(newSortableList)
            }}
          />
        )}
        {(roleLevel === RoleLevel.SUPER_ADMIN || (!!selectedStudentId && !!selectedFormType)) && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button sx={{ ...mthButtonClasses.roundGray, padding: '17px 80px' }}>Save Draft</Button>
              <Button sx={{ ...mthButtonClasses.roundDark, padding: '17px 80px' }} type='submit'>
                Submit
              </Button>
            </Box>
          </Grid>
        )}
        {roleLevel === RoleLevel.SUPER_ADMIN && (
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
        )}
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
