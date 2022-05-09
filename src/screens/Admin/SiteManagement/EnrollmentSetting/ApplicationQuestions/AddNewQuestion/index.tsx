import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useState, useRef } from 'react'
import { DropDown } from '../../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_07 } from '../../../../../../utils/constants'
import { ApplicationQuestion, OptionsType, QuestionTypes } from '../types'
import QuestionOptions from './Options'
import { EditorState, convertToRaw } from 'draft-js'
import Wysiwyg from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { convertFromHTML } from 'draft-convert'
import { validationTypes } from '../../constant/defaultQuestions'

export default function AddNewQuestionModal({
  onClose,
  editItem,
  newQuestion,
}: {
  onClose: () => void
  editItem?: ApplicationQuestion
  newQuestion?: boolean
}) {
  const { values, setValues } = useFormikContext<ApplicationQuestion[]>()
  const [question, setQuestion] = useState(editItem?.question || '')
  const [type, setType] = useState(editItem?.type || 1)  
  const [validationType, setValidationType] = useState(editItem?.validation || 1)
  const [isDefaultQuestion, setIsDefaultQuestion] = useState(editItem?.default_question || false)
  const [required, setRequired] = useState(editItem?.required || false)
  const [addStudent, setAddStudent] = useState(editItem?.student_question || false)  
  const [validation, setValidation] = useState(editItem?.validation ? true : false || false)
  const [options, setOptions] = useState<OptionsType[]>([
    ...(editItem?.options || [{ label: '', value: 1 }]),
    { label: '', value: (editItem?.options?.length || 1) + 1 },
  ])

  const [error, setError] = useState('')

  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromHTML(editItem?.question || '')))
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  function onSave() {
    if (question.trim() === '' && type !== 7) {
      setError('Question is required')
      return
    } else if ([1, 3, 5].includes(type) && options.length && options[0].label.trim() === '' && !isDefaultQuestion) {
      setError('Options are required')
      return
    }
    const item = {
      id: editItem?.id,
      order: editItem?.order || values.length + 1,
      question: type === 7 ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : question,
      type,
      options: options.filter((v) => v.label.trim()),
      required,
      default_question: isDefaultQuestion,
      validation: validation ? validationType : 0,
      student_question: addStudent,
      slug: editItem?.slug || `meta_${+ new Date()}`
    }
    if (!newQuestion) {
      setValues(values.map((v) => (v.question === editItem.question ? item : v)))
    }
    else {
      setValues([...values, item])
    }

    onClose()
  }

  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          bgcolor: '#fff',
          borderRadius: 8,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: '40px',
            width: '100%',
            justifyContent: 'end',
          }}
        >
          <Button sx={styles.cancelButton} onClick={() => onClose()}>
            Cancel
          </Button>
          <Button sx={styles.actionButtons} onClick={() => onSave()}>
            Save
          </Button>
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '40px',
            mt: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            size='small'
            sx={{
              visibility: (type === 7) ? 'hidden' : 'visible',
              minWidth: '300px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: SYSTEM_07,
              },
            }}
            label='Question'
            variant='outlined'
            value={question}
            onChange={(v) => setQuestion(v.currentTarget.value)}
            focused
            disabled={isDefaultQuestion}
          />
          <DropDown
            sx={{
              pointerEvents: isDefaultQuestion ? 'none' : 'unset',
              minWidth: '200px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: SYSTEM_07,
              },
            }}
            labelTop
            dropDownItems={QuestionTypes}
            placeholder='Type'
            defaultValue={type}
            // @ts-ignore
            setParentValue={(v) => setType(+v)}
            size='small'
          />
        </Box>
        <Box mt='30px' width='100%' display='flex' flexDirection='column'>
          {type === 2 || type === 4 || type === 6 ? (
            <Box height='50px' />
          ) : type === 7 ? (
            <Box sx={{
              border: '1px solid #d1d1d1',
              borderRadius: 1,
              'div.DraftEditor-editorContainer': {
                minHeight: '200px',
                maxHeight: '250px',
                overflow: 'auto',
                padding: 1,
              },
            }}>
              <Wysiwyg.Editor
                onContentStateChange={handleEditorChange}
                editorRef={(ref) => (editorRef.current = ref)}
                editorState={editorState}
                onEditorStateChange={setEditorState}
                toolbar={{
                  options: [
                    'inline', 
                    'list',
                    'link',
                  ],
                  inline: {
                    options: ['bold', 'italic'],
                  },
                  list: {
                    options: ['unordered', 'ordered'],
                  }
                }}
              />
            </Box>
          ) :
          !isDefaultQuestion && (
            <QuestionOptions options={options} setOptions={setOptions} type={type} />
          )}
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '40px',
            mt: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{display: 'flex', alignItems: 'center', visibility: type === 2 ? 'visible' : 'hidden'}}>
            <Checkbox checked={validation} onClick={() => setValidation(!validation)} disabled={isDefaultQuestion}/>
            <Subtitle size='small'>Validation</Subtitle>
          </Box>
          <Box sx={{display: 'flex', alignItems: 'center',}}>
            <Checkbox checked={addStudent} onClick={() => setAddStudent(!addStudent)} />
            <Subtitle size='small'>Add Student Question</Subtitle>
          </Box>
          <Box sx={{display: 'flex', alignItems: 'center',}}>
            <Checkbox checked={required} onClick={() => setRequired(!required)} />
            <Subtitle size='small'>Required</Subtitle>
          </Box>
        </Box>
        <Box sx={{
            width: '100%',
            height: '40px',
            mt: '40px',
            alignItems: 'center',
            justifyContent: 'start',
            display: validation ? 'flex' : 'none',
          }}
        >
          <DropDown
            sx={{
              pointerEvents: isDefaultQuestion ? 'none' : 'unset',
              minWidth: '200px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
              {
                borderColor: SYSTEM_07,
              },
            }}
            labelTop
            dropDownItems={validationTypes}
            placeholder='Type'
            defaultValue={validationType}
            // @ts-ignore
            setParentValue={(v) => setValidationType(+v)}
            size='small'
          />
        </Box>
        {error && <Typography color='red'>{error}</Typography>}
      </Box>
    </Modal>
  )
}

const styles = {
  actionButtons: {
    borderRadius: 4,

    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    fontWeight: 'bold',
    padding: '11px 60px',
    color: 'white',
  },
  cancelButton: {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #D23C33 0%, rgba(62, 39, 131, 0) 100%) #D23C33',
    fontWeight: 'bold',
    mr: 2,
    color: 'white',
    padding: '11px 60px',
  },
}
