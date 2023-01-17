import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { bulletEditorClasses } from './styles'

type MthBulletEditorProps = {
  value?: string
  height?: string
  maxHeight?: string
  isEditedByExternal?: boolean
  setValue: (value: string) => void
  error?: boolean
  isBlockEnd?: boolean
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
  isBlockEnd = true,
}) => {
  const [currentBlocks, setCurrentBlocks] = useState<number>(0)
  const [editorState, setEditorState] = useState<EditorState>(generateEditorState(''))
  const [isEdited, setIsEdited] = useState<boolean>(false)

  const onContentStateChange = (state: Draft.DraftModel.Encoding.RawDraftContentState) => {
    try {
      if (currentBlocks !== 0 && currentBlocks < state?.blocks?.length && isBlockEnd) {
        const focusKey = editorState.getSelection().getFocusKey()
        if (focusKey) {
          const focusElement = document.querySelector(`div[data-offset-key="${focusKey}-0-0"]`) as HTMLElement
          const wrapperElement = document.querySelector('.rdw-editor-main') as HTMLElement
          const blockOffsetTop = focusElement?.offsetTop || 0
          const blockHeight = focusElement?.clientHeight || 0
          const scrollTop = wrapperElement?.scrollTop || 0
          const wrapperHeight = wrapperElement?.clientHeight || 0

          if (blockOffsetTop + blockHeight > scrollTop + wrapperHeight) {
            wrapperElement?.scroll({ behavior: 'smooth', top: blockOffsetTop + blockHeight - wrapperHeight })
          }
          const rect = focusElement.getBoundingClientRect()
          const wrapperRect = wrapperElement.getBoundingClientRect()
          if (
            rect.top + rect.height > window.innerHeight &&
            wrapperRect.top + wrapperRect.height > window.innerHeight
          ) {
            window.scrollTo(
              0,
              window.scrollY +
                Math.min(rect.top + rect.height, wrapperRect.top + wrapperRect.height) +
                24 -
                window.innerHeight,
            )
          } else {
            focusElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }
      }
      setCurrentBlocks(state?.blocks?.length)
      setValue(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    } catch {}
  }

  const onEditorStateChange = (e: EditorState) => {
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
        ...bulletEditorClasses.editor,
        ...(error && bulletEditorClasses.editorInvalid),
        'div.rdw-editor-main': {
          minHeight: height ? height : '300px',
          maxHeight: maxHeight ? maxHeight : '350px',
          overflow: 'auto',
          wordBreak: 'break-all',
          px: '10px',
          '.public-DraftStyleDefault-block': {
            margin: 0,
          },
        },
        marginY: 'auto',
      }}
    >
      <Wysiwyg.Editor
        onContentStateChange={onContentStateChange}
        placeholder='  Type here...'
        editorState={editorState}
        onEditorStateChange={(e) => {
          onEditorStateChange(e)
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
