import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { checkListClass } from './styles'
import { CheckListType } from './types'

type EditChecklistModalProps = {
  handleSubmit: (value: string) => void
  handleClose: () => void
  selectedChecklist?: CheckListType
}

export const EditChecklistModal: React.FC<EditChecklistModalProps> = ({
  handleSubmit,
  handleClose,
  selectedChecklist,
}) => {
  const classes = checkListClass
  const editorRef = useRef<unknown>(null)
  const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText('')))

  const [isValid, setIsValid] = useState(false)
  const [editorTouched, setEditorTouched] = useState(false)
  const [currentBlocks, setCurrentBlocks] = useState(0)

  useEffect(() => {
    const contentBlock = htmlToDraft(selectedChecklist?.goal ?? '')
    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
    setEditorState(EditorState.createWithContent(contentState))
  }, [])

  const handleEditorChange = (state: Draft.DraftModel.Encoding.RawDraftContentState) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        ;(editorRef.current as Element).scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  const handleBodyChange = (e: Wysiwyg.EditorState) => {
    setEditorTouched(true)
    setIsValid(e.getCurrentContent().hasText())
    setEditorState(e)
  }

  const handleClickSave = () => {
    const editedGoal = draftToHtml(convertToRaw(editorState.getCurrentContent())).replace(/<[^>]+>/g, '')
    handleSubmit(editedGoal)
  }

  const isSubjectChecklist =
    Object.keys?.(selectedChecklist ?? {}).includes('subject') &&
    Object.keys?.(selectedChecklist ?? {}).includes('grade')
  return (
    <Modal
      open={true}
      onClose={() => handleClose()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <TextField
              name='checklist_id'
              label='ID'
              fullWidth
              defaultValue={selectedChecklist?.checklistId}
              InputLabelProps={{ shrink: true }}
              className='MthFormField'
              disabled
            />
          </Box>
          {isSubjectChecklist && (
            <Box>
              <TextField
                name='grade'
                label='Grade'
                fullWidth
                defaultValue={selectedChecklist?.grade}
                InputLabelProps={{ shrink: true }}
                className='MthFormField'
                disabled
              />
            </Box>
          )}
          {isSubjectChecklist && (
            <Box>
              <TextField
                name='subject'
                label='Subject'
                fullWidth
                defaultValue={selectedChecklist?.subject}
                InputLabelProps={{ shrink: true }}
                className='MthFormField'
                disabled
              />
            </Box>
          )}
        </Box>

        <Box sx={{ marginTop: 2, px: isSubjectChecklist ? 2 : 0 }}>
          <Subtitle sx={{ fontSize: '14px' }}>Goal</Subtitle>
          <Box
            sx={{
              border: '1px solid #d1d1d1',
              borderRadius: 1,
              'div.DraftEditor-editorContainer': {
                minHeight: '200px',
                maxHeight: '250px',
                overflow: 'scroll',
                padding: 1,
                '.public-DraftStyleDefault-block': {
                  margin: 0,
                },
              },
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
          {editorTouched && !isValid && (
            <Paragraph size={'large'} color={MthColor.RED} sx={{ marginTop: -8 }}>
              Please enter tooltip information
            </Paragraph>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginTop: '50px',
          }}
        >
          <Button
            variant='contained'
            color='secondary'
            disableElevation
            sx={classes.cancelButton}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            disableElevation
            sx={classes.submitButton}
            type='submit'
            onClick={handleClickSave}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
