import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography, FormGroup, FormControl, FormControlLabel, IconButton } from '@mui/material'
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
import { Paragraph } from '../../../../../../components/Typography/Paragraph/Paragraph'
import EditLinkModal from '../../EnrollmentQuestions/components/EditLinkModal'

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

  const [agreement, setAgreement] = useState({
    text: editItem?.question || '', 
    type: editItem?.options?.length > 0 && editItem?.options[0]?.label || 'web', 
    link: editItem?.options?.length > 0 && editItem?.options[0]?.value || ''
  })
  const [openLinkModal, setOpenLinkModal] = useState(false)

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
    if (type === 4 ) {
      if(agreement.text.trim() === ''){
        setError('Text is required')
        return
      }
    } 
    else if (question.trim() === '' && type !== 7) {
      setError('Question is required')
      return
    } else if ([1, 3, 5].includes(type) && options.length && options[0].label.trim() === '' && !isDefaultQuestion) {
      setError('Options are required')
      return
    }
    const item = {
      id: editItem?.id,
      order: editItem?.order || values.length + 1,
      question: type === 7 ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : type === 4 ? agreement.text : question,
      type,
      options: type === 4 ? [{label: agreement.type, value: agreement.link}] : options.filter((v) => v.label.trim()),
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
              visibility: (type === 7 || type === 4) ? 'hidden' : 'visible',
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
        <Box mt='30px' width='100%' display='flex' flexDirection='column' maxHeight={'600px'} overflow='auto'>
          {type === 2 || type === 6 ? (
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
                handlePastedText={() => false}
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
          type === 4 ? 
          (
            <Box
              sx={{ 
                width: '80%',
                display: 'flex',
                py: '10px',
                justifyContent: 'space-between',
              }}
            >
              <FormControl
                required
                name='acknowledge'
                component="fieldset"
                variant="standard"
              >
                  <FormGroup>
                      <FormControlLabel
                        control={
                            <Checkbox  />
                        }
                        label={
                            <Paragraph size='large'>
                                {agreement.text || "Add text"}
                            </Paragraph>
                        }
                      />
                  </FormGroup>
              </FormControl>
              <IconButton onClick = {() => setOpenLinkModal(true)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <rect width="24" height="24" fill="url(#pattern0)" fill-opacity="0.5"/>
                  <defs>
                  <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_3343_40736" transform="scale(0.01)"/>
                  </pattern>
                  <image id="image0_3343_40736" width="100" height="100" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAAENElEQVR4nO3cS2xUVRzH8S8tMVGpbW0ZJC7kYcCwMoghYYML3CjRnVGbiu5UZM9aA2HDhoW64xU2hA0b3LAAEwMUH1SqQRay49VWAYsmSFsW/xlSZy5z/ueeW+rc+/skd9GZe//n3POfuedx7xREREREREREREREREREREREREREREREpMWiguPVgM3Ay8Ca+t9PFxD3JLAzMcYeYEsBdZkCxoHLwE/A6frf/xv9wA5gBJgBZudhO1pAPY/OU91mgLPAdqCvgHrm1o996u4wPyfaKQmZu90GdrMAiRkGbiRUvKwJaWzXgaEC6hzUAxx5jCfWqQlpbIeAJTGV7IrYtwacAt6PKaDihrE2q3kP8CakBnwLrM9Rqap7BWu7pZ6dPQnpAb4B1iZUqurWAidwTAEWO4J9Tfw34z42DL4C3ATuRR7f7GLi8QDHgd8TYzyBXS1WAa/ia7+GDcBXwAcpFRgmrhO7UC/w2ZRCO8QAdq6jxLVR7j64H//QdhxLXswgoSy6gG3ABP4hca55yh5nAReBlXnPpkRWA2P42mxXbPB+bNbpScYzaedRKr34knKLyG/JDkfQCexTIf+1AhvIhNrv05igI46Aw4VUv5y2EW6/M95gNcKrtqNUswP36gJ+pH0bzgCDzQdmjaNfI3yfZG89YF7rgCcTjn8c/gF+zXnsDLAP2N9mn0VYWx8LBdtF+8z+i43BU3hHIwu5jSWe4wDWVu3K+Lz5oKzLzppAQSPAZEpNK2IS+D6wT8tyVFZClgWCXPHWSIJt1bIKnJWQ0Pr9NXd15Grg/ZY5XJ6RUtEPRpRZdFtlJWQqcMzy2EIq7PnA+3eaX8hKyI1AkBXu6sgLgfdvNr+QlZDLgSAbyZjQSIsB7B5IO781v5A1MbwQCNINvAkc9NUr0zt0xsQwxVuEb2CNegItJbx08jOWGMnWja2Et2vDaSKuNGcDwWaxBTTJ9hHh9vsuJuBnjoCTwIuFVL9cVmJ3UEPt93FM0D58N6jGsJsyYnqBXwi325/kaLfdjsCNpKxKO49SWI0vGbPAF3kK6MNuyHsKmMD6lCreI+nG+oxJfG11lYTb3kPOQuaOvj4kfXm+Ewxi5xoaTTVv77YL6llrOUT87dpp4Dy22nmd8Ow/5BL2oFuKt4GXEmMsA57DLtEbiB/6H8C+TUmWYI0b8ykoeuvUp9/nbueAp0KV9Fzzp4A3yJjmi9slYCvwd2hHbyc8Dmwi4kkJeeg89rtL1+8QY0ZFfwCvA4dzVKqqDmAPMrSs6j5K7DD1LvaA8RDpHXWZXQPewzrw4GWqKH3YEyqeGX1VOvVb2KRvQVcverHHIs9gw92qJWQaWyj8hAISEfODk0e5DXxZ3wZp/ccBPQWUkfpDm0aMHwqI8xfWJ8z9xwF6LEpERERERERERERERERERERERERERERkPj0AfrEo+sYtddsAAAAASUVORK5CYII="/>
                  </defs>
                </svg>
              </IconButton>
            </Box>
          ) : 
          !isDefaultQuestion && (
            <QuestionOptions options={options} setOptions={setOptions} type={type} isDefault = {isDefaultQuestion} />
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
        {openLinkModal && (<EditLinkModal onClose={() => setOpenLinkModal(false)} setOption={setAgreement} editItem={agreement}/>)}
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
