import React, { useContext, useRef, useState, useMemo, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { Alert, Button, Modal, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { getEmailTemplateQuery } from '@mth/graphql/queries/email-template'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { Title } from '../Typography/Title/Title'
import { StandardResponses } from './StandardReponses/StandardResponses'
import { useStyles } from './styles'

type EmailModalProps = {
  handleSubmit: (
    subject: string,
    emailBody: string,
    emailType: {
      values: string
      type: string
    },
    body: string,
    addIndex: number,
    keyText: string,
  ) => void
  handleModem: () => void
  title: string
  options: string[]
  setEmailTemplate: () => void
  type: string
  setEmailFrom: () => void
  emailFrom: () => void
  setEmailBodyInfo: () => void
}
export const EmailModal: React.FC<EmailModalProps> = ({
  handleSubmit,
  handleModem,
  title,
  options,
  setEmailTemplate,
  type,
  setEmailFrom,
  emailFrom,
  setEmailBodyInfo,
}) => {
  let actionType = ''

  if (type === 'ageIssue') {
    actionType = 'AGE_ISSUE'
  } else {
    actionType = 'MISSING_INFO'
  }

  const { me } = useContext(UserContext)
  const [standard_responses, setStandardResponses] = useState([])
  const [template, setTemplate] = useState(null)

  const [keyText, setKeyText] = useState<string>('')

  const { data: emailTemplateData } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: type === 'ageIssue' ? 'Age Issue' : 'Missing Information',
      regionId: me?.selectedRegionId,
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
    if (template) {
      const { subject, from, body } = template
      setSubject(setEmailBodyInfo(subject))
      setEmailFrom(from)
      if (body) {
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
    let HtmlInput: string = body

    //  find the second </p>
    const index = HtmlInput.indexOf('</p>', HtmlInput.indexOf('</p>') + 1) + 4

    setKeyText(HtmlInput.slice(index, index + 20))

    let standardResponseExtraText = '',
      standardResponseExtraSpan = ''
    for (let i = 0; i < standard_responses.length; i++) {
      if (type == 'ageIssue') standardResponseExtraText += `<p>${standard_responses[i].extraText}</p>`
      else if (type == 'missingInfo') {
        standardResponseExtraSpan += `<li>${standard_responses[i].title?.trim()}`

        if (standard_responses[i].extraText.trim() != '') {
          standardResponseExtraSpan += `<ul class="sub-bullet"><li>${standard_responses[i].extraText
            ?.trim()
            ?.replace(/<p[^>]+?>|<p>|<\/p>/g, '')}</li></ul>`
        }
        standardResponseExtraSpan += '</li>'
      }
    }

    HtmlInput = HtmlInput.replace(/\[FILES\]/g, `<ul class="primary-bullet">${standardResponseExtraSpan}</ul>`).replace(
      /\[INSTRUCTIONS\]/g,
      '',
    )

    if (type == 'ageIssue') {
      HtmlInput = HtmlInput.slice(0, index) + standardResponseExtraText + HtmlInput.slice(index)
    } else {
    }

    HtmlInput = setEmailBodyInfo(HtmlInput)

    const contentBlock = htmlToDraft(HtmlInput)

    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      setEditorState(EditorState.createWithContent(contentState))
    }
  }, [body, standard_responses])

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
      handleSubmit(
        subject,
        draftToHtml(convertToRaw(editorState.getCurrentContent())),
        {
          values: standard_responses,
          type: actionType,
        },
        body,
        keyText,
      )
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
              standardResponses={standard_responses}
              setStandardResponses={setStandardResponses}
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
            onChange={(e) => setSubject(setEmailBodyInfo(e.target.value))}
          />
          <Box sx={classes.editor}>
            <Wysiwyg.Editor
              onContentStateChange={handleEditorChange}
              editorRef={(ref) => (editorRef.current = ref)}
              editorState={editorState}
              onEditorStateChange={setEditorState}
              handlePastedText={() => false}
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
