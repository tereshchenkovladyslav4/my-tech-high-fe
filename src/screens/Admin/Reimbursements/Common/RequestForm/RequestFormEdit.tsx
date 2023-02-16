import React, { ReactNode, useContext, useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box, Button, Grid } from '@mui/material'
import { useFormikContext } from 'formik'
import { ReimbursementFormType, ReimbursementRequestStatus, RoleLevel } from '@mth/enums'
import { ReimbursementQuestion } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { mthButtonClasses } from '@mth/styles/button.style'
import { REIMBURSEMENT_DEFAULT_QUESTION, REIMBURSEMENT_DEFAULT_QUESTIONS } from '../../defaultValues'
import { DefaultQuestionModal } from '../DefaultQuestionModal'
import { QuestionEditModal } from '../QuestionEditModal'

export type RequestFormEditProps = {
  isToBuildForm: boolean
  formType: ReimbursementFormType | undefined
  isDirectOrder?: boolean
  selectedYearId: number | undefined
  selectedStudentId: number
  selectedFormType?: ReimbursementFormType | undefined
  setFormType: (value: ReimbursementFormType | undefined) => void
  setIsChanged: (value: boolean) => void
  handleSaveQuestions: (value: ReimbursementQuestion[]) => void
  onSubmitRequests: (values: ReimbursementQuestion[], status: ReimbursementRequestStatus) => void
  children: ReactNode
}

export const RequestFormEdit: React.FC<RequestFormEditProps> = ({
  isToBuildForm,
  formType,
  selectedYearId,
  isDirectOrder,
  selectedStudentId,
  selectedFormType,
  setFormType,
  handleSaveQuestions,
  onSubmitRequests,
  children,
}) => {
  const { me } = useContext(UserContext)
  const roleLevel = me?.role?.level
  const { values, setValues } = useFormikContext<ReimbursementQuestion[]>()
  const [showDefaultQuestionModal, setShowDefaultQuestionModal] = useState<boolean>(false)
  const [selectedDefaultQuestion, setSelectedDeafaultQuestion] = useState<REIMBURSEMENT_DEFAULT_QUESTION>()
  const [showQuestionEditModal, setShowQuestionEditModal] = useState<boolean>(false)

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

  useEffect(() => {
    if (selectedFormType) setFormType(selectedFormType)
  }, [selectedFormType])

  return (
    <>
      <Grid container rowSpacing={3}>
        {children}
        {(isToBuildForm || (roleLevel != RoleLevel.SUPER_ADMIN && !!selectedStudentId && !!selectedFormType)) && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button
                sx={{ ...mthButtonClasses.roundGray, padding: '17px 40px', width: '200px' }}
                onClick={() => onSubmitRequests(values, ReimbursementRequestStatus.DRAFT)}
              >
                Save Draft
              </Button>
              <Button sx={{ ...mthButtonClasses.roundDark, padding: '17px 40px', width: '200px' }} type='submit'>
                Submit
              </Button>
            </Box>
          </Grid>
        )}
        {isToBuildForm && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: 5 }}>
              <Button
                sx={{ ...mthButtonClasses.primary, padding: '7px 40px', height: 'auto' }}
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
