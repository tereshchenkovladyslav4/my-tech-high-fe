import { Button, Modal, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'
import { EmailModalTemplateType } from './types'
import { useStyles } from './styles'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { StandardResponses } from './StandardReponses/StandardResponses'
import { Title } from '../Typography/Title/Title'

import Wysiwyg from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

export const ApplicationEmailModal: EmailModalTemplateType = ({
  handleSubmit,
  handleModem,
  title,
  options,
  template,
}) => {
  const classes = useStyles
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [subject, setSubject] = useState('')
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const onSubmit = () => {
    if (handleSubmit && subject) {
      handleSubmit(subject, draftToHtml(convertToRaw(editorState.getCurrentContent())))
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
      const { id, title, subject, from, bcc, body } = template
      setSubject(subject)

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
        <Title fontWeight='700'>{title}</Title>
        {/* {options && <StandardResponses options={options} />} */}
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
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
