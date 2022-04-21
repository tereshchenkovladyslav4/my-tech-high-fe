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

import CloseIcon from '@mui/icons-material/Close'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { Add } from '@mui/icons-material'
import { getEmailTemplateQuery } from '../../services'
import { useQuery, useMutation } from '@apollo/client'
import Wysiwyg from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { useStyles } from './styles'

const insertDescriptions = {
  parent: "Parent's First Name",
  student: "Student's First Name",
  year: 'School Year (2021-2022)',
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
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const [reminders, setReminders] = useState([
    {
      reminderDay: '',
      reminderTitle: 'Reminder 1',
      reminderSubject: '',
      reminderBody: '',
      editorState: EditorState.createEmpty(),
    },
  ])
  const [addResponse, setAddResponse] = useState([
    {
      preSchool: '',
      elemSchool: '',
    },
  ])

  const [response, setResponses] = useState([
    {
      previousSchool: '',
      elementarySchool: '',
      editorState: EditorState.createEmpty(),
    },
  ])

  const { called, loading, error, data, refetch } = useQuery(getEmailTemplateQuery, {
    variables: {
      template: templateName,
    },
    fetchPolicy: 'network-only',
  })

  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  //Add Reminder
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

  //Add Response
  const handleResponse = () => {
    setResponses([
      ...response,
      ...[
        {
          previousSchool: '',
          elementarySchool: '',
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

  const handleChangeResponse = (value, i, field) => {
    const temp = response.slice()
    temp[i][field] = value
    // if (field === 'editorState') {
    //   temp[i]['reminderBody'] = draftToHtml(convertToRaw(value.getCurrentContent()))
    // }

    console.log(temp)
    setResponses(temp)
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
            onContentStateChange={handleEditorChange}
            editorRef={(ref) => (editorRef.current = ref)}
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

            {type === 'standard_response' && (
              <Grid container rowSpacing={2}>
                {response.map((reminder, i) => (
                  <Box key={i} sx={{ width: '100%' }}>
                    <Grid item xs={12} sx={{ marginTop: '50px', width: 170 }}>
                      <TextField
                        size='small'
                        placeholder='Edit Title'
                        variant='outlined'
                        // onChange={(e) => handleChangeResponse(e.target.value, i, 'responseTitle')}
                        fullWidth
                        // value={response[i].previousSchool}
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ marginTop: '25px' }}>
                      <TextField
                        size='small'
                        variant='outlined'
                        fullWidth
                        // value={response[i].elementarySchool}
                        // onChange={(e) => handleChangeResponse(e.target.value, i, 'responseTitle')}
                        rows={4}
                      />
                    </Grid>
                  </Box>
                ))}
                <Box sx={{ width: '100%', textAlign: 'right', marginTop: 4 }}>
                  <Grid item xs={12}>
                    <Button className={classes.add} onClick={handleResponse}>
                      <Add />
                      Add Response
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            )}
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
                          onContentStateChange={handleEditorChange}
                          editorRef={(ref) => (editorRef.current = ref)}
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
