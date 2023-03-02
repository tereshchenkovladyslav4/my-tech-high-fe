import React, { useState } from 'react'
import { Box, Button, Modal, TextField } from '@mui/material'
import { ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { QuestionTypes } from '@mth/constants'
import { mthButtonClasses } from '@mth/styles/button.style'
import { questionCheckboxList } from '../../LearningLogs/defaultValue'
import { LearningLogQuestion } from '../../LearningLogs/types'
import AddCheckListModal from './AddCheckListModal'
import AddExcuseQuestionModal from './AddExcuseQuestionModal'
import { addNewQuestionClasses } from './styles'
export type AddNewQuestionModalProps = {
  questions?: LearningLogQuestion[]
  type: string
  onClose: () => void
  onSave: (value: LearningLogQuestion[]) => void
  schoolYearId: number
}

const AddNewQuestionModal: React.FC<AddNewQuestionModalProps> = ({
  type,
  onClose,
  onSave,
  schoolYearId,
  questions,
}) => {
  const [question, setQuestion] = useState<string>()
  const [checkboxList, setCheckboxList] = useState<string[]>([])
  const [isError, setIsError] = useState<boolean>(false)

  const handleClickSave = async () => {
    if (question) {
      const contentBlock = htmlToDraft(question as string)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        if (editorState.getCurrentContent().hasText()) {
          const validationList = []
          if (checkboxList.includes('required')) {
            validationList.push('required')
          }
          if (checkboxList.includes('uploadOption')) {
            validationList.push('can_upload')
          }
          const dataToSave = [
            {
              type: QuestionTypes.INDEPENDENT_QUESTION,
              question,
              slug: questions?.[0]?.slug ?? `meta_${+new Date()}`,
              default_question: true,
              validations: validationList,
              page: 1,
            },
          ]
          onSave(dataToSave)
        } else {
          setIsError(true)
        }
      }
    } else {
      setIsError(true)
    }
  }

  if (type === 'Subject Checklist') {
    return <AddCheckListModal onClose={onClose} schoolYearId={schoolYearId} onSave={onSave} />
  }

  if (type === 'Option to Excuse a Learning Log') {
    return <AddExcuseQuestionModal onClose={onClose} onSave={onSave} />
  }

  return (
    <Modal open={true} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={addNewQuestionClasses.modalContainer}>
        <Box sx={addNewQuestionClasses.modalContent}>
          <TextField
            name='title'
            label='Title'
            placeholder='Entry'
            fullWidth
            value={type}
            sx={{ my: 1, maxWidth: '50%' }}
          />
          <Box sx={addNewQuestionClasses.btnGroup}>
            <Button sx={mthButtonClasses.roundGray} onClick={onClose}>
              Cancel
            </Button>
            <Button sx={mthButtonClasses.roundDark} onClick={handleClickSave}>
              Save
            </Button>
          </Box>
        </Box>

        <Box>
          <MthBulletEditor value={question} setValue={(value) => setQuestion(value)} error={isError} />
        </Box>
        <Box sx={{ mt: 2 }}>
          <MthCheckboxList
            values={checkboxList}
            setValues={(value) => {
              setCheckboxList(value)
            }}
            checkboxLists={questionCheckboxList}
            haveSelectAll={false}
          />
        </Box>
      </Box>
    </Modal>
  )
}

export default AddNewQuestionModal
