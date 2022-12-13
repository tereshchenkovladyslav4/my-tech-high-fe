import React, { useRef, useState } from 'react'
import { Box, OutlinedInput } from '@mui/material'
import { EditorState } from 'draft-js'
import Wysiwyg, { RawDraftContentState } from 'react-draft-wysiwyg'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { useStyles } from '../styles'

type EditComponentProps = {
  emailFrom: string
  emailInvalid: boolean
  subject: string
  subjectInvalid: boolean
  editorState: EditorState
  bodyInvalid: boolean
  setBodyInvalid: (value: boolean) => void
  setEditorState: (value: EditorState) => void
  setEmailFrom: (value: string) => void
  setEmailInvalid: (value: boolean) => void
  setSubject: (value: string) => void
  setSubjectInvalid: (value: boolean) => void
}

const EditComponent: React.FC<EditComponentProps> = ({
  emailFrom,
  emailInvalid,
  subject,
  subjectInvalid,
  editorState,
  bodyInvalid,
  setEmailFrom,
  setEmailInvalid,
  setSubject,
  setBodyInvalid,
  setSubjectInvalid,
  setEditorState,
}) => {
  const classes = useStyles
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState<number>(0)

  const handleBodyChange = (e: Wysiwyg.EditorState) => {
    setEditorState(e)
    setBodyInvalid(false)
  }

  const handleEditorChange = (state: RawDraftContentState) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  return (
    <Box sx={{ padding: '40px', paddingBottom: '20px' }}>
      <OutlinedInput
        value={emailFrom}
        size='small'
        fullWidth
        onChange={(e) => {
          setEmailFrom(e.target.value)
          setEmailInvalid(false)
        }}
        placeholder='From/Reply to'
        sx={classes.subject}
      />
      {emailInvalid && emailFrom == '' && (
        <Subtitle size='small' color={MthColor.RED} fontWeight='700'>
          Please enter email
        </Subtitle>
      )}
      {emailInvalid && emailFrom != '' && (
        <Subtitle size='small' color={MthColor.RED} fontWeight='700'>
          Invalid Email. Please enter registered email
        </Subtitle>
      )}
      <OutlinedInput
        value={subject}
        size='small'
        fullWidth
        placeholder='Subject'
        onChange={(e) => {
          setSubject(e.target.value)
          setSubjectInvalid(false)
        }}
      />
      {subjectInvalid && (
        <Subtitle size='small' color={MthColor.RED} fontWeight='700'>
          Please enter subject
        </Subtitle>
      )}
      <Box sx={classes.editor}>
        <Wysiwyg.Editor
          onContentStateChange={handleEditorChange}
          placeholder='  Type here...'
          editorRef={(ref) => (editorRef.current = ref)}
          editorState={editorState}
          onEditorStateChange={(e) => {
            handleBodyChange(e)
          }}
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
      {bodyInvalid && (
        <Subtitle size='small' color={MthColor.RED} fontWeight='700'>
          Please enter email content.
        </Subtitle>
      )}
    </Box>
  )
}

export default EditComponent
