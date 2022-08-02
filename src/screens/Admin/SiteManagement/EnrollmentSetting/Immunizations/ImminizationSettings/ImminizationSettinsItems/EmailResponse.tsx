import React, { useRef, useState } from 'react'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { Box, FormControl, Typography, Button, Divider, Modal, Select, MenuItem, FormHelperText } from '@mui/material'
import { convertFromHTML } from 'draft-convert'
import { EditorState, RichUtils, Editor, convertToRaw } from 'draft-js'
import { useFormikContext } from 'formik'
import { useStyles } from '../../../../../../../components/EmailModal/styles'
import { Title } from '../../../../../../../components/Typography/Title/Title'
import { ImmunizationsData } from '../../Immunizations'
import { useStyles as useImStyles } from './style'

export interface EmailModalProps {
  title: string
  handleSubmit: (body: string) => void
  setIsEmailOpen: (state: boolean) => void
  body: string
  onCancel?: () => void
}
const EmailModal: React.FC<EmailModalProps> = ({ title, handleSubmit, setIsEmailOpen, body, onCancel }) => {
  const classes = useStyles
  const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromHTML(body || '')))
  const [boldActive, setBoldActive] = useState(false)
  const [underlineActive, setUnderlineActive] = useState(false)
  const [italicActive, setItalicctive] = useState(false)
  const [olListActive, setOlListctive] = useState(false)
  const [ulListActive, setUlListActive] = useState(false)
  const editorRef = useRef()
  const boldText = (e) => {
    e.preventDefault()
    const nextState = RichUtils.toggleInlineStyle(editorState, 'BOLD')
    setEditorState(nextState)
    setBoldActive(!boldActive)
  }

  const underlineText = (e) => {
    e.preventDefault()
    const nextState = RichUtils.toggleInlineStyle(editorState, 'UNDERLINE')
    setEditorState(nextState)
    setUnderlineActive(!underlineActive)
  }

  const italicText = (e) => {
    e.preventDefault()
    const nextState = RichUtils.toggleInlineStyle(editorState, 'ITALIC')
    setEditorState(nextState)
    setItalicctive(!italicActive)
  }

  const unorderedList = (e) => {
    e.preventDefault()
    const nextState = RichUtils.toggleBlockType(editorState, 'unordered-list-item')
    setEditorState(nextState)
    setUlListActive(!ulListActive)
    setOlListctive(false)
  }

  const orderedList = (e) => {
    e.preventDefault()
    const nextState = RichUtils.toggleBlockType(editorState, 'ordered-list-item')
    setEditorState(nextState)
    setOlListctive(!olListActive)
    setUlListActive(false)
  }

  const onSubmit = () => {
    // @ts-ignore
    handleSubmit(editorRef.current?.editor?.innerHTML || '')
  }

  return (
    <Modal open={true} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={classes.modalCard}>
        <Title fontWeight='700'>{title}</Title>
        <Box sx={{ padding: '40px', paddingBottom: alert ? '20px' : undefined }}>
          <Box sx={classes.editor}>
            <Box sx={classes.toolBar}>
              <FormatBoldIcon
                type='button'
                onMouseDown={(e) => boldText(e)}
                sx={
                  boldActive
                    ? {
                        ...classes.icon,
                        ...classes.isActive,
                      }
                    : classes.icon
                }
              />
              <FormatUnderlinedIcon
                type='button'
                onMouseDown={(e) => underlineText(e)}
                sx={
                  underlineActive
                    ? {
                        ...classes.icon,
                        ...classes.isActive,
                      }
                    : classes.icon
                }
              />
              <FormatItalicIcon
                type='button'
                onMouseDown={(e) => italicText(e)}
                sx={
                  italicActive
                    ? {
                        ...classes.icon,
                        ...classes.isActive,
                      }
                    : classes.icon
                }
              />
              <FormatListBulletedIcon
                type='button'
                onMouseDown={(e) => unorderedList(e)}
                sx={
                  ulListActive
                    ? {
                        ...classes.icon,
                        ...classes.isActive,
                      }
                    : classes.icon
                }
              />
              <FormatListNumberedIcon
                type='button'
                onMouseDown={(e) => orderedList(e)}
                sx={
                  olListActive
                    ? {
                        ...classes.icon,
                        ...classes.isActive,
                      }
                    : classes.icon
                }
              />
            </Box>
            <Editor editorState={editorState} onChange={setEditorState} ref={editorRef} />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Button
            variant='contained'
            color='secondary'
            disableElevation
            sx={classes.cancelButton}
            onClick={() => {
              setIsEmailOpen(false)
              if (onCancel) onCancel()
            }}
          >
            Cancel
          </Button>
          <Button variant='contained' disableElevation sx={classes.submitButton} onClick={onSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

const EmailResponse: React.FC = () => {
  const styles = useImStyles()
  const { values, setFieldValue, touched, errors } = useFormikContext<ImmunizationsData>()

  const [isEmailOpen, setIsEmailOpen] = useState<boolean>(false)

  const emailState = values.email_update_template === '-1' ? 'None' : values.email_update_template ? 'Edit' : 'Select'

  const handleEmail = (email: string) => {
    setIsEmailOpen(false)
    const contentBlock = convertToRaw(EditorState.createWithContent(convertFromHTML(email || '')).getCurrentContent())
    const contentString = contentBlock.blocks[0].text.replace(/[^a-zA-Z0-9]/g, '')
    if (contentString.length === 0) {
      setFieldValue('email_update_template', '-1')
    } else {
      setFieldValue('email_update_template', email)
    }
  }
  function onChange(val: string) {
    if (val === 'None') {
      setFieldValue('email_update_template', '-1')
    } else {
      if (values.email_update_template === '-1') {
        setFieldValue('email_update_template', '')
      }
      setIsEmailOpen(true)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        padding: '5px',
        marginY: '10px',
        marginX: '33px',
        bgcolor: 'white',
        height: '35px',
        borderRadius: '10px',
        textAlign: 'center',
        width: 'auto',
      }}
    >
      <Typography component='span' sx={{ width: '200px', textAlign: 'left' }}>
        Email Response
      </Typography>
      <Divider sx={{ borderColor: 'black' }} orientation='vertical' flexItem />
      {/* <FormControl sx={{ marginLeft: '25px' }} variant='outlined'>
        <EmailButton emailState={emailState} onClick={handleClick} />
      </FormControl> */}
      <FormControl variant='outlined' classes={{ root: styles.formRoot }}>
        <Select
          name='email_update_template'
          value={emailState}
          IconComponent={KeyboardArrowDownIcon}
          classes={{ root: styles.selectRoot, icon: styles.icon }}
          MenuProps={{ classes: { paper: styles.selectPaper } }}
          renderValue={(s) => s || 'Select'}
        >
          {emailState !== 'Edit' && (
            <MenuItem value='Add' onClick={() => onChange('Add')}>
              Add
            </MenuItem>
          )}
          {emailState !== 'Edit' && (
            <MenuItem value='None' onClick={() => onChange('None')}>
              None
            </MenuItem>
          )}

          {emailState === 'Edit' && (
            <MenuItem value='Edit' onClick={() => onChange('Edit')}>
              Edit
            </MenuItem>
          )}
        </Select>
      </FormControl>
      <FormHelperText error>{touched.email_update_template && errors.email_update_template}</FormHelperText>
      {isEmailOpen && (
        <EmailModal
          setIsEmailOpen={setIsEmailOpen}
          title={values.title || ''}
          handleSubmit={handleEmail}
          body={values.email_update_template}
          onCancel={() => {
            if (!values.email_update_template) {
              setFieldValue('email_update_template', '-1')
            }
          }}
        />
      )}
    </Box>
  )
}

export { EmailResponse as default }
