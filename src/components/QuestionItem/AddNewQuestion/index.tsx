import React, { useState, useRef, useEffect, FunctionComponent } from 'react'
import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useFormikContext } from 'formik'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { SYSTEM_07 } from '../../../utils/constants'
import { DropDown } from '../../DropDown/DropDown'
import { Subtitle } from '../../Typography/Subtitle/Subtitle'
import { Question, QUESTION_TYPE } from '../QuestionItemProps'
import { QuestionOptions } from './Options'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type QuestionModalProps = {
  onClose: (result: boolean) => void
  questions?: Question[]
  questionTypes: unknown[]
  additionalQuestionTypes: unknown[]
}
export const QuestionModal: FunctionComponent<QuestionModalProps> = ({
  onClose,
  questions,
  questionTypes,
  additionalQuestionTypes,
}) => {
  const validationTypes = [
    {
      label: 'Email',
      value: 2,
    },
    {
      label: 'Numbers',
      value: 1,
    },
  ]

  //	Formik values context
  const { values, setValues } = useFormikContext<Question[]>()

  const [editQuestions, setEditQuestions] = useState(JSON.parse(JSON.stringify(questions)))
  const [deleteIds, setDeleteIds] = useState([])

  const editQuestionsRef = useRef([])

  useEffect(() => {
    if (editQuestions.length == 0) {
      return
    }

    if (editQuestionsRef.current.length == 0 && editQuestions.length > 0) {
      //	Set Editor Content
      if (editQuestions[0].type == QUESTION_TYPE.AGREEMENT || editQuestions[0].type == QUESTION_TYPE.INFORMATION) {
        if (draftToHtml(convertToRaw(editorState.getCurrentContent())) != editQuestions[0].question) {
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(htmlToDraft(editQuestions[0].question).contentBlocks),
            ),
          )
        }
      }
    }

    editQuestionsRef.current = editQuestions

    if (editQuestions[0].defaultQuestion) return

    //	Detect Changes
    let bHasChange = false
    const newQuestions = editQuestions.map((question) => {
      if (
        [QUESTION_TYPE.MULTIPLECHOICES, QUESTION_TYPE.CHECKBOX, QUESTION_TYPE.DROPDOWN].find((x) => x == question.type)
      ) {
        if (question.options.length == 0) {
          bHasChange = true
          return {
            ...question,
            options: [
              {
                value: 1,
                label: '',
              },
            ],
          }
        } else if (question.options[question.options.length - 1].label.trim() != '') {
          bHasChange = true
          return {
            ...question,
            options: [
              ...question.options,
              {
                value: question.options.length + 1,
                label: '',
              },
            ],
          }
        } else {
          return question
        }
      } else {
        return question
      }
    })

    //	Handle additional questions
    for (let i = 0; i < newQuestions.length; i++) {
      const question = newQuestions[i]
      if (
        question.options.find((o) => o.action == 2) && //	If one option is set to Ask an additional question
        i == newQuestions.length - 1
      ) {
        //	And no additional question exists
        //	Add One
        newQuestions.push({
          id: undefined,
          region_id: newQuestions[0].region_id,
          section: newQuestions[0].section,
          type: QUESTION_TYPE.DROPDOWN,
          sequence: newQuestions[0].sequence,
          question: '',
          defaultQuestion: false,
          mainQuestion: false,
          additionalQuestion: question.slug,
          validation: 0,
          slug: `meta_${+new Date()}`,
          options: [
            {
              value: 1,
              label: '',
            },
          ],
          required: false,
          response: '',
        })
        bHasChange = true
      } else if (
        question.options.find((o) => o.action == 2) == null && //	If no options is set to Ask an additional question
        i < newQuestions.length - 1
      ) {
        //	And this is the latest question
        bHasChange = true
        //	Remove all following additional questions
        for (let j = newQuestions.length - 1; j > i; j--) {
          if (newQuestions[j].id != undefined) {
            deleteIds.push(newQuestions[j].id)
          }
          newQuestions.pop()
        }
        setDeleteIds(deleteIds)
      }
    }

    if (bHasChange) setEditQuestions(newQuestions)
  }, [editQuestions])

  //	The fields of editItem(Question)
  const setQuestionValue = (id, slug, field, value) => {
    const newQuestions = editQuestions.map((question) => {
      if (question.id == id && question.slug == slug) {
        //	We compare slug if id is undefined when adding new question
        question[field] = value
        return question
      } else {
        return question
      }
    })

    setEditQuestions(newQuestions)
  }

  //	Error State
  const [error, setError] = useState('')

  //	Editor related states and functions
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft('').contentBlocks)),
  )
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)

      setQuestionValue(
        questions[0].id,
        questions[0].slug,
        'question',
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
      )
    } catch {}
  }

  //	Save handler
  function onSave() {
    const newQuestions = editQuestions.filter((x) => x.question.trim())

    let newValues = values.map((v) => v)

    const min = Math.min.apply(
      null,
      values.map((value) => value.id),
    )
    let newid = min - 1
    //	-9 ~ 0 is reserved
    if (newid > -10) newid = -10

    for (let i = 0; i < newQuestions.length; i++) {
      const newQuestion = newQuestions[i]
      //	Validation check
      if (
        newQuestion.question.trim() === '' &&
        newQuestion.type !== QUESTION_TYPE.INFORMATION &&
        newQuestion.type !== QUESTION_TYPE.AGREEMENT
      ) {
        setError('Question is required')
        return
      } else if (
        [QUESTION_TYPE.DROPDOWN, QUESTION_TYPE.CHECKBOX, QUESTION_TYPE.MULTIPLECHOICES].includes(newQuestion.type) &&
        newQuestion.options.length &&
        newQuestion.options[0].label.trim() === '' &&
        !newQuestion.defaultQuestion
      ) {
        setError('Options are required')
        return
      }

      //	Generate new object from the edited information
      const item: Question = {
        id: newQuestion.id,
        region_id: newQuestion.region_id,
        section: newQuestion.section || 'quick-link-withdrawal',
        sequence: newQuestion.sequence || newValues.length + 1,
        question:
          newQuestion.type === QUESTION_TYPE.INFORMATION || newQuestion.type === QUESTION_TYPE.AGREEMENT
            ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
            : newQuestion.question,
        type: newQuestion.type,
        options: newQuestion.options.filter((v) => v.label.trim()),
        mainQuestion: false,
        defaultQuestion: newQuestion.defaultQuestion,
        validation: newQuestion.validation,
        required: newQuestion.required,
        slug: newQuestion.slug || `meta_${+new Date()}`,
        additionalQuestion: newQuestion.additionalQuestion,

        response: '',
      }

      const id = newQuestion.id
      if (id === undefined) {
        //	Insert case
        //	Generate new id
        item.id = newid--
        newValues.splice(newValues.length - 1, 0, item)
        //newValues.push(item);
      } else {
        //	Update case
        newValues = newValues.map((v) => (v.id === newQuestion.id ? item : v))
      }
    }

    newValues = newValues.filter((i) => deleteIds.find((x) => x == i.id) == null)
    setValues(newValues)

    onClose(true)
  }

  //	Set default options for default questions
  // useEffect(() => {
  // 	if(options.length == 0 && editItem?.defaultQuestion) {
  // 		switch(editItem?.slug) {
  // 			case 'student_grade_level':
  // 				break;
  // 			case 'address_state':
  // 				break;
  // 			case 'student_gender':
  // 				break;
  // 			case 'packet_school_district':
  // 				break;
  // 			case 'address_country_id':
  // 				break;
  // 			case 'program_year':
  // 				break;
  // 			default:
  // 				if(editItem?.type == QUESTION_TYPE.MULTIPLECHOICES
  // 					|| editItem?.type == QUESTION_TYPE.DROPDOWN
  // 					|| editItem?.type == QUESTION_TYPE.CHECKBOX) {
  // 					console.warn(editItem);
  // 				}
  // 				break;
  // 		}
  // 	}
  // }, [options]);

  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          maxHeight: '97vh',
          overflowY: 'auto',
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
          <Button sx={styles.cancelButton} onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button sx={styles.actionButtons} onClick={() => onSave()}>
            Save
          </Button>
        </Box>
        {editQuestions.map((newQuestion, i) => (
          <Box key={i}>
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
                  visibility:
                    newQuestion.type === QUESTION_TYPE.INFORMATION || newQuestion.type == QUESTION_TYPE.AGREEMENT
                      ? 'hidden'
                      : 'visible',
                  minWidth: '400px',
                  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                    {
                      borderColor: SYSTEM_07,
                    },
                }}
                label='Question'
                variant='outlined'
                value={newQuestion.question}
                onChange={(v) => {
                  setQuestionValue(newQuestion.id, newQuestion.slug, 'question', v.currentTarget.value)
                }}
                focused
                disabled={newQuestion.defaultQuestion}
              />
              <DropDown
                sx={{
                  pointerEvents: newQuestion.defaultQuestion ? 'none' : 'unset',
                  minWidth: '200px',
                  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                    {
                      borderColor: SYSTEM_07,
                    },
                  marginRight: '50px',
                }}
                labelTop
                dropDownItems={i == 0 ? questionTypes : additionalQuestionTypes}
                placeholder='Type'
                defaultValue={newQuestion.type}
                // @ts-ignore
                setParentValue={(v) => {
                  setQuestionValue(newQuestion.id, newQuestion.slug, 'type', +v)
                }}
                size='small'
              />
            </Box>
            <Box mt='30px' width='100%' display='flex' flexDirection='column'>
              {newQuestion.type === QUESTION_TYPE.TEXTFIELD || newQuestion.type === QUESTION_TYPE.CALENDAR ? (
                <Box height='50px' />
              ) : newQuestion.type === QUESTION_TYPE.INFORMATION || newQuestion.type === QUESTION_TYPE.AGREEMENT ? (
                <Box
                  sx={{
                    border: '1px solid #d1d1d1',
                    borderRadius: 1,
                    'div.DraftEditor-editorContainer': {
                      minHeight: '200px',
                      maxHeight: '250px',
                      overflow: 'auto',
                      padding: 1,
                    },
                  }}
                >
                  <Wysiwyg.Editor
                    onContentStateChange={handleEditorChange}
                    editorRef={(ref) => (editorRef.current = ref)}
                    editorState={editorState}
                    onEditorStateChange={setEditorState}
                    toolbar={{
                      options: ['inline', 'list', 'link'],
                      inline: {
                        options: ['bold', 'italic'],
                      },
                      list: {
                        options: ['unordered', 'ordered'],
                      },
                    }}
                  />
                </Box>
              ) : (
                !newQuestion.defaultQuestion && (
                  <QuestionOptions
                    options={newQuestion.options}
                    setOptions={(options) => setQuestionValue(newQuestion.id, newQuestion.slug, 'options', options)}
                    type={newQuestion.type}
                  />
                )
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  visibility: newQuestion.type === QUESTION_TYPE.TEXTFIELD ? 'visible' : 'hidden',
                }}
              >
                <Checkbox
                  checked={newQuestion.validation ? true : false}
                  onClick={() => {
                    setQuestionValue(newQuestion.id, newQuestion.slug, 'validation', newQuestion.validation ? 0 : 1)
                  }}
                  disabled={newQuestion.defaultQuestion}
                />
                <Subtitle size='small'>Validation</Subtitle>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={newQuestion.required ? true : false}
                  onClick={() => {
                    setQuestionValue(newQuestion.id, newQuestion.slug, 'required', newQuestion.required ? 0 : 1)
                  }}
                />
                <Subtitle size='small'>Required</Subtitle>
              </Box>
            </Box>
            <Box
              sx={{
                width: '100%',
                height: '40px',
                mt: '40px',
                alignItems: 'center',
                justifyContent: 'start',
                display: newQuestion.validation ? 'flex' : 'none',
              }}
            >
              <DropDown
                sx={{
                  pointerEvents: newQuestion.defaultQuestion ? 'none' : 'unset',
                  minWidth: '200px',
                  [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                    {
                      borderColor: SYSTEM_07,
                    },
                }}
                labelTop
                dropDownItems={validationTypes}
                placeholder='Type'
                defaultValue={newQuestion.validation}
                // @ts-ignore
                setParentValue={(v) => {
                  setQuestionValue(newQuestion.id, newQuestion.slug, 'validation', +v)
                }}
                size='small'
              />
            </Box>
          </Box>
        ))}
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
