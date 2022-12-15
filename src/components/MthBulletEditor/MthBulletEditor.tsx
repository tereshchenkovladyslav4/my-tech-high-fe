import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { bulletEditorClassess } from './styles'

type MthBulletEditorProps = {
  value?: string
  height?: string
  maxHeight?: string
  isEditedByExternal?: boolean
  setValue: (value: string) => void
  error?: boolean
}

const generateEditorState = (htmlContent: string): EditorState => {
  const contentBlock = htmlToDraft(htmlContent || '')
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
  return EditorState.createWithContent(contentState)
}

const MthBulletEditor: React.FC<MthBulletEditorProps> = ({
  value,
  setValue,
  isEditedByExternal,
  error,
  height,
  maxHeight,
}) => {
  const [currentBlocks, setCurrentBlocks] = useState<number>(0)
  const editorRef = useRef<unknown>()
  const [editorState, setEditorState] = useState<EditorState>(generateEditorState(''))
  const [isEdited, setIsEdited] = useState<boolean>(false)

  const handleEditorChange = (state: unknown) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state?.blocks?.length) {
        editorRef?.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state?.blocks?.length)
      setValue(draftToHtml(convertToRaw(editorState.getCurrentContent())))
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

  useEffect(() => {
    setEditorState(generateEditorState(value || ''))
  }, [isEditedByExternal])

  return (
    <Box
      sx={{
        ...bulletEditorClassess.editor,
        ...(error && bulletEditorClassess.editorInvalid),
        'div.DraftEditor-editorContainer': {
          minHeight: height ? height : '300px',
          maxHeight: maxHeight ? maxHeight : '350px',
          marginX: '10px',
        },
        marginY: 'auto',
      }}
    >
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

export default MthBulletEditor
