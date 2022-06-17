import { ContentState, EditorState, convertToRaw } from 'draft-js'
import React, { useRef, useState } from 'react'
import Wysiwyg from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import { useStyles } from '../styles'
import { Box } from '@mui/material'

type BulletEditorProps = {
  value?: string
  setValue: (value: string) => void
}

const BulletEditor = ({ value, setValue }: BulletEditorProps) => {
  const classes = useStyles
  const [currentBlocks, setCurrentBlocks] = useState<number>(0)
  const editorRef = useRef(null)
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(value || '')),
  )

  const handleEditorChange = (state: any) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  const handleBodyChange = (e) => {
    setEditorState(e)
    setValue(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  return (
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
  )
}

export default BulletEditor
