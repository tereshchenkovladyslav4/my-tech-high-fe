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
import { getEmailTemplateByIdQuery, getEmailRemindersQuery } from '../../../../../graphql/queries/email-template'
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
  application_year: 'School Year (2021-2022)',
  student_grade_level: 'Current grade level (6) (Kindergarten)'
}
export const EmailTemplateModal = ({
  handleModem,
  template,
  onSave,
}) => {
  const classes = useStyles()
  const [titleReadOnly, setTitleReadOnly] = useState(true)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [subject, setSubject] = useState('')
  const [emailTitle, setEmailTitle] = useState(template.title)
  const [notes, setNotes] = useState('')
  const [emailFrom, setEmailFrom] = useState('')
  const [emailBcc, setEmailBcc] = useState('')
  const [deadline, setDeadline] = useState('')
  const [type, setType] = useState('standard')
  const [availableInserts, setAvailableInserts] = useState([])
  const editorRef = useRef(null)
  const [currentBlocks, setCurrentBlocks] = useState(0)
  const [reminders, setReminders] = useState([
    {
      reminderId: -1,
      reminderDay: '',
      reminderTitle: 'Reminder 1',
      reminderSubject: '',
      reminderBody: '',
      editorState: EditorState.createEmpty(),
    },
  ])
  const [addResponse, setAddResponse] = useState('')
  const [response, setResponses] = useState([])

  const { called, loading, error, data, refetch } = useQuery(getEmailTemplateByIdQuery, {
    variables: {
      templateId: template.id,
    },
    fetchPolicy: 'network-only',
  })

  const { loading: reminderLoading, error: reminderError, data: reminderData, refetch: refetchReminder } = useQuery(getEmailRemindersQuery, {
    variables: {
      templateId: Number(template.id),
    },
    skip: template.id,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (reminderData !== undefined) {
      console.log('reminderData', reminderData)
      const reminders = []
      reminderData?.remindersByTemplateId.forEach(remin => {
        const { reminder_id, title, subject, body, deadline } = remin
        let editorState
        if (body) {
          const contentBlock = htmlToDraft(body)
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            // const content = ContentState.createFromBlockArray(convertFromHTML(body))
            editorState = EditorState.createWithContent(contentState)
          }
        } else {
          editorState = EditorState.createEmpty()
        }
        reminders.push({
          reminderId: reminder_id,
          reminderDay: deadline,
          reminderTitle: title,
          reminderSubject: subject,
          reminderBody: body,
          editorState: editorState,
        })
      })
      setReminders(reminders);
    }
  }, [reminderData])

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
          reminderId: -1,
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
          title: '',
          extraText: '',
        },
      ],
    ])
  }

  const handleGroupResponse = (index) => {
    const groups = response.slice()

    groups[index].responses.push({
      title: '',
      extraText: ''
    })
    setResponses(groups);
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
    const standard_response = response.slice()

    standard_response[i][field] = value

    setAddResponse(JSON.stringify(standard_response))
  }

  const handleChangeGroupResponse = (value, index, i, field) => {
    const groups = response.slice()

    groups[index].responses[i][field] = value;

    setAddResponse(JSON.stringify(groups));
  }

  const handleSave = () => {
    const reminderData = []
    if(reminders.length  > 0) {
      reminders.forEach(remind => {
        if(remind.reminderDay !== '') {
          let newReminder
          if(remind?.reminderId === -1) {
            newReminder = {
              title: remind.reminderTitle,
              subject: remind.reminderSubject,
              body: remind.reminderBody,
              deadline: remind.reminderDay
            }
          } else {
            newReminder = {
              id: Number(remind?.reminderId),
              title: remind.reminderTitle,
              subject: remind.reminderSubject,
              body: remind.reminderBody,
              deadline: remind.reminderDay
            }
          }
          reminderData.push(newReminder);
        }
      })
    }
    
    switch (template.template) {
    case 'standard_response':
      onSave({
        id: template.id,
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: emailTitle,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        standard_responses: addResponse,
        template: template.template,
        inserts: template.inserts.join(','),
        region_id: template.region_id
      })
      break;
    case 'standard_response_groups':
      onSave({
        id: template.id,
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: emailTitle,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        standard_responses: addResponse,
        template: template.template,
        inserts: template.inserts.join(','),
        region_id: template.region_id
      })
      break;
    case 'deadline':
      onSave({
        id: template.id,
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        deadline: deadline,
        reminders: reminderData,
        template_name: emailTitle,
        template: template.template,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      })
      break;
    case 'email':
      onSave({
        id: template.id,
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: emailTitle,
        template: template.template,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      })
      break;
    default:
      onSave({
        id: template.id,
        subject,
        title: emailTitle,
        from: emailFrom,
        bcc: emailBcc,
        template_name: emailTitle,
        template: template.template,
        body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      })
      break;
    }
  }

  useEffect(() => {
    if(data != undefined) {
      const {emailTemplate} = data;
      setEmailTitle(emailTemplate.title)
      setSubject(emailTemplate.subject)
      setEmailBcc(emailTemplate.bcc)
      setEmailFrom(emailTemplate.from)
      setResponses(emailTemplate.standard_responses
        && JSON.parse(emailTemplate.standard_responses).length > 0
              ? JSON.parse(emailTemplate.standard_responses) : [],)

      //  Missing info
      const standard_response_groups_default = 
        [
          {title: 'Birth Certificate Upload',
          responses: [
            {title: '',
            extraText: ''}
          ]},
          {title: 'Immunization Upload',
          responses: [
            {title: '',
            extraText: ''}
          ]},
          {title: 'Proof of Residency',
          responses: [
            {title: '',
            extraText: ''}
          ]},
          {title: 'IEP or 504 Upload',
          responses: [
            {title: '',
            extraText: ''}
          ]},
        ];
      if(emailTemplate.standard_responses == '') {
        if(type == 'standard_response_groups') {
          setResponses(standard_response_groups_default);
        }
        else if(type == 'standard_response') {
          setResponses([
            {
              title: '',
              extraText: '',
            },
          ])
        }
      }

      setAddResponse(emailTemplate.standard_responses)
      setAvailableInserts(emailTemplate.inserts.split(","))
      setType(emailTemplate.template)
      if (emailTemplate.body) {
        const contentBlock = htmlToDraft(emailTemplate.body)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          // const content = ContentState.createFromBlockArray(convertFromHTML(body))
          setEditorState(EditorState.createWithContent(contentState))
        }
      }

      if( emailTemplate.category.category_name == 'Applications' ){
        setDeadline( emailTemplate.region.application_deadline_num_days );
      }

      if( emailTemplate.category.category_name == 'Enrollment Packets' ){
        setDeadline( emailTemplate.region.enrollment_packet_deadline_num_days );
      }

    }
  }, [data])

  useEffect(() => {
console.log(response);
  }, [response])

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
                {response.length > 0 &&
                  response.map((reminder, i) => (
                    <Box key={i} sx={{ width: '100%' }}>
                      <Grid item xs={12} sx={{ marginTop: '50px', width: 170 }}>
                        <TextField
                          size='small'
                          placeholder='Edit Title'
                          variant='outlined'
                          onChange={(e) => handleChangeResponse(e.target.value, i, 'title')}
                          fullWidth
                          value={response[i].title}
                        />
                      </Grid>

                      <Grid item xs={12} sx={{ marginTop: '25px' }}>
                        <TextField
                          size='small'
                          variant='outlined'
                          fullWidth
                          value={response[i].extraText}
                          onChange={(e) => handleChangeResponse(e.target.value, i, 'extraText')}
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

            {type === 'standard_response_groups' && (
              <Grid container rowSpacing={2}>
                {Object.keys(response)
                .map((index) => (
                  <Box sx={{ width: '100%', textAlign: 'right', marginTop: 4 }}>
                    <Subtitle fontWeight='700' size='large' sx={{textAlign: 'left'}}>
                        {response[index].title}
                    </Subtitle>
                    <Grid item xs={12} sx={{ textAlign: 'left' }}>
                      {response[index].responses.length > 0 &&
                        response[index].responses.map((reminder, i) => (
                          <Box key={i} sx={{ width: '100%' }}>
                            <Grid item xs={12} sx={{ marginTop: '25px', width: '80%' }}>
                              <TextField
                                size='small'
                                placeholder='Edit Title'
                                variant='outlined'
                                onChange={(e) => handleChangeGroupResponse(e.target.value, index, i, 'title')}
                                fullWidth
                                value={response[index].responses[i].title}
                              />
                            </Grid>

                            <Grid item xs={12} sx={{ marginTop: '25px' }}>
                              <textarea
                                variant='outlined'
                                fullWidth
                                value={response[index].responses[i].extraText}
                                onChange={(e) => handleChangeGroupResponse(e.target.value, index, i, 'extraText')}
                                rows={4}
                                className={classes.textarea}
                              />
                            </Grid>
                          </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '25px' }}>
                      <Button className={classes.add} onClick={(e) => handleGroupResponse(index)}>
                        <Add />
                        Add Response
                      </Button>
                    </Grid>
                  </Box>
                ))}
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
