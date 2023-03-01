import React, { useEffect, useState } from 'react'
import { Box, Button, Modal, TextField } from '@mui/material'
import { ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckboxList } from '@mth/components/MthCheckboxList'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { QuestionTypes, defaultExcuseAssignmentLog, defaultExcuseAssignmentExplain } from '@mth/constants'
import { mthButtonClasses } from '@mth/styles/button.style'
import { questionCheckboxList } from '../../LearningLogs/defaultValue'
import { LearningLogQuestion } from '../../LearningLogs/types'
import AddCheckListModal from './AddCheckListModal'
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
  const [excuseAssignmentLog, setExcuseAssignmentLog] = useState<string>(defaultExcuseAssignmentLog)
  const [excuseAssignmentExplain, setExcuseAssignmentExplain] = useState<string>(defaultExcuseAssignmentExplain)

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

  const handleSaveExcuseQuestion = () => {
    if (!excuseAssignmentLog || !excuseAssignmentExplain) {
      setIsError(true)
      return
    }
    const parent_slug = `meta_${+new Date()}`
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
        slug: `meta_1${+new Date()}`,
        parent_slug: parent_slug,
        active: false,
        response: '',
      },
    ])
  }

  useEffect(() => {
    if (questions && questions.length > 0) {
      setQuestion(questions[0].question)
      setCheckboxList(questions[0]?.validations ?? [])
    }
  }, [questions])

  if (type === 'Subject Checklist') {
    return <AddCheckListModal onClose={onClose} schoolYearId={schoolYearId} onSave={onSave} />
  }

  return (
    <Modal open={true} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      {type === 'Option to Excuse a Learning Log' ? (
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
      ) : (
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
      )}
    </Modal>
  )
}

export default AddNewQuestionModal
