import React, { useRef, useState } from 'react'
import { Button, Checkbox, FormControlLabel, Modal, OutlinedInput } from '@mui/material'
import { Box } from '@mui/system'
import { EditorState, convertToRaw } from 'draft-js'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import { useFormik } from 'formik'
import Wysiwyg from 'react-draft-wysiwyg'
import * as yup from 'yup'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Title } from '@mth/components/Typography/Title/Title'
import { MthColor } from '@mth/enums'
import { useStyles } from './styles'
import { EmailModalTemplateType } from './types'
export const EmailModal: EmailModalTemplateType = ({
  handleSubmit,
  handleModem,
  title,
  editFrom,
  isNonSelected,
  filters,
  handleSchedulesByStatus,
}) => {
  const classes = useStyles
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const [isErrorStatus, setErrorStatus] = useState<boolean>(false)

  const validationSchema = yup.object({
    emailFrom: yup.string().email().required('Required'),
    subject: yup.string().required('Required'),
    editorState: yup
      .object()
      .test('has text', 'Cannot save an empty note', (value) => {
        return value.getCurrentContent().hasText()
      })
      .required('This field is required.'),
  })

  const formik = useFormik({
    initialValues: {
      emailFrom: '',
      subject: '',
      editorState: EditorState.createEmpty(),
    },
    validationSchema: validationSchema,
    onSubmit: async ({ emailFrom, editorState, subject }) => {
      if (editFrom) {
        handleSubmit(emailFrom, subject, draftToHtml(convertToRaw(editorState.getCurrentContent())))
      } else {
        setCheckedStatus(true)
      }
    },
  })

  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

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
            {!editFrom && isErrorStatus && (
              <Paragraph size='large' fontWeight='500' color={MthColor.RED}>
                Required
              </Paragraph>
            )}
            <div style={{ height: 15 }} />
            {filters?.map((item, index) => {
              return (
                <FormControlLabel
                  key={index}
                  sx={{ height: 30 }}
                  control={
                    <Checkbox
                      value={item}
                      onChange={(e) => {
                        handleSchedulesByStatus(e.target.value)
                      }}
                    />
                  }
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

        {editFrom && (
          <>
            <Title fontWeight='700'>{title}</Title>
            {(formik.errors.emailFrom || formik.errors.subject || formik.errors.editorState) && (
              <Paragraph size='large' fontWeight='500' color={MthColor.RED}>
                Required
              </Paragraph>
            )}

            <OutlinedInput
              id='emailFrom'
              name='emailFrom'
              value={formik.values.emailFrom}
              size='small'
              fullWidth
              placeholder='From: email in template'
              sx={classes.from}
              onChange={formik.handleChange}
              error={formik.errors.emailFrom ? true : false}
              autoFocus
            />
            <OutlinedInput
              id='subject'
              name='subject'
              value={formik.values.subject}
              size='small'
              fullWidth
              placeholder='Subject'
              sx={classes.subject}
              onChange={formik.handleChange}
              error={formik.errors.subject ? true : false}
            />

            <Box sx={(classes.editor, formik.errors.editorState ? classes.redBorder : classes.editor)}>
              <Wysiwyg.Editor
                onContentStateChange={handleEditorChange}
                editorRef={(ref) => (editorRef.current = ref)}
                editorState={formik.values.editorState}
                onEditorStateChange={(value) => {
                  formik.setFieldValue('editorState', value)
                }}
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
          </>
        )}

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
          <Button
            variant='contained'
            disableElevation
            sx={classes.submitButton}
            onClick={() => {
              if (editFrom) {
                formik.handleSubmit()
              } else {
                setErrorStatus(true)
              }
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
