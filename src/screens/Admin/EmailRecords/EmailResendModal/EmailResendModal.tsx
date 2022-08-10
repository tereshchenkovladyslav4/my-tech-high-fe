import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import { EditorState, convertToRaw, ContentState } from 'draft-js'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'

import { Title } from '../../../../components/Typography/Title/Title'
import { useStyles } from './styles'
import { EmailModalTemplateType } from './types'

export const EmailResendModal: EmailModalTemplateType = ({ handleSubmit, handleModem, template }) => {
  const classes = useStyles
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [toEmail, setToEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [status, setStatus] = useState('')
  const [emailFrom, setEmailFrom] = useState('')
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)

  const onSubmit = () => {
    if (handleSubmit && subject) {
      handleSubmit(template, draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }
  }

  const handleEditorChange = (state: unknown) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  useEffect(() => {
    if (template) {
      const { subject, from_email, to_email, body, status } = template
      setSubject(subject)
      setEmailFrom(from_email)
      setToEmail(to_email)
      setStatus(status)

      if (body) {
        const contentBlock = htmlToDraft(body)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          setEditorState(EditorState.createWithContent(contentState))
        }
      }
    }
  }, [template])

  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Title fontWeight='700'>To: {toEmail}</Title>
        {/* {options && <StandardResponses options={options} />} */}
        <OutlinedInput
          value={'From: ' + emailFrom}
          size='small'
          fullWidth
          placeholder='From: email in template'
          sx={classes.from}
          disabled
        />

        <OutlinedInput value={subject} size='small' fullWidth placeholder='Subject' sx={classes.from} disabled />

        <Box sx={classes.editor}>
          <Wysiwyg.Editor
            onContentStateChange={handleEditorChange}
            editorRef={(ref) => (editorRef.current = ref)}
            editorState={editorState}
            onEditorStateChange={setEditorState}
            handlePastedText={() => false}
            readOnly={status == 'Error' ? false : true}
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
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
          <Button
            variant='contained'
            color='secondary'
            disableElevation
            sx={classes.cancelButton}
            onClick={() => handleModem()}
          >
            Cancel
          </Button>
          <Button variant='contained' disableElevation sx={classes.submitButton} onClick={onSubmit}>
            Resend
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
