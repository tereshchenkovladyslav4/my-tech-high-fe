import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography, FormGroup, FormControl, FormControlLabel, IconButton } from '@mui/material'
import { useFormikContext } from 'formik'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { DropDownItem } from '../../../../../../components/DropDown/types'
import { DropDown } from '../../../../../../components/DropDown/DropDown'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { Paragraph } from '../../../../../../components/Typography/Paragraph/Paragraph'
import { SYSTEM_07 } from '../../../../../../utils/constants'
import { useStyles } from '../styles'
import { EnrollmentQuestion, EnrollmentQuestionGroup, EnrollmentQuestionTab, OptionsType, QuestionTypes, ActionQuestionTypes, AdditionalQuestionType } from '../types'
import QuestionOptions from './Options'
import { EditorState, convertToRaw } from 'draft-js'
import Wysiwyg from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { convertFromHTML } from 'draft-convert'
import { TabContext } from '../TabContextProvider'
import EditLinkModal from '../components/EditLinkModal'
import { validationTypes } from '../../constant/defaultQuestions'

export default function AddNewQuestionModal({
  onClose,
  editItem,
  group,
  newQuestion,
}: {
  onClose: (e: boolean) => void // true: Close Add Question Modal false: Open Add Question Modal
  editItem?: EnrollmentQuestion
  group?: string
  newQuestion?: boolean
}) {
  const tabName = useContext(TabContext)
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

  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()

  const [validation, setValidation] = useState(editItem?.validation ? true : false || false)  
  const [displayAdmin, setDisplayAdmin] = useState(editItem?.display_admin || false)  
  const [validationType, setValidationType] = useState(editItem?.validation || 1)
  const [isDefaultQuestion, setIsDefaultQuestion] = useState(editItem?.default_question || false)

  const [question, setQuestion] = useState(editItem?.question || '')
  const [type, setType] = useState(editItem?.type || 1)
  const [required, setRequired] = useState(editItem?.required || false)  
  const [removable, setRemovable] = useState(editItem?.removable || false)
  const [options, setOptions] = useState<OptionsType[]>([
    ...(editItem?.options || [{ label: '', value: 1, action: 1 }]),
    { label: '', value: (editItem?.options?.length || 1) + 1 , action: 1},
  ])
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
  const [groupType, setGroupType] = useState(!newQuestion ? group : (dropdownOptions[0]?.value || -1))

  const [openLinkModal, setOpenLinkModal] = useState(false)
  const [agreement, setAgreement] = useState({
    text: editItem?.question || '', 
    type: editItem?.options?.length > 0 && editItem?.options[0]?.label || 'web', 
    link: editItem?.options?.length > 0 && editItem?.options[0]?.value || ''
  })

  const [actionType, setActionType] = useState(1)
  const [actionType2, setActionType2] = useState(1)

  useEffect(() => {
    if(type === 2 || type === 6 || type === 7 || type === 4){
      setActionType(1)
      setActionType2(1)
    }
  }, [type])
  // const [additionalQuestion, setAdditionalQuestion] = useState<AdditionalQuestionType>({
  //   question: editItem?.additional?.question || '',
  //   type: editItem?.additional?.type || 1,
  //   required: editItem?.additional?.required || false,
  //   options: [
  //     ...(editItem?.additional?.options || [{ label: '', value: 1 }]),
  //     { label: '', value: (editItem?.additional?.options?.length || 1) + 1 },
  //   ],
  //   action: editItem?.additional?.action || 1
  // })
  // const [additionalQuestion2, setAdditionalQuestion2] = useState<AdditionalQuestionType>({
  //   question: editItem?.additional2?.question || '',
  //   type: editItem?.additional2?.type || 1,
  //   required: editItem?.additional2?.required || false,
  //   options: [
  //     ...(editItem?.additional2?.options || [{ label: '', value: 1 }]),
  //     { label: '', value: (editItem?.additional2?.options?.length || 1) + 1 },
  //   ],
  //   action: editItem?.additional2?.action || 1
  // })
  const [additionalQuestion, setAdditionalQuestion] = useState(editItem?.additional?.question || '')
  const [additionalQuestion2, setAdditionalQuestion2] = useState(editItem?.additional2?.question || '')
  const [additionalQuestionType, setAdditionalQuestionType] = useState(editItem?.additional?.type || 1)
  const [additionalQuestionType2, setAdditionalQuestionType2] = useState(editItem?.additional2?.type || 1)
  const [additionalQuestionRequired, setAdditionalQuestionRequired] = useState(editItem?.additional?.required || false) 
  const [additionalQuestion2Required, setAdditionalQuestion2Required] = useState(editItem?.additional2?.required || false) 

  const [additionalOptions, setAdditionalOptions] = useState<OptionsType[]>([
    ...(editItem?.additional?.options || [{ label: '', value: 1, action: 1 }]),
    { label: '', value: (editItem?.additional?.options?.length || 1) + 1, action: 1 },
  ])

  const [additionalOptions2, setAdditionalOptions2] = useState<OptionsType[]>([
    ...(editItem?.additional2?.options || [{ label: '', value: 1, action: 1 }]),
    { label: '', value: (editItem?.additional2?.options?.length || 1) + 1, action: 1 },
  ])

  useEffect(() => {
    if (options.filter((a) => a.action === 2).length >= 1) {
      setActionType(2)
    }
    else {
      setActionType(1)
    }
  }, [options])

  useEffect(() => {
    if (additionalOptions.filter((a) => a.action === 2).length >= 1) {
      setActionType2(2)
    }
    else {
      setActionType2(1)
    }
  }, [additionalOptions])

  useEffect(() => {
    if(tabName === 'Documents' || tabName === 'Submission') {
      setGroupName('root')
    }
  }, [tabName])

  function onSave() {
    if(groupName === 'root' && !(tabName === 'Documents' || tabName === 'Submission')) {
      setError("Group name can't be root")
      return
    }

    if(addGroup && groupName.trim() === '') {
      setError('Group name is required')
      return
    }
    if(groupType === -1 && groupName !== 'root') {
      setError('Group is required')
      return
    }
    if (type === 4 ) {
      if(agreement.text.trim() === ''){
        setError('Text is required')
        return
      }
    } 
    else if (question.trim() === '' && type !== 7) {
      setError('Question is required')
      return
    }
    
    else if ([1, 3, 5].includes(type) && options.length && options[0].label.trim() === '' && editItem?.slug !== 'student_grade_level') {
      setError('Options are required')
      return
    }

    const currentGroup = currentTabData.groups.filter((v) => v.group_name === groupName || v.group_name === groupType)[0]
    if(addGroup && currentGroup) {
      setError('Group name is already existed')
      return
    }  
    let tempQuestionOrder = 1
    if(!addGroup && currentGroup) {
      tempQuestionOrder = currentGroup.questions.length + 1
    }

    const timestamp = + new Date()
    const additionalQuestionData = {
      type: additionalQuestionType,
      question: additionalQuestion,
      options: additionalOptions.filter((v) => v.label.trim()),  
      required: additionalQuestionRequired,
      slug: `meta_${timestamp}_additional`
    }

    const additionalQuestion2Data = {
      type: additionalQuestionType2,
      question: additionalQuestion2,
      options: additionalOptions2.filter((v) => v.label.trim()),    
      required: additionalQuestion2Required  ,
      slug: `meta_${timestamp}_additional2`
    }

    const questionItem = {
      id: editItem?.id,
      group_id: editItem?.group_id,
      type,
      question: type === 7 ? draftToHtml(convertToRaw(editorState.getCurrentContent())) : type === 4 ? agreement.text : question,
      order: editItem?.order || tempQuestionOrder,
      options: type === 4 ? [{label: agreement.type, value: agreement.link}] : options.filter((v) => v.label.trim()),
      required,
      removable,
      additional: additionalQuestionData,
      additional2: additionalQuestion2Data,      
      default_question: isDefaultQuestion,
      validation: validation ? validationType : 0,
      display_admin: displayAdmin,
      slug: editItem?.slug || `meta_${timestamp}`
    }

    if(!newQuestion) { //edit a question 
      if(group === groupType) {  // no change group type
        const updatedGroups = currentTabData.groups.map((v) => {
          if(v.group_name === groupType) {
            v.questions = v.questions.map((q) => q.question === editItem.question ? questionItem : q)
          }
          return v
        })
        const updatedTab = {...currentTabData, groups: updatedGroups, id: currentTabData.id}
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
    }
    else { //create a question 
      let groupItem: EnrollmentQuestionGroup
      if(currentGroup) {
        groupItem = {...currentGroup, questions: [...currentGroup.questions, questionItem]}
        const updatedGroups = currentTabData.groups.map((v) => (v.group_name === groupItem.group_name) ? groupItem : v)
        const updatedTab = {...currentTabData, groups: updatedGroups, id: currentTabData.id}
        setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
      }
      else {
        groupItem = {
          id: editItem?.group_id,
          tab_id: currentTabData.id,
          group_name: groupName,
          order: editItem?.order || currentTabData.groups.length + 1,
          questions: [questionItem],
        }
        const updatedTab = {...currentTabData, groups: [...currentTabData.groups, groupItem], id: currentTabData.id}
        setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
      }  
    }

    onClose(false)
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
          { groupName !== 'root' && (<Box
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
                pointerEvents: !newQuestion ? 'none' : 'unset',
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
          </Box>)}
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
              setParentValue={(v) => {
                setType(+v)
              }}
              size='small'
            />
          </Box>
          <Box mt='30px' width='100%' display='flex' flexDirection='column' maxHeight={'400px'} overflow='auto'>
            {type === 2 || type === 6 ? 
            (<Box height='50px' />) :
            type === 7 ? 
            (
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
            (
              <QuestionOptions options={options} setOptions={setOptions} type={type} isDefault = {isDefaultQuestion}/>
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
              <Checkbox checked={displayAdmin} onClick={() => setDisplayAdmin(!displayAdmin)} />
              <Subtitle size='small'>Display for Admin</Subtitle>
            </Box>
            <Box sx={{display: 'flex', alignItems: 'center', 
              width: '124px',}}>
              <Checkbox checked={required} onClick={() => setRequired(!required)} />
              <Subtitle size='small'>Required</Subtitle>
            </Box>
          </Box>
          <Box sx={{
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
              visibility: validation ? 'visible' : 'hidden',
              pointerEvents: isDefaultQuestion ? 'none' : 'unset',
              width: '200px',
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '124px',
            }}
          >
            <Checkbox checked={removable} onClick={() => setRemovable(!removable)} />
            <Subtitle size='small'>Removable</Subtitle>
          </Box>
        </Box>
          {actionType === 2 && (
            <Box>
              <Subtitle size='large'>Additional Questions</Subtitle>
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
                    minWidth: '300px',
                    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                      {
                        borderColor: SYSTEM_07,
                      },
                  }}
                  label='Question'
                  variant='outlined'
                  value={additionalQuestion}
                  onChange={(v) => setAdditionalQuestion(v.currentTarget.value)}
                  focused
                />
                <DropDown
                  sx={{
                    minWidth: '200px',
                    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                      {
                        borderColor: SYSTEM_07,
                      },
                  }}
                  labelTop
                  dropDownItems={ActionQuestionTypes}
                  placeholder='Type'
                  defaultValue={additionalQuestionType}
                  // @ts-ignore
                  setParentValue={(v) => setAdditionalQuestionType(+v)}
                  size='small'
                />
              </Box>
              <Box mt='30px' width='100%' display='flex' flexDirection='column'>
                <QuestionOptions options={additionalOptions} setOptions={setAdditionalOptions} type={additionalQuestionType}/>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: '40px',
                  mt: '40px',
                  display: 'flex',
                  // alignItems: 'center',
                  flexDirection: 'column',
                  alignItems: 'end',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                    <Checkbox checked={additionalQuestionRequired} onClick={() => setAdditionalQuestionRequired(!additionalQuestionRequired)} />
                    <Subtitle size='small'>Required</Subtitle>
                </Box>
              </Box>
            </Box>
          )}
          {actionType === 2 && actionType2 === 2 && (
            <Box>
              <Subtitle size='large'>Additional Questions</Subtitle>
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
                    minWidth: '300px',
                    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                      {
                        borderColor: SYSTEM_07,
                      },
                  }}
                  label='Question'
                  variant='outlined'
                  value={additionalQuestion2}
                  onChange={(v) => setAdditionalQuestion2(v.currentTarget.value)}
                  focused
                />
                <DropDown
                  sx={{
                    minWidth: '200px',
                    [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                      {
                        borderColor: SYSTEM_07,
                      },
                  }}
                  labelTop
                  dropDownItems={ActionQuestionTypes}
                  placeholder='Type'
                  defaultValue={additionalQuestionType2}
                  // @ts-ignore
                  setParentValue={(v) => setAdditionalQuestionType2(+v)}
                  size='small'
                />
              </Box>
              <Box mt='30px' width='100%' display='flex' flexDirection='column'>
                <QuestionOptions options={additionalOptions2} setOptions={setAdditionalOptions2} type={additionalQuestionType2} isAction={false}/>
              </Box>
              <Box
                sx={{
                  width: '100%',
                  height: '40px',
                  mt: '40px',
                  display: 'flex',
                  // alignItems: 'center',
                  flexDirection: 'column',
                  alignItems: 'end',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                    <Checkbox checked={additionalQuestion2Required} onClick={() => setAdditionalQuestion2Required(!additionalQuestion2Required)} />
                    <Subtitle size='small'>Required</Subtitle>
                </Box>
              </Box>
            </Box>
          )}
          {error && <Typography color='red'>{error}</Typography>}
          {openLinkModal && (<EditLinkModal onClose={() => setOpenLinkModal(false)} setOption={setAgreement} editItem={agreement}/>)}
        </Box>
        
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
