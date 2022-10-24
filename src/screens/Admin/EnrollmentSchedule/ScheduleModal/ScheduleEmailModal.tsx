import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, FormControlLabel, Modal, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import { EditorState, convertToRaw, ContentState } from 'draft-js'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Title } from '@mth/components/Typography/Title/Title'
import { useStyles } from './styles'
import { EmailModalTemplateType } from './types'

export const EmailModal: EmailModalTemplateType = ({
  handleSubmit,
  handleModem,
  title,
  editFrom,
  template,
  isNonSelected,
  filters,
  handleSchedulesByStatus,
}) => {
  const classes = useStyles
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [subject, setSubject] = useState('')
  const [emailFrom, setEmailFrom] = useState('')
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const onSubmit = () => {
    if (handleSubmit && subject) {
      handleSubmit(emailFrom, subject, draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }
  }
  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  useEffect(() => {
    if (template) {
      const { subject, from, body } = template
      setSubject(subject)
      setEmailFrom(from)
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
        {isNonSelected && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '35px',
            }}
          >
            <Title fontWeight='700'>Status</Title>
            <div style={{ height: 15 }} />
            {filters?.map((item, index) => {
              return (
                <FormControlLabel
                  key={index}
                  sx={{ height: 30 }}
                  control={<Checkbox value={item} onChange={(e) => handleSchedulesByStatus(e.target.value)} />}
                  label={
                    <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                      {item}
                    </Paragraph>
                  }
                />
              )
            })}
          </Box>
        )}
        <Title fontWeight='700'>{title}</Title>
        {editFrom && (
          <OutlinedInput
            value={emailFrom}
            size='small'
            fullWidth
            placeholder='From: email in template'
            sx={classes.from}
            onChange={(e) => setEmailFrom(e.target.value)}
          />
        )}
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
                'embedded',
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
            Send
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
