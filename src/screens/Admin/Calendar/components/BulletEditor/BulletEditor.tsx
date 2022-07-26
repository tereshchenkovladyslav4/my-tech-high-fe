import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import draftToHtml from 'draftjs-to-html'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { addEventClassess } from '../../AddEvent/styles'

type BulletEditorProps = {
  value?: string
  setValue: (value: string) => void
  error?: boolean
}

const generateEditorState = (htmlContent: string): EditorState => {
  const contentBlock = htmlToDraft(htmlContent || '')
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
  return EditorState.createWithContent(contentState)
}

const BulletEditor = ({ value, setValue, error }: BulletEditorProps) => {
  const [currentBlocks, setCurrentBlocks] = useState<number>(0)
  const editorRef = useRef<any>()
  const [editorState, setEditorState] = useState<EditorState>(generateEditorState(''))
  const [isEdited, setIsEdited] = useState<boolean>(false)

  const handleEditorChange = (state: any) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  const handleBodyChange = (e: EditorState) => {
    setIsEdited(true)
    setEditorState(e)
    setValue(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  useEffect(() => {
    // Prevent get initial value once touched
    if (!isEdited) setEditorState(generateEditorState(value || ''))
  }, [value])

  return (
    <Box sx={{ ...addEventClassess.editor, ...(error && addEventClassess.editorInvalid) }}>
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
