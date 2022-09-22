import React, { useState, useRef, FunctionComponent } from 'react'
import { Box, Button, Checkbox, Modal, outlinedInputClasses, TextField, Typography } from '@mui/material'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { useFormikContext } from 'formik'
import htmlToDraft from 'html-to-draftjs'
import Wysiwyg from 'react-draft-wysiwyg'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_07 } from '../../../../../../utils/constants'
import { EnrollmentQuestion, EnrollmentQuestionGroup, EnrollmentQuestionTab } from '../types'

type AddUploadModal = {
  onClose: () => void
  editItem?: EnrollmentQuestion
  specialEd: unknown
}
export const AddUploadModal: FunctionComponent<AddUploadModal> = ({ onClose, editItem, specialEd }) => {
  const { values, setValues } = useFormikContext<EnrollmentQuestionTab[]>()
  const [uploadTitle, setUploadTitle] = useState(editItem?.question || '')
  const [fileName, setFileName] = useState(editItem?.options[0]?.label || '')
  const [description, setDescription] = useState(editItem?.options[0]?.value || '')

  const [required, setRequired] = useState(editItem?.required || false)
  const [specialUpload, setSpecialUpload] = useState(editItem?.options[1]?.value || false)
  const [specialUploadList, setSpecialUploadList] = useState(
    editItem?.options[1]?.value ? JSON.parse(editItem?.options[1]?.value) : [],
  )
  // const [removable, setRemovable] = useState(editItem?.removable || false)
  const [error, setError] = useState('')

  const currentTabData = values.filter((v) => v.tab_name === 'Documents')[0]

  function onSave() {
    if (fileName.trim() === '') {
      setError('File name is required')
      return
    }
    if (uploadTitle.trim() === '') {
      setError('Title is required')
      return
    }
    let newQuestions: EnrollmentQuestion[]

    const options = [{ label: fileName, value: description }]
    if (specialUpload) {
      options.push({ label: specialUpload, value: JSON.stringify(specialUploadList) })
    } else {
      options.push({ label: specialUpload, value: '' })
    }

    if (editItem) {
      const newQuestion: EnrollmentQuestion = {
        id: editItem?.id,
        type: 8,
        question: uploadTitle,
        order: editItem.order,
        options: options,
        required,
        // removable,
        validation: 0,
        default_question: false,
        display_admin: false,
        slug: editItem?.slug || `meta_${+new Date()}`,
      }
      newQuestions = currentTabData.groups[0]?.questions.map((q) => (q.slug === editItem.slug ? newQuestion : q))
    } else {
      const newQuestion: EnrollmentQuestion = {
        type: 8,
        question: uploadTitle,
        order: currentTabData.groups[0]?.questions?.length + 1 || 1,
        options: options,
        required,
        // removable,
        validation: 0,
        display_admin: false,
        default_question: false,
        slug: editItem?.slug || `meta_${+new Date()}`,
      }
      newQuestions = currentTabData.groups[0]?.questions
        ? [...currentTabData.groups[0]?.questions, newQuestion]
        : [newQuestion]
    }
    const newGroup: EnrollmentQuestionGroup = {
      id: currentTabData.groups[0].id,
      group_name: 'root',
      order: 1,
      questions: newQuestions,
    }
    const updatedTab = { ...currentTabData, groups: [newGroup] }
    setValues(values.map((v) => (v.tab_name === updatedTab.tab_name ? updatedTab : v)))
    onClose()
  }

  //	Editor related states and functions
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromBlockArray(htmlToDraft(editItem?.options[0]?.value.toString() || '').contentBlocks),
    ),
  )
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)

      setDescription(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    } catch {}
  }

  const handleSpecialService = (e, ed) => {
    const checked = e.target.checked
    if (checked) {
      const newSpecialList = specialUploadList.concat(ed)
      setSpecialUploadList(newSpecialList)
    } else {
      const newSpecialList = specialUploadList.filter((i) => i != ed)
      setSpecialUploadList(newSpecialList)
    }
  }

  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          bgcolor: '#fff',
          borderRadius: 8,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            height: '40px',
            width: '100%',
            justifyContent: 'end',
          }}
        >
          <Button sx={styles.cancelButton} onClick={() => onClose()}>
            Cancel
          </Button>
          <Button sx={styles.actionButtons} onClick={() => onSave()}>
            Save
          </Button>
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '40px',
            mt: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <TextField
            size='small'
            sx={{
              minWidth: '300px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: SYSTEM_07,
                },
            }}
            label='Title'
            variant='outlined'
            value={uploadTitle}
            onChange={(v) => setUploadTitle(v.currentTarget.value)}
            focused
          />
          <TextField
            size='small'
            sx={{
              minWidth: '200px',
              [`& .${outlinedInputClasses.root}.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
                {
                  borderColor: SYSTEM_07,
                },
            }}
            label='File Name'
            variant='outlined'
            value={fileName}
            onChange={(v) => setFileName(v.currentTarget.value)}
            focused
          />
        </Box>
        <Subtitle sx={{ mt: '20px', mb: 1 }}>Description</Subtitle>
        <Box
          sx={{
            border: '1px solid #d1d1d1',
            borderRadius: 1,
            'div.DraftEditor-editorContainer': {
              minHeight: '200px',
              maxHeight: '250px',
              overflow: 'auto',
              padding: 1,
            },
          }}
        >
          <Wysiwyg.Editor
            onContentStateChange={handleEditorChange}
            editorRef={(ref) => (editorRef.current = ref)}
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ['inline', 'list', 'link'],
              inline: {
                options: ['bold', 'italic'],
              },
              list: {
                options: ['unordered', 'ordered'],
              },
            }}
          />
        </Box>

        <Box
          sx={{
            width: '100%',
            // height: '40px',
            mt: '40px',
            mb: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}
        >
          {specialEd?.specialEdStatus ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Checkbox checked={specialUpload} onClick={() => setSpecialUpload(!specialUpload)} />
                <Subtitle size='small'>Special Education Upload</Subtitle>
              </Box>
              {specialUpload && (
                <>
                  <Box
                    sx={{
                      paddingLeft: '13px',
                    }}
                  >
                    <Subtitle size='small' sx={{ fontSize: '13px' }}>
                      Check the statuses that require a SPED upload:
                    </Subtitle>
                  </Box>
                  {specialEd?.specialEdList.map((ed, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Checkbox
                        checked={specialUploadList?.indexOf(ed) !== -1}
                        onClick={(e) => handleSpecialService(e, ed)}
                      />
                      <Subtitle size='small'>{ed}</Subtitle>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          ) : (
            <Box />
          )}
          <Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Checkbox checked={required} onClick={() => setRequired(!required)} />
              <Subtitle size='small'>Required</Subtitle>
            </Box>
          </Box>
        </Box>
        {error && <Typography color='red'>{error}</Typography>}
      </Box>
    </Modal>
  )
}

const styles = {
  actionButtons: {
    borderRadius: 4,

    background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
    fontWeight: 'bold',
    padding: '11px 60px',
    color: 'white',
  },
  cancelButton: {
    borderRadius: 4,
    background: 'linear-gradient(90deg, #D23C33 0%, rgba(62, 39, 131, 0) 100%) #D23C33',
    fontWeight: 'bold',
    mr: 2,
    color: 'white',
    padding: '11px 60px',
  },
}
