import React, { useRef, useState, useEffect } from 'react'
import {
  Button,
  Modal,
  OutlinedInput,
  Box,
  Typography,
  Grid,
  TextField,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material'
import { ContentState, EditorState, RichUtils, convertFromHTML, convertToRaw } from 'draft-js'
import { makeStyles } from '@material-ui/core'
import CloseIcon from '@mui/icons-material/Close'
import { BUTTON_LINEAR_GRADIENT } from '../../../../../utils/constants'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { Add } from '@mui/icons-material'
import { getEmailTemplateQuery } from '../../services'
import { useQuery, useMutation } from '@apollo/client'
import Wysiwyg from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

const useStyles = makeStyles({
  modalCard: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 828,
    backgroundColor: 'white',
    boxShadow: '24px',
    padding: '15px 15px 30px',
    borderRadius: '12px',
    maxHeight: '90%',
    overflow: 'auto',
  },
  editor: {
    border: '1px solid #d1d1d1',
    borderRadius: 1,
    marginBottom: '24px',
    '& div.DraftEditor-editorContainer': {
      minHeight: '200px',
      maxHeight: '250px',
      padding: 1,
      '& .public-DraftEditor-content': {
        minHeight: '200px',
      },
    },
  },
  toolBar: {
    borderBottom: '1px solid #d1d1d1',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
  },
  cancelButton: {
    borderRadius: 10,
    background: '#E7E7E7',
    width: '200px',
    marginRight: 1,
  },
  submitButton: {
    borderRadius: 10,
    width: '200px',
    marginLeft: 1,
  },
  icon: {
    marginRight: 2,
    color: '#e7e7e7',
    cursor: 'pointer',
  },
  subject: {
    marginTop: 2,
  },
  isActive: {
    color: 'black',
    marginRight: 2,
    cursor: 'pointer',
  },
  close: {
    background: 'black',
    borderRadius: 1,
    color: 'white',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  save: {
    borderRadius: 8,
    textTransform: 'none',
    height: 24,
    background: '#000',
    color: 'white',
    marginRight: '12px',
    width: '92px',
  },
  add: {
    borderRadius: 8,
    textTransform: 'none',
    height: 40,
    background: BUTTON_LINEAR_GRADIENT,
    color: 'white',
    fontSize: 16,
  },
  'availbe-row': {
    display: 'flex',
    alignItems: 'center',
    '& .type-field': {
      width: '220px',
      textTransform: 'uppercase',
    },
  },
  select: {
    width: '150px',
  },
})

const insertDescriptions = {
  parent: "Parent's First Name",
  student: "Student's First Name",
  application_year: 'School Year (2021-2022)',
  deadline: 'The deadline that the packet information must be all submitted',
  teacher: 'Teacher Full Name',
  link: "The link for the parent to access student's packet",
  period_list: 'List of Periods that need to be changed',
  files: 'List of files that need to be uploaded',
  instructions: 'Where the specific instructions to the parent will be included in the email',
}
export const EmailTemplateModal = ({
  handleModem,
  type = 'standard',
  category,
  onSave,
  templateName,
  availableInserts,
}) => {
  const classes = useStyles()
  const [titleReadOnly, setTitleReadOnly] = useState(true)
  const [emailTemplateId, setEmailTemplateId] = useState(null)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [subject, setSubject] = useState('')
  const [emailTitle, setEmailTitle] = useState(templateName)
  const [notes, setNotes] = useState('')
  const [emailFrom, setEmailFrom] = useState('')
  const [emailBcc, setEmailBcc] = useState('')
  const [deadline, setDeadline] = useState('')
  const [reminders, setReminders] = useState([
    {
      reminderDay: '',
      reminderTitle: 'Reminder 1',
      reminderSubject: '',
      reminderBody: '',
      editorState: EditorState.createEmpty(),
    },
  ])
  const { called, loading, error, data, refetch } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: templateName,
    },
    fetchPolicy: 'network-only',
  })

  const handleAddReminder = () => {
    setReminders([
      ...reminders,
      ...[
        {
          reminderDay: '',
          reminderTitle: 'Reminder ' + (reminders.length + 1),
          reminderSubject: '',
          reminderBody: '',
          editorState: EditorState.createEmpty(),
        },
      ],
    ])
  }
  const handleChangeReminder = (value, i, field) => {
    const temp = reminders.slice()
    temp[i][field] = value
    if (field === 'editorState') {
      temp[i]['reminderBody'] = draftToHtml(convertToRaw(value.getCurrentContent()))
    }
    setReminders(temp)
  }
  const handleSave = () => {
    if (type === 'deadline') {
      onSave({
        id: Number(emailTemplateId),
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        // deadline,
        // reminders,
        template_name: templateName,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      })
    } else if (type === 'email') {
      onSave({
        id: Number(emailTemplateId),
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: templateName,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      })
    } else {
      onSave({
        id: Number(emailTemplateId),
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: templateName,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      })
    }
  }
  useEffect(() => {
    if (data !== undefined) {
      const { emailTemplateName } = data
      if (emailTemplateName) {
        const { id, title, subject, from, bcc, body } = emailTemplateName
        setEmailTemplateId(id)
        setEmailTitle(title)
        setSubject(subject)
        setEmailBcc(bcc)
        setEmailFrom(from)
        if (body) {
          const contentBlock = htmlToDraft(body)
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            // const content = ContentState.createFromBlockArray(convertFromHTML(body))
            setEditorState(EditorState.createWithContent(contentState))
          }
        }
      }
    }
  }, [data])
  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className={classes.modalCard}>
        <Box className={classes.header}>
          <OutlinedInput
            sx={{ flex: 1 }}
            inputProps={{ sx: { textOverflow: 'ellipsis', overflow: 'hidden' } }}
            size='small'
            fullWidth
            placeholder='[Email Title]'
            value={emailTitle}
            onChange={(e) => setEmailTitle(e.target.value)}
            readOnly={titleReadOnly}
            onFocus={(e) => setTitleReadOnly(false)}
            onBlur={(e) => setTitleReadOnly(true)}
          />
          <Box className={classes.subHeader}>
            <Button className={classes.save} onClick={handleSave}>
              Save
            </Button>
            <CloseIcon onClick={() => handleModem()} className={classes.close} />
          </Box>
        </Box>
        <Typography fontWeight='700'></Typography>
        <OutlinedInput
          value={subject}
          size='small'
          fullWidth
          placeholder='Subject'
          onChange={(e) => setSubject(e.target.value)}
        />
        <Box className={classes.editor}>
          <Wysiwyg.Editor
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
        <Box>
          <Grid container rowSpacing={2}>
            <Grid item xs={12}>
              <Subtitle fontWeight='700' size='large'>
                From
              </Subtitle>
              <TextField
                size='small'
                variant='outlined'
                fullWidth
                value={emailFrom}
                onChange={(e) => setEmailFrom(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Subtitle fontWeight='700' size='large'>
                Email BCC
              </Subtitle>
              <TextField
                size='small'
                variant='outlined'
                fullWidth
                value={emailBcc}
                onChange={(e) => setEmailBcc(e.target.value)}
              />
            </Grid>
            {type === 'deadline' && (
              <>
                <Grid item xs={12}>
                  <Subtitle fontWeight='700' size='large'>
                    Deadline (Days)
                  </Subtitle>
                  <Select
                    size='small'
                    name='deadline'
                    onChange={(e) => setDeadline(e.target.value)}
                    value={deadline}
                    className={classes.select}
                  >
                    {[...Array(30).keys()].map((i) => (
                      <MenuItem value={i} key={i}>
                        {i}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                {reminders.map((reminder, i) => (
                  <Box key={i} sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                      <Subtitle fontWeight='700' size='large'>
                        Reminder {i + 1} (Days before deadline)
                      </Subtitle>
                      <Select
                        size='small'
                        name='reminderDay'
                        onChange={(e) => handleChangeReminder(e.target.value, i, 'reminderDay')}
                        value={reminder.reminderDay}
                        className={classes.select}
                      >
                        {[...Array(30).keys()].map((i) => (
                          <MenuItem value={i} key={i}>
                            {i}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '28px' }}>
                      <Box className={classes.header}>
                        <OutlinedInput
                          sx={{ flex: 1 }}
                          size='small'
                          fullWidth
                          placeholder=''
                          value={reminder.reminderTitle}
                          onChange={(e) => handleChangeReminder(e.target.value, i, 'reminderTitle')}
                        />
                      </Box>
                      <Typography fontWeight='700'></Typography>
                      <OutlinedInput
                        value={reminder.reminderSubject}
                        size='small'
                        fullWidth
                        placeholder='Subject'
                        onChange={(e) => handleChangeReminder(e.target.value, i, 'reminderSubject')}
                      />
                      <Box className={classes.editor}>
                        <Wysiwyg.Editor
                          editorState={reminder.editorState}
                          onEditorStateChange={(editorState) => handleChangeReminder(editorState, i, 'editorState')}
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
                    </Grid>
                  </Box>
                ))}
                <Box sx={{ width: '100%', textAlign: 'right' }}>
                  <Grid item xs={12}>
                    <Button className={classes.add} onClick={handleAddReminder}>
                      <Add />
                      Add Reminder
                    </Button>
                  </Grid>
                </Box>
              </>
            )}
            {type === 'email' && (
              <>
                <Grid item xs={12}>
                  <Subtitle fontWeight='700' size='large'>
                    Auto Reminder Deadline
                  </Subtitle>
                  <TextField size='small' variant='outlined' fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <Subtitle fontWeight='700' size='large'>
                    Days to Submit a LL Early
                  </Subtitle>
                  <TextField size='small' variant='outlined' fullWidth />
                </Grid>
              </>
            )}

            {/* <Grid item xs={12}>
              <Subtitle fontWeight='700' size='large'>
                Notes
              </Subtitle>
              <TextField
                size='small'
                variant='outlined'
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Grid> */}
            {availableInserts && (
              <Grid item xs={12}>
                <Subtitle fontWeight='700' size='large'>
                  Available Inserts
                </Subtitle>
                {availableInserts.map((item, i) => (
                  <Box key={i} className={classes['availbe-row']}>
                    <Subtitle fontWeight='600' size='large' className='type-field'>
                      [{item}]
                    </Subtitle>
                    <Subtitle fontWeight='600' color='#A3A3A4' sx={{ fontSize: '18px' }}>
                      {insertDescriptions[item]}
                    </Subtitle>
                  </Box>
                ))}
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Modal>
  )
}
