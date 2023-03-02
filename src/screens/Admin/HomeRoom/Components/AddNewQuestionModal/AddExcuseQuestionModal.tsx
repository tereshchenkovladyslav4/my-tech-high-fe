import React, { useState } from 'react'
import { Box, Button, Modal, TextField } from '@mui/material'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { QuestionTypes, defaultExcuseAssignmentLog, defaultExcuseAssignmentExplain } from '@mth/constants'
import { mthButtonClasses } from '@mth/styles/button.style'
import { LearningLogQuestion } from '../../LearningLogs/types'
import { addNewQuestionClasses } from './styles'
export type AddExcuseQuestionModalProps = {
  onClose: () => void
  onSave: (value: LearningLogQuestion[]) => void
  editQuestionList?: LearningLogQuestion[]
}

const AddExcuseQuestionModal: React.FC<AddExcuseQuestionModalProps> = ({ onClose, onSave, editQuestionList }) => {
  const [isError, setIsError] = useState<boolean>(false)

  const [excuseAssignmentLog, setExcuseAssignmentLog] = useState<string>(
    (editQuestionList && editQuestionList[0].question) || defaultExcuseAssignmentLog,
  )
  const [excuseAssignmentExplain, setExcuseAssignmentExplain] = useState<string>(
    (editQuestionList && editQuestionList[1].question) || defaultExcuseAssignmentExplain,
  )

  const handleSaveExcuseQuestion = () => {
    if (!excuseAssignmentLog || !excuseAssignmentExplain) {
      setIsError(true)
      return
    }
    const parent_slug = (editQuestionList && editQuestionList[0].slug) || `meta_${+new Date()}`
    onSave([
      {
        type: QuestionTypes.AGREEMENT,
        question: excuseAssignmentLog,
        slug: parent_slug,
        parent_slug: '',
        active: true,
        response: '',
      },
      {
        type: QuestionTypes.TEXTBOX,
        question: excuseAssignmentExplain,
        slug: (editQuestionList && editQuestionList[1].slug) || `meta_1${+new Date()}`,
        parent_slug: parent_slug,
        active: false,
        response: '',
      },
    ])
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      data-testid='excuse-question'
    >
      <Box sx={addNewQuestionClasses.modalContainer}>
        <Box sx={addNewQuestionClasses.modalContent}>
          <TextField
            name='type'
            label='Type'
            placeholder='Entry'
            fullWidth
            value='Agreement'
            sx={{ my: 1, maxWidth: '50%' }}
          />
          <Box sx={addNewQuestionClasses.btnGroup}>
            <Button sx={mthButtonClasses.roundGray} onClick={onClose}>
              Cancel
            </Button>
            <Button sx={mthButtonClasses.roundDark} onClick={handleSaveExcuseQuestion}>
              Save
            </Button>
          </Box>
        </Box>

        <Box>
          <Subtitle>Question</Subtitle>
          <MthBulletEditor
            value={excuseAssignmentLog}
            setValue={(value) => setExcuseAssignmentLog(value)}
            error={isError}
            height='150px'
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Subtitle>When selected, display the additional question below:</Subtitle>
          <Box sx={addNewQuestionClasses.modalContent}>
            <TextField
              name='type'
              label='Type'
              placeholder='Entry'
              fullWidth
              value='Text box'
              sx={{ my: 1, maxWidth: '50%' }}
            />
          </Box>

          <Box>
            <Subtitle>Question</Subtitle>
            <MthBulletEditor
              value={excuseAssignmentExplain}
              setValue={(value) => setExcuseAssignmentExplain(value)}
              error={isError}
              height='150px'
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default AddExcuseQuestionModal
