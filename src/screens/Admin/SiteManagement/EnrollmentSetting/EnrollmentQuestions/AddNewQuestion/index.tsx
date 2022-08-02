import React, { useEffect, useState, useRef, useContext, FunctionComponent } from 'react'
import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'

import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useFormikContext } from 'formik'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { DropDown } from '../../../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../../../components/DropDown/types'
import { QuestionOptions } from '../../../../../../components/QuestionItem/AddNewQuestion/Options'
import { QUESTION_TYPE } from '../../../../../../components/QuestionItem/QuestionItemProps'

import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_07 } from '../../../../../../utils/constants'
import { CustomModal } from '../../components/CustomModal/CustomModals'
import { validationTypes } from '../../constant/defaultQuestions'

import { TabContext } from '../TabContextProvider'
import { EnrollmentQuestion, EnrollmentQuestionGroup, EnrollmentQuestionTab, QuestionTypes } from '../types'
// import QuestionOptions from './Options'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

type AddNewQuestionModalProps = {
  onClose: (e: boolean) => void // true: Close Add Question Modal false: Open Add Question Modal
  editItem?: EnrollmentQuestion[]
  group?: string
  isNewQuestion?: boolean
}

export const AddNewQuestionModal: FunctionComponent<AddNewQuestionModalProps> = ({
  onClose,
  editItem,
  group,
  isNewQuestion,
}) => {
  const tabName = useContext(TabContext)
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromBlockArray(htmlToDraft('').contentBlocks)),
  )
  const editorRef = useRef(null)
  const [deleteIds, setDeleteIds] = useState([])
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const [isDefaultQuestion] = useState(editItem[0]?.default_question || false)

  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()

  const [error, setError] = useState('')
  const currentTabData = values.filter((v) => v.tab_name === tabName)[0]
  const dropdownOptions: DropDownItem[] = currentTabData.groups.map((v) => {
    return {
      label: v.group_name,
      value: v.group_name,
    }
  })
  const [groupName, setGroupName] = useState('')
  const [addGroup, setAddGroup] = useState(false)
  const [groupType, setGroupType] = useState(!isNewQuestion ? group : dropdownOptions[0]?.value || -1)

  const templateQuestion: EnrollmentQuestion = {
    question: '',
    type: 1,
    group_id: editItem[0]?.group_id,
    options: [{ label: '', value: 1, action: 1 }],
    required: false,
    order: 1,
    display_admin: false,
    default_question: false,
    slug: editItem[0]?.slug || `meta_${+new Date()}`,
    additional_question: '',
  }
  const [editQuestions, setEditQuestions] = useState(editItem.length > 0 ? editItem : [templateQuestion])

  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)

      setQuestionValue(
        editQuestions[0].id,
        editQuestions[0].slug,
        'question',
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
      )
    } catch {}
  }

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
  const editQuestionsRef = useRef([])
  useEffect(() => {
    if (editQuestions.length == 0) {
      return
    }

    if (editQuestionsRef.current.length == 0 && editQuestions.length > 0) {
      //	Set Editor Content
      if (
        editQuestions[0].type == QUESTION_TYPE.AGREEMENT ||
        (editQuestions[0].type == QUESTION_TYPE.INFORMATION &&
          draftToHtml(convertToRaw(editorState.getCurrentContent())) != editQuestions[0].question)
      ) {
        setEditorState(
          EditorState.createWithContent(
            ContentState.createFromBlockArray(htmlToDraft(editQuestions[0].question).contentBlocks),
          ),
        )
      }
    }

    editQuestionsRef.current = editQuestions

    // if(editQuestions[0].default_question)
    // 	return;

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
        } else if (question.options[question.options.length - 1].label?.trim() != '') {
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
          type: QUESTION_TYPE.DROPDOWN,
          order: newQuestions.length + 1,
          question: '',
          default_question: false,
          additional_question: question.slug,
          validation: 0,
          slug: `meta_${+new Date()}`,
          options: [
            {
              value: 1,
              label: '',
              action: 1,
            },
          ],
          required: false,
          display_admin: question.display_admin,
        })
        bHasChange = true
      } else if (
        (question.options.find((o) => o.action == 2) == null ||
          question.type === QUESTION_TYPE.AGREEMENT ||
          question.type === QUESTION_TYPE.TEXTFIELD ||
          question.type === QUESTION_TYPE.CALENDAR ||
          question.type === QUESTION_TYPE.INFORMATION) && //	If no options is set to Ask an additional question
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

  useEffect(() => {
    if (tabName === 'Documents' || tabName === 'Submission') {
      setGroupName('root')
    }
  }, [tabName])

  function onSave() {
    if (groupName === 'root' && !(tabName === 'Documents' || tabName === 'Submission')) {
      setError("Group name can't be root")
      return
    }

    if (addGroup && groupName.trim() === '') {
      setError('Group name is required')
      return
    }
    if (groupType === -1 && groupName !== 'root') {
      setError('Group is required')
      return
    }

    const currentGroup = currentTabData.groups.filter(
      (v) => v.group_name === groupName || v.group_name === groupType,
    )[0]
    if (addGroup && currentGroup) {
      setError('Group name is already existed')
      return
    }
    let tempQuestionOrder = 1
    if (!addGroup && currentGroup) {
      tempQuestionOrder = currentGroup.questions.length + 1
    }

    const newQuestions = editQuestions.filter((x) => x.question.trim())
    const newQuestionsArr = []
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
        !newQuestion.default_question
      ) {
        setError('Options are required')
        return
      }

      //	Generate new object from the edited information
      const item: EnrollmentQuestion = {
        id: newQuestion.id,
        order: newQuestion.order || tempQuestionOrder,
        question:
          newQuestion.type === QUESTION_TYPE.INFORMATION || newQuestion.type === QUESTION_TYPE.AGREEMENT
            ? draftToHtml(convertToRaw(editorState.getCurrentContent()))
            : newQuestion.question,
        type: newQuestion.type,
        options: newQuestion.options.filter((v) => v.label.trim()),
        display_admin: newQuestion.display_admin,
        default_question: newQuestion.default_question,
        validation: newQuestion.validation,
        required: newQuestion.required,
        slug: newQuestion.slug || `meta_${+new Date()}`,
        additional_question: newQuestion.additional_question,
      }
      newQuestionsArr.push(item)
      // let id = newQuestion.id;
      // if(id === undefined) {	//	Insert case
      // 	//	Generate new id
      // 	item.id = newid--;
      // 	newValues.splice(newValues.length - 1, 0, item);
      // 	//newValues.push(item);
      // }
      // else {									//	Update case
      // 	newValues = newValues.map((v) => (v.id === newQuestion.id ? item : v));
      // }
    }

    // newValues = newValues.filter((i) => deleteIds.find(x => x == i.id) == null);

    if (!isNewQuestion) {
      //edit a question
      if (group === groupType) {
        // no change group type
        const updatedGroups = currentTabData.groups.map((v) => {
          if (v.group_name === groupType) {
            const existQuestions = []
            v.questions = v.questions.map((q) => {
              const updateItem = editItem.find((e) => e.slug === q.slug)
              if (updateItem) {
                existQuestions.push(newQuestionsArr.find((n) => n.slug === updateItem.slug))
                return newQuestionsArr.find((n) => n.slug === updateItem.slug)
              } else {
                return q
              }
            })
            const addQuestions = newQuestionsArr.filter((n) => existQuestions.find((q) => q.slug === n.slug) == null)
            v.questions = v.questions.concat(addQuestions).map((q, index) => {
              return { ...q, order: index + 1 }
            })
          }
          return v
        })
        const updatedTab = { ...currentTabData, groups: updatedGroups, id: currentTabData.id }
        setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
      } else {
        //  group: oldGroup
        //  groupName: newGroup
        const groups = currentTabData.groups
        let newGroupName: string = groupName
        if (!currentGroup) {
          groups.push({
            id: undefined,
            tab_id: currentTabData.id,
            group_name: groupName,
            order: currentTabData.groups.length + 1,
            questions: [],
          })
        } else {
          newGroupName = groupType
        }
        const updatedTab = {
          ...currentTabData,
          groups: groups.map((g) => {
            if (g.group_name == group) {
              //  Remove from oldGroup
              // const questions = g.questions.filter(q => q.id !== editItem[0].id);
              const questions = g.questions.filter((q) => editItem.find((e) => e.id === q.id) == null)
              for (let i = 0; i < questions.length; i++) {
                questions[i].order = i + 1
              }
              return {
                ...g,
                questions: questions,
              }
            } else if (g.group_name == newGroupName) {
              //  Add to new Group
              const questions = g.questions.concat(newQuestionsArr)
              for (let i = 0; i < questions.length; i++) {
                questions[i].order = i + 1
              }
              return {
                ...g,
                questions: questions,
              }
            }
            return g
          }),
        }
        setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
      }
      // else { // change group type
      //   const doubleQuestion = currentTabData.groups.filter((v) => v.group_name === groupType)[0].questions.filter((q) => q.question === question)
      //   if(doubleQuestion.length > 0) {
      //     setError('Quesion is already existed in this group')
      //     return
      //   }
      //   const oldGroup = currentTabData.groups.filter((v) => v.group_name !== group)
      //   const newValues = values.map((v) => {
      //     if(v.tab_name === "Personal") {
      //         const newGroups = v.groups.map((g) => {
      //             if(g.group_name === group) {
      //                 g.questions = g.questions.filter((q) => q.question !== editItem.question).sort((a, b) => a.order - b.order).map((item, index) => {
      //                     item.order = index + 1
      //                     return item
      //                 })
      //             }
      //             return g
      //         })
      //         v.groups = newGroups
      //     }
      //     return v
      //   })
      //   let updatedTab = {...currentTabData, groups: oldGroup}

      // }
    } else {
      //create a question
      let groupItem: EnrollmentQuestionGroup
      if (currentGroup) {
        groupItem = {
          ...currentGroup,
          questions: currentGroup.questions.concat(newQuestionsArr).map((q, index) => {
            return { ...q, order: index + 1 }
          }),
        }
        const updatedGroups = currentTabData.groups.map((v) => (v.group_name === groupItem.group_name ? groupItem : v))
        const updatedTab = { ...currentTabData, groups: updatedGroups, id: currentTabData.id }
        setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
      } else {
        groupItem = {
          id: editItem && editItem[0]?.group_id,
          tab_id: currentTabData.id,
          group_name: groupName,
          order: editItem[0]?.order || currentTabData.groups.length + 1,
          questions: newQuestionsArr,
        }
        const updatedTab = { ...currentTabData, groups: [...currentTabData.groups, groupItem], id: currentTabData.id }
        setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
      }
    }

    onClose(false)
  }

  const [clickedEvent, setClickedEvent] = useState({})
  const [warningPopup, setWarningPopup] = useState(false)
  const [ableToEdit, setAbleToEdit] = useState(false)

  const setCancelWarningPopup = () => {
    setWarningPopup(false)
    setAbleToEdit(false)
  }

  const setConfirmWarningPopup = () => {
    setWarningPopup(false)
    setAbleToEdit(true)
  }

  useEffect(() => {
    if (ableToEdit == true) clickedEvent.target.focus()
  }, [ableToEdit])

  const setFocused = (event) => {
    if (!isDefaultQuestion) return

    if (!ableToEdit || clickedEvent.target != event.target) {
      event.preventDefault()
      event.target.blur()
      setClickedEvent(event)
      setWarningPopup(true)
    }
  }

  const setBlured = () => {
    setAbleToEdit(false)
  }

  return (
    <>
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
            py: 2,
            px: 4,
          }}
        >
          <Box
            sx={{
              width: '100%',
              // minHeight: '460px',
              maxHeight: '90vh',
              overflow: 'auto',
              py: 4,
              px: 2,
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
              <Button sx={styles.cancelButton} onClick={() => onClose(true)}>
                Cancel
              </Button>
              <Button sx={styles.actionButtons} onClick={() => onSave()}>
                Save
              </Button>
            </Box>
            {groupName !== 'root' && (
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
                    visibility: addGroup ? 'visible' : 'hidden',
                    minWidth: '300px',
                    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                      {
                        borderColor: SYSTEM_07,
                      },
                  }}
                  label='Group Name'
                  variant='outlined'
                  value={groupName}
                  onChange={(v) => setGroupName(v.currentTarget.value)}
                  focused
                />
                <DropDown
                  sx={{
                    pointerEvents: 'unset',
                    minWidth: '200px',
                    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                      {
                        borderColor: SYSTEM_07,
                      },
                  }}
                  labelTop
                  dropDownItems={dropdownOptions}
                  placeholder='Add to Group'
                  defaultValue={groupType}
                  // @ts-ignore
                  setParentValue={(v) => {
                    setAddGroup(v === 0)
                    setGroupType(v)
                  }}
                  size='small'
                  isAddable
                />
              </Box>
            )}

            {editQuestions.map((e, i) => (
              <>
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
                        e.type === QUESTION_TYPE.INFORMATION || e.type === QUESTION_TYPE.AGREEMENT
                          ? 'hidden'
                          : 'visible',
                      minWidth: '300px',
                      [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                        {
                          borderColor: SYSTEM_07,
                        },
                    }}
                    label='Question'
                    variant='outlined'
                    value={e.question}
                    onChange={(v) => setQuestionValue(e.id, e.slug, 'question', v.currentTarget.value)}
                    onFocus={(v) => {
                      if (i == 0) setFocused(v)
                    }}
                    onBlur={(v) => {
                      if (i == 0) setBlured(v)
                    }}
                    focused
                    // disabled={e.default_question}
                  />
                  <DropDown
                    sx={{
                      pointerEvents: e.default_question ? 'none' : 'unset',
                      minWidth: '200px',
                      [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                        {
                          borderColor: SYSTEM_07,
                        },
                    }}
                    labelTop
                    dropDownItems={QuestionTypes}
                    placeholder='Type'
                    defaultValue={e.type}
                    // @ts-ignore
                    setParentValue={(v) => {
                      setQuestionValue(e.id, e.slug, 'type', +v)
                    }}
                    size='small'
                  />
                </Box>
                <Box
                  mt='30px'
                  width='100%'
                  display='flex'
                  flexDirection='column'
                  maxHeight={'calc(100vh - 353px);'}
                  overflow='auto'
                >
                  {e.type === QUESTION_TYPE.TEXTFIELD || e.type === QUESTION_TYPE.CALENDAR ? (
                    <Box height='50px' />
                  ) : e.type === QUESTION_TYPE.INFORMATION || e.type === QUESTION_TYPE.AGREEMENT ? (
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
                        handlePastedText={() => false}
                        onFocus={(v) => {
                          if (i == 0) setFocused(v)
                        }}
                        onBlur={(v) => {
                          if (i == 0) setBlured(v)
                        }}
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
                    <QuestionOptions
                      options={e.options}
                      setOptions={(options) => setQuestionValue(e.id, e.slug, 'options', options)}
                      type={e.type}
                      setFocused={i == 0 ? setFocused : setBlured}
                      setBlured={setBlured}
                      isDefault={i == 0 ? isDefaultQuestion : false}
                    />
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
                      visibility: e.type === QUESTION_TYPE.TEXTFIELD ? 'visible' : 'hidden',
                    }}
                  >
                    <Checkbox
                      checked={e.validation ? true : false}
                      onClick={() => setQuestionValue(e.id, e.slug, 'validation', e.validation ? 0 : 1)}
                      disabled={e.default_question && e.type !== QUESTION_TYPE.TEXTFIELD}
                    />
                    <Subtitle size='small'>Validation</Subtitle>
                  </Box>
                  {!e.additional_question && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={e.display_admin}
                        onClick={() => setQuestionValue(e.id, e.slug, 'display_admin', !e.display_admin)}
                      />
                      <Subtitle size='small'>Display for Admin</Subtitle>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '124px' }}>
                    <Checkbox
                      checked={e.required}
                      onClick={() => setQuestionValue(e.id, e.slug, 'required', !e.required)}
                    />
                    <Subtitle size='small'>Required</Subtitle>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: '40px',
                    mt: '10px',
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <DropDown
                    sx={{
                      visibility: e.type === QUESTION_TYPE.TEXTFIELD && e.validation ? 'visible' : 'hidden',
                      pointerEvents: e.default_question && e.type != QUESTION_TYPE.TEXTFIELD ? 'none' : 'unset',
                      width: '200px',
                      [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                        {
                          borderColor: SYSTEM_07,
                        },
                    }}
                    labelTop
                    dropDownItems={validationTypes}
                    placeholder='Type'
                    defaultValue={e.validation}
                    // @ts-ignore
                    setParentValue={(v) => setQuestionValue(e.id, e.slug, 'validation', +v)}
                    size='small'
                  />
                </Box>
              </>
            ))}
            {error && <Typography color='red'>{error}</Typography>}
          </Box>
        </Box>
      </Modal>
      {warningPopup && (
        <CustomModal
          title='Default Question'
          description='You are attempting to edit a default question. You may customize the way the question is asked, but the default ask of question will remain the same in the application. Are you sure you want to edit?'
          cancelStr='No'
          confirmStr='Yes'
          onClose={() => {
            setCancelWarningPopup()
          }}
          onConfirm={() => {
            setConfirmWarningPopup()
          }}
        />
      )}
    </>
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
