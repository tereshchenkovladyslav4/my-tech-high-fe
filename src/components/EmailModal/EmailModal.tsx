/* eslint-disable no-unused-expressions */
import { Alert, Button, Modal, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import React, { useContext, useRef, useState, useMemo, useEffect } from 'react'
import { EmailModalTemplateType } from './types'
import { useStyles } from './styles'
import { useMutation, useQuery } from '@apollo/client'
import { ContentState, EditorState, convertToRaw, ContentBlock } from 'draft-js'
import { StandardResponses } from './StandardReponses/StandardResponses'
import { Title } from '../Typography/Title/Title'
import { studentContext } from '../../screens/Admin/EnrollmentPackets/EnrollmentPacketModal/providers'
import { cloneDeep } from 'lodash'
import { convertFromHTML } from 'draft-convert'
import { getEmailTemplateQuery } from '../../graphql/queries/email-template'

import Wysiwyg from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export const EmailModal = ({ handleSubmit, handleModem, title, options, setEmailTemplate, type, setEmailFrom, emailFrom }) => {
  let actionType = ''
  type === 'ageIssue' ? (actionType = 'AGE_ISSUE') : (actionType = 'MISSING_INFO')

  // const student = useContext(studentContext)
  // const setEmailBodyInfo = (email: string) => {
  //   const yearbegin = new Date(student.grade_levels[0].school_year.date_begin).getFullYear().toString()
  //   const yearend = new Date(student.grade_levels[0].school_year.date_end).getFullYear().toString()
  //   return email
  //     .replace(/<STUDENT_ID>/g, student.student_id + '')
  //     .replace(/<STUDENT NAME>/g, student.person.first_name)
  //     .replace(/<PARENT>/g, student.parent.person.first_name)
  //     .replace(/<STUDENT GRADE>/g, student.grade_level)
  //     .replace(/<SCHOOL YEAR>/g, `${yearbegin}-${yearend.substring(2, 4)}`)
  // }
  // const localOptions = useMemo(() => cloneDeep(options), [])
  // const defaultEmail = useMemo(() => setEmailBodyInfo(localOptions.default.replace('<NOTICE>\n', '')), [])
  // const classes = useStyles
  // const [editorState, setEditorState] = useState(
  //   EditorState.createWithContent(ContentState.createFromText(defaultEmail)),
  // )
  // const [subject, setSubject] = useState('')
  // const [alert, setAlert] = useState(false)
  // const editorRef = useRef(null)
  // const [currentBlocks, setCurrentBlocks] = useState(0)
  // const onSubmit = () => {
  //   const email: string = draftToHtml(convertToRaw(editorState.getCurrentContent()))
  //   if (email.search(/\[BLANK\]/g) >= 0) {
  //     setAlert(true)
  //     return
  //   }
  //   if (handleSubmit) {
  //     handleSubmit(subject, draftToHtml(convertToRaw(editorState.getCurrentContent())), localOptions)
  //   }
  // }
  // const buildEmail = (): string | null => {
  //   let oneChecked = false
  //   const embededOptions: Array<string> = localOptions.type === 'AGE_ISSUE' ? [] : ['<SEP>']
  //   const localValues = [...localOptions.values].reverse()
  //   let hasExtraText = false
  //   localValues.forEach((option) => {
  //     if (option.checked) {
  //       oneChecked = true
  //       if (localOptions.type === 'MISSING_INFO') embededOptions.splice(0, 0, '<li>' + option.title + '</li>')
  //       if (option.extraText) {
  //         const textHTML = option.extraText.replace(/(\n)/g, '<br/>')
  //         embededOptions.splice(embededOptions.indexOf('<SEP>') + 1, 0, textHTML)
  //         hasExtraText = true
  //       }
  //     }
  //   })
  //   if (!oneChecked) return template?.body ? template?.body : null
  //   const sepIndex = embededOptions.indexOf('<SEP>')
  //   if (sepIndex >= 0) embededOptions.splice(sepIndex, 1)
  //   const stringEmbed = embededOptions.join('')
  //   const emailHTML = template?.body
  //     ? template?.body.replace(/(\n)/g, '<br/>')
  //     : localOptions.default.replace(/(\n)/g, '<br/>')
  //   return emailHTML.replace(hasExtraText ? '<NOTICE>' : '<NOTICE><br/>', stringEmbed)
  // }
  // const setTemplate = () => {
  //   const emailWithTags = buildEmail()
  //   const email = emailWithTags ? setEmailBodyInfo(emailWithTags) : null
  //   const block = convertFromHTML(email || '')
  //   setEditorState(EditorState.createWithContent(email ? block : ContentState.createFromText(defaultEmail)))
  // }
  // const handleEditorChange = (state) => {
  //   try {
  //     if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
  //       editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
  //     }
  //     setCurrentBlocks(state.blocks.length)
  //   } catch {}
  // }
  // useEffect(() => {
  //   if (template) {
  //     const { id, title, subject, from, bcc, body } = template
  //     setSubject(subject)
  //     if (body) {
  //       // console.log(body.replace(/\[PARENT\]/g, 'test'))
  //       const contentBlock = htmlToDraft(setEmailBodyInfo(body))
  //       if (contentBlock) {
  //         const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
  //         setEditorState(EditorState.createWithContent(contentState))
  //       }
  //     }
  //   }
  // }, [template])
  // return (
  //   <Modal
  //     open={true}
  //     onClose={() => handleModem()}
  //     aria-labelledby='modal-modal-title'
  //     aria-describedby='modal-modal-description'
  //   >
  //     <Box sx={classes.modalCard}>
  //       <Title fontWeight='700'>{title}</Title>
  //       <Box sx={{ padding: '40px', paddingBottom: alert ? '20px' : undefined }}>
  //         {localOptions && <StandardResponses options={localOptions} setTemplate={setTemplate} />}
  //         {template?.from && (
  //           <OutlinedInput
  //             value={template.from}
  //             size='small'
  //             fullWidth
  //             placeholder='From email'
  //             sx={classes.subject}
  //             disabled
  //           />
  //         )}
  //         <OutlinedInput
  //           value={subject}
  //           size='small'
  //           fullWidth
  //           placeholder='Subject'
  //           sx={classes.subject}
  //           onChange={(e) => setSubject(e.target.value)}
  //         />
  //         <Box sx={classes.editor}>
  //           <Wysiwyg.Editor
  //             onContentStateChange={handleEditorChange}
  //             editorRef={(ref) => (editorRef.current = ref)}
  //             editorState={editorState}
  //             onEditorStateChange={setEditorState}
  //             toolbar={{
  //               options: [
  //                 'inline',
  //                 'blockType',
  //                 'fontSize',
  //                 'fontFamily',
  //                 'list',
  //                 'textAlign',
  //                 'colorPicker',
  //                 'link',
  //                 'embedded' /*, 'emoji'*/,
  //                 'image',
  //                 'remove',
  //                 'history',
  //               ],
  //             }}
  //           />
  //         </Box>
  //       </Box>
  //       <Alert
  //         onClose={() => setAlert(false)}
  //         sx={{ marginBottom: '15px', display: alert ? 'flex' : 'none' }}
  //         severity='error'
  //       >
  //         Please replace the [BLANK] text in the specific instructions.
  //       </Alert>
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           flexDirection: 'row',
  //           justifyContent: 'center',
  //           width: '100%',
  //         }}
  //       >
  //         <Button
  //           variant='contained'
  //           color='secondary'
  //           disableElevation
  //           sx={classes.cancelButton}
  //           onClick={handleModem}
  //         >
  //           Cancel
  //         </Button>
  //         <Button variant='contained' disableElevation sx={classes.submitButton} onClick={onSubmit}>
  //           Send
  //         </Button>
  //       </Box>
  //     </Box>
  //   </Modal>
  // )

  const student: any = useContext(studentContext)
  const [standard_response, setStandardResponse] = useState({ title: '', extraText: '', checked: false })
  const [template, setTemplate] = useState(null)
  
  const setEmailBodyInfo = (email: string) => {
    const yearbegin = new Date(student.grade_levels[0].school_year.date_begin).getFullYear().toString()
    const yearend = new Date(student.grade_levels[0].school_year.date_end).getFullYear().toString()
    return email.toString()
      .replace(/\[STUDENT_ID\]/g, student.student_id + '')
      .replace(/\[STUDENT\]/g, student.person.first_name)
      .replace(/\[PARENT\]/g, student.parent.person.first_name)
      .replace(/<STUDENT GRADE>/g, student.grade_level)
      .replace(/\[YEAR\]/g, `${yearbegin}-${yearend.substring(2, 4)}`)
  }

  const { data: emailTemplateData } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: type === 'ageIssue' ? 'Age Issue' : 'Missing Information',
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (emailTemplateData !== undefined) {
      const { emailTemplateName } = emailTemplateData
      if (emailTemplateName) {
        setEmailTemplate(emailTemplateName)
        setTemplate(emailTemplateName)
      }
    }
  }, [emailTemplateData])

  const [subject, setSubject] = useState('')

  const [alert, setAlert] = useState(false)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const defaultEmail = useMemo(() => setEmailBodyInfo(''), [])
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(defaultEmail)),
  )
  const [body, setBody] = useState('')

  const editorRef = useRef(null)
  const classes = useStyles

  useEffect(() => {
    console.log('here----------------------------------');
    if (template) {
      const { id, title, subject, from, bcc, body } = template
      setSubject(subject)
      if (body) {
        // console.log(body.replace(/\[PARENT\]/g, 'test'))
        setBody(body)
        const contentBlock = htmlToDraft(setEmailBodyInfo(body))
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          setEditorState(EditorState.createWithContent(contentState))
        }
      }
    }
  }, [template])

  useEffect(() => {
    const HtmlInput = setEmailBodyInfo(body)
    console.log(HtmlInput)
    let contentBlock
    // const word = student.parent.person.first_name
    const word = "</span>"
    const index = HtmlInput.indexOf(word)
    let endIndex = 0
    if (index !== -1) {
      endIndex = index + word.length - 1
    }

    const standardResponseExtraText = standard_response.extraText ? `<br/><br/>${setEmailBodyInfo(standard_response.extraText)}` : `${standard_response.extraText}`;

    contentBlock = htmlToDraft(
      HtmlInput.slice(0, endIndex + 1) + standardResponseExtraText + HtmlInput.slice(endIndex + 1),
    )

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      setEditorState(EditorState.createWithContent(contentState))
    }
  }, [body, standard_response])

  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  const onSubmit = () => {
    const email: string = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    if (email.search(/\[BLANK\]/g) >= 0) {
      setAlert(true)
      return
    }
    if (handleSubmit) {
      handleSubmit(subject, draftToHtml(convertToRaw(editorState.getCurrentContent())), {
        values: [standard_response],
        type: actionType,
      })
    }
    handleModem(false)
  }

  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Title fontWeight='700'>{title}</Title>
        <Box sx={{ padding: '40px', paddingBottom: alert ? '20px' : undefined }}>
          {options && (
            <StandardResponses
              options={options}
              type={type}
              setBody={setBody}
              setStandardResponse={setStandardResponse}
            />
          )}

          <OutlinedInput
            value={emailFrom}
            size='small'
            fullWidth
            onChange={(e) => setEmailFrom(e.target.value)}
            placeholder='From email'
            sx={classes.subject}
            // disabled
          />

          <OutlinedInput
            value={subject}
            size='small'
            fullWidth
            placeholder='Subject'
            sx={classes.subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Box sx={classes.editor}>
            <Wysiwyg.Editor
              onContentStateChange={handleEditorChange}
              editorRef={(ref) => (editorRef.current = ref)}
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={{
                options: [
                  'inline',
                  'blockType',
                  'fontSize',
                  'fontFamily',
                  'list',
                  'textAlign',
                  'colorPicker',
                  'link',
                  'embedded' /*, 'emoji'*/,
                  'image',
                  'remove',
                  'history',
                ],
              }}
            />
          </Box>
        </Box>

        <Alert
          onClose={() => setAlert(false)}
          sx={{ marginBottom: '15px', display: alert ? 'flex' : 'none' }}
          severity='error'
        >
          Please replace the [BLANK] text in the specific instructions.
        </Alert>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Button
            variant='contained'
            color='secondary'
            disableElevation
            sx={classes.cancelButton}
            onClick={handleModem}
          >
            Cancel
          </Button>
          <Button variant='contained' disableElevation sx={classes.submitButton} onClick={onSubmit}>
            Send
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
