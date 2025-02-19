import React, { useRef, useState, useEffect, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Add } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'
import EditIcon from '@mui/icons-material/Edit'
import {
  Button,
  Modal,
  OutlinedInput,
  Box,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import moment from 'moment'
import Wysiwyg from 'react-draft-wysiwyg'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { EmailCategoryEnum, MthColor } from '@mth/enums'
import { getEmailTemplateByIdQuery, getEmailRemindersQuery } from '@mth/graphql/queries/email-template'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { getEnrollmentQuestionsGql } from '@mth/graphql/queries/enrollment-question'
import { EmailTemplate, SchoolYear } from '@mth/models'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { mthButtonClasses } from '@mth/styles/button.style'
import { useStyles } from './styles'
import { StandardRes } from './types'

type EmailTemplateModalProps = {
  handleModem: () => void
  template: EmailTemplate
  onSave: (_) => void
  openResponseModal: (value: StandardRes[]) => void
  schoolYearId: string
  midYear: boolean
  schoolYear?: SchoolYear
}

const insertDescriptions = {
  user: "User's First Name",
  parent: "Parent's First Name",
  student: "Student's First Name",
  year: 'School Year (2021-2022)',
  deadline: 'The deadline that the packet information must be all submitted',
  teacher: 'Teacher Full Name',
  link: "The link for the parent to access student's packet",
  period_list: 'List of Periods that need to be changed',
  files: 'Title for standard response', //'List of files that need to be uploaded',
  instructions: 'Description for standard response', //'Where the specific instructions to the parent will be included in the email',
  application_year: 'School Year (2021-2022)',
  student_grade_level: 'Current grade level (6) (Kindergarten)',
}

export const EmailTemplateModal: React.FC<EmailTemplateModalProps> = ({
  handleModem,
  template,
  onSave,
  openResponseModal,
  schoolYearId,
  midYear,
  schoolYear,
}) => {
  const classes = useStyles()
  const { me } = useContext(UserContext)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [subject, setSubject] = useState('')
  const [emailTitle, setEmailTitle] = useState(template.title)

  const [emailFrom, setEmailFrom] = useState('')
  const [emailBcc, setEmailBcc] = useState('')
  const [deadline, setDeadline] = useState('')
  const [template_name, setTemplateName] = useState('')
  const [type, setType] = useState('standard')
  const [availableInserts, setAvailableInserts] = useState([])

  const [availableInsertDescription, setAvailableInsertDescription] = useState({})
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

  const { data } = useQuery(getEmailTemplateByIdQuery, {
    variables: {
      templateId: template.id,
    },
    fetchPolicy: 'network-only',
  })

  const { data: reminderData } = useQuery(getEmailRemindersQuery, {
    variables: {
      templateId: Number(template.id),
    },
    fetchPolicy: 'network-only',
  })

  const { data: enrollmentQuestionsData } = useQuery(getEnrollmentQuestionsGql, {
    variables: {
      input: { region_id: me?.selectedRegionId, school_year_id: parseInt(schoolYearId), mid_year: midYear },
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (reminderData !== undefined) {
      const reminderDetail = []
      reminderData?.remindersByTemplateId.forEach((remin) => {
        const { reminder_id, title, subject, body, reminder } = remin
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
        reminderDetail.push({
          reminderId: reminder_id,
          reminderDay: reminder,
          reminderTitle: title,
          reminderSubject: subject,
          reminderBody: body,
          editorState: editorState,
        })
      })
      setReminders(reminderDetail)
    }
  }, [reminderData])

  const handleEditorChange = (state, isBlockEnd = true) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length && isBlockEnd) {
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
      extraText: '',
    })
    setResponses(groups)
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

  const handleDeleteResponse = (index: number) => {
    response.splice(index, 1)
    setAddResponse(JSON.stringify(response))
  }

  const handleDeleteResponseGroup = (index: number, index_1: number) => {
    response[index].responses.splice(index_1, 1)
    setAddResponse(JSON.stringify(response))
  }

  const handleChangeGroupResponse = (value, index, i, field) => {
    const groups = response.slice()

    groups[index].responses[i][field] = value

    const optimized = groups
      .map((g) => {
        return {
          id: g.id,
          title: g.title,
          responses: g.responses.filter((x) => x.title != ''),
        }
      })
      .filter((g) => g.responses.length > 0)

    setAddResponse(JSON.stringify(optimized))
  }

  const handleSave = () => {
    const reminderData: (
      | { title: string; subject: string; body: string; reminder: string; id?: undefined }
      | { id: number; title: string; subject: string; body: string; reminder: string }
    )[] = []
    if (reminders.length > 0) {
      reminders.forEach((remind) => {
        if (remind.reminderDay !== '') {
          let newReminder
          if (remind?.reminderId === -1) {
            newReminder = {
              title: remind.reminderTitle,
              subject: remind.reminderSubject,
              body: remind.reminderBody,
              reminder: remind.reminderDay,
            }
          } else {
            newReminder = {
              id: Number(remind?.reminderId),
              title: remind.reminderTitle,
              subject: remind.reminderSubject,
              body: remind.reminderBody,
              reminder: remind.reminderDay,
            }
          }
          reminderData.push(newReminder)
        }
      })
    }

    switch (template?.template) {
      case 'standard_response':
        onSave({
          id: template.id,
          subject,
          title: emailTitle,
          from: emailFrom,
          bcc: emailBcc,
          template_name: template?.template_name || emailTitle,
          body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          standard_responses: addResponse,
          template: template.template,
          inserts: template.inserts.join(','),
          region_id: template.region_id,
        })
        break
      case 'standard_response_groups':
        onSave({
          id: template.id,
          subject,
          title: emailTitle,
          from: emailFrom,
          bcc: emailBcc,
          template_name: template?.template_name || emailTitle,
          body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          standard_responses: addResponse,
          template: template.template,
          inserts: template.inserts.join(','),
          region_id: template.region_id,
        })
        break
      case 'standard_modal':
        onSave({
          id: template.id,
          subject,
          title: emailTitle,
          from: emailFrom,
          bcc: emailBcc,
          template_name: template?.template_name || emailTitle,
          body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
          standard_responses: JSON.stringify(template?.standard_responses),
          template: template.template,
          inserts: template.inserts.join(','),
          region_id: template.region_id,
        })
        break
      case 'deadline':
        onSave({
          id: template.id,
          subject,
          title: emailTitle,
          from: emailFrom,
          bcc: emailBcc,
          deadline: deadline,
          reminders: reminderData,
          template_name: template?.template_name || emailTitle,
          template: template.template,
          body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        })
        break
      case 'email':
        onSave({
          id: template.id,
          subject,
          title: emailTitle,
          from: emailFrom,
          bcc: emailBcc,
          template_name: template?.template_name || emailTitle,
          template: template.template,
          body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        })
        break
      default:
        onSave({
          id: template.id,
          subject,
          title: emailTitle,
          from: emailFrom,
          bcc: emailBcc,
          template_name: template?.template_name || emailTitle,
          template: template.template,
          body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        })
        break
    }
  }

  useEffect(() => {
    if (data != undefined && enrollmentQuestionsData != undefined) {
      const { emailTemplate } = data
      setEmailTitle(emailTemplate.title)
      setTemplateName(emailTemplate.template_name)
      setSubject(emailTemplate.subject)
      setEmailBcc(emailTemplate.bcc)
      setEmailFrom(emailTemplate.from)
      setResponses(
        emailTemplate.standard_responses && JSON.parse(emailTemplate.standard_responses).length > 0
          ? JSON.parse(emailTemplate.standard_responses)
          : [],
      )

      //	Missing info
      const standard_response_groups_default: Array<unknown> = []
      const tab = enrollmentQuestionsData.getEnrollmentQuestions.find((x) => x.tab_name == 'Documents')
      if (tab) {
        tab.groups.forEach((group) => {
          const group_questions = group.questions.filter((q) => q.type == 8)
          group_questions.forEach((question) => {
            standard_response_groups_default.push({
              id: question.id,
              title: question.question,
              responses: [],
              order: question.order,
            })
          })
        })
      }

      if (emailTemplate.standard_responses == '') {
        if (emailTemplate.template == 'standard_response_groups') {
          setResponses(standard_response_groups_default)
        } else if (emailTemplate.template == 'standard_response') {
          setResponses([
            {
              title: '',
              extraText: '',
            },
          ])
        }
      } else if (emailTemplate.template == 'standard_response_groups') {
        const tmpArr = JSON.parse(emailTemplate.standard_responses)
        for (let i = 0; i < tmpArr.length; i++) {
          if (standard_response_groups_default.find((x) => x.id == tmpArr[i].id) == null) {
            tmpArr.splice(i, 1)
            i--
          }
        }
        standard_response_groups_default.forEach((group) => {
          const res = tmpArr.find((x) => x.id == group.id)
          if (res == null) tmpArr.push(group)
          else {
            res.order = group.order
            res.title = group.title
          }
        })
        tmpArr.sort(function (a, b) {
          return a.order - b.order
        })
        setResponses(tmpArr)
      }
      if (emailTemplate.category.category_name == EmailCategoryEnum.APPLICATIONS) {
        setDeadline(emailTemplate?.region?.enrollment_packet_deadline_num_days)
      }

      if (emailTemplate.category.category_name == EmailCategoryEnum.PACKETS) {
        setDeadline(emailTemplate?.region?.enrollment_packet_deadline_num_days)
      }

      if (emailTemplate.category.category_name == EmailCategoryEnum.WITHDRAWAL) {
        setDeadline(emailTemplate?.region?.withdraw_deadline_num_days)
        setAvailableInsertDescription({
          parent: "Parent's First Name",
          student: "Student's First Name",
          year: `School Year (${moment(schoolYear?.date_begin)?.format('YYYY')}-${moment(schoolYear?.date_end)?.format(
            'YYYY',
          )})`,
          deadline: 'Due Date',
          teacher: 'Teacher Full Name',
          link: 'Link to Withdraw Form to sign',
        })
      }
      setAddResponse(emailTemplate.standard_responses)
      setAvailableInserts(emailTemplate?.inserts?.split(','))
      setType(emailTemplate.template)
      if (emailTemplate.category.category_name != EmailCategoryEnum.WITHDRAWAL) {
        setAvailableInsertDescription({
          ...insertDescriptions,
          year: `School Year (${moment(schoolYear?.date_begin)?.format('YYYY')}-${moment(schoolYear?.date_end)?.format(
            'YYYY',
          )})`,
        })
      }
      if (emailTemplate.template_name === 'Application Accepted') {
        setAvailableInsertDescription({
          ...insertDescriptions,
          year: `School Year (${moment(schoolYear?.date_begin)?.format('YYYY')}-${moment(schoolYear?.date_end)?.format(
            'YYYY',
          )})`,
          deadline: 'Deadline set in the Packet Reminders Template',
        })
      }
      if (emailTemplate.category.category_name == EmailCategoryEnum.USERS) {
        setAvailableInsertDescription({
          ...insertDescriptions,
          link: 'Link for user to access  verification or update',
        })
      }
      if (emailTemplate.category.category_name == EmailCategoryEnum.SCHEDULES) {
        setAvailableInsertDescription({
          ...insertDescriptions,
          year: `School Year the schedule is for (${moment(schoolYear?.date_begin)?.format('YYYY')}-${moment(
            schoolYear?.date_end,
          )?.format('YYYY')})`,
        })
      }
      if (emailTemplate.category.category_name == EmailCategoryEnum.DIRECTORDERS) {
        setAvailableInsertDescription({
          ...insertDescriptions,
          submitted: 'The date the Request was submitted (mm/dd/yyyy)',
          amount: 'The total amout of the Request (Ex: $900.00)',
          category: 'The type of Request (Ex: Custom-built)',
          period: 'The Period tied to the Request',
          link: 'Link to the Direct Order Request',
          instructions: 'Standard Reponses',
        })
      }
      if (emailTemplate.category.category_name == EmailCategoryEnum.REIMBURSEMENTS) {
        setAvailableInsertDescription({
          ...insertDescriptions,
          submitted: 'The date the Request was submitted (mm/dd/yyyy)',
          amount: 'The total amout of the Request (Ex: $900.00)',
          category: 'The type of Request (Ex: Custom-built)',
          period: 'The Period tied to the Request',
          link: 'Link to the Request of Reimbursement',
          confirmation: 'Confirmation Numbers',
          instructions: 'Standard Reponses',
        })
      }
      if (emailTemplate.body) {
        const contentBlock = htmlToDraft(emailTemplate.body)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          // const content = ContentState.createFromBlockArray(convertFromHTML(body))
          setEditorState(EditorState.createWithContent(contentState))
        }
      }
    }
  }, [data, enrollmentQuestionsData, schoolYear])

  const handleRemoveReminder = (i) => {
    const newReminder = reminders.filter((item, index) => index !== i)
    setReminders(newReminder)
  }

  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className={classes.modalCard}>
        <Box className={classes.header} sx={{ paddingBottom: '8px' }}>
          <Subtitle fontWeight='700' size='large' sx={{ paddingLeft: '8px' }}>
            {emailTitle}
          </Subtitle>
          <Box className={classes.subHeader}>
            <Button className={classes.save} onClick={handleSave}>
              Save
            </Button>
            <CloseIcon onClick={() => handleModem()} className={classes.close} />
          </Box>
        </Box>
        <Typography fontWeight='700'></Typography>
        {template_name == 'Notify of Withdraw' && (
          <>
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
                    'embedded' /*, 'emoji'*/,
                    'image',
                    'remove',
                    'history',
                  ],
                }}
              />
            </Box>
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
            </Grid>
          </>
        )}
        {type === 'deadline' ? (
          <>
            <Grid item xs={12} sx={{ marginTop: '10px', marginBottom: '26px' }}>
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
          </>
        ) : (
          <>
            <OutlinedInput
              value={subject}
              size='small'
              fullWidth
              placeholder='Subject'
              onChange={(e) => setSubject(e.target.value)}
            />
            <Box
              className={classes.editor}
              sx={{
                'div.rdw-editor-main': {
                  '.public-DraftStyleDefault-block': {
                    margin: 0,
                  },
                },
              }}
            >
              <Wysiwyg.Editor
                onContentStateChange={(state) => {
                  handleEditorChange(state, false)
                }}
                editorRef={(ref) => (editorRef.current = ref)}
                editorState={editorState}
                onEditorStateChange={setEditorState}
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
                    'embedded' /*, 'emoji'*/,
                    'image',
                    'remove',
                    'history',
                  ],
                }}
              />
            </Box>
          </>
        )}
        <Box>
          <Grid container rowSpacing={2}>
            {template_name != 'Notify of Withdraw' && (
              <>
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
              </>
            )}
            {type === 'standard_response' && (
              <Grid container rowSpacing={2}>
                {response.length > 0 &&
                  response.map((_reminder, i) => (
                    <Box key={i} sx={{ width: '100%' }}>
                      <Grid item xs={12} sx={{ marginTop: '50px', display: 'flex', alignItems: 'center' }}>
                        <TextField
                          size='small'
                          placeholder='Edit Title'
                          multiline
                          variant='outlined'
                          onChange={(e) => handleChangeResponse(e.target.value, i, 'title')}
                          fullWidth
                          value={response[i].title}
                        />
                        {template_name === 'Age Issue' && (
                          <Box onClick={() => handleDeleteResponse(i)}>
                            <Tooltip title='Delete' placement='top'>
                              <DeleteForeverOutlinedIcon
                                sx={{ cursor: 'pointer', width: '40px', color: MthColor.BLACK }}
                                fontSize='medium'
                              />
                            </Tooltip>
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={12} sx={{ marginTop: '25px' }}>
                        <TextField
                          size='small'
                          variant='outlined'
                          multiline
                          fullWidth
                          value={response[i].extraText}
                          onChange={(e) => handleChangeResponse(e.target.value, i, 'extraText')}
                        />
                      </Grid>
                    </Box>
                  ))}
                <Box sx={{ width: '100%', marginTop: 4 }}>
                  <Grid item xs={12}>
                    <Button sx={{ ...mthButtonClasses.primary, float: 'right' }} onClick={handleResponse}>
                      <Add />
                      Add Response
                    </Button>
                  </Grid>
                </Box>
              </Grid>
            )}

            {type === 'standard_response_groups' && (
              <Grid container rowSpacing={2}>
                {Object.keys(response).map((index) => (
                  <Box key={index} sx={{ width: '100%', textAlign: 'right', marginTop: 4 }}>
                    <Subtitle fontWeight='700' size='large' sx={{ textAlign: 'left' }}>
                      {response[index].title}
                    </Subtitle>
                    <Grid item xs={12} sx={{ textAlign: 'left' }}>
                      {response[index].responses.length > 0 &&
                        response[index].responses.map((_reminder: unknown, i: number) => (
                          <Box key={i} sx={{ width: '100%' }}>
                            <Grid
                              item
                              xs={12}
                              sx={{ marginTop: '25px', width: '80%', display: 'flex', alignItems: 'center' }}
                            >
                              <TextField
                                size='small'
                                placeholder='Edit Title'
                                variant='outlined'
                                onChange={(e) => handleChangeGroupResponse(e.target.value, index, i, 'title')}
                                fullWidth
                                value={response[index].responses[i].title}
                              />
                              {template_name === 'Missing Information' && (
                                <Box onClick={() => handleDeleteResponseGroup(index, i)}>
                                  <Tooltip title='Delete' placement='top'>
                                    <DeleteForeverOutlinedIcon
                                      sx={{ cursor: 'pointer', width: '40px', color: MthColor.BLACK }}
                                      fontSize='medium'
                                    />
                                  </Tooltip>
                                </Box>
                              )}
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: '25px' }}>
                              <MthBulletEditor
                                value={response[index].responses[i].extraText}
                                setValue={(value) => handleChangeGroupResponse(value, index, i, 'extraText')}
                                height='150px'
                                isBlockEnd={false}
                              />
                            </Grid>
                          </Box>
                        ))}
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: '25px' }}>
                      <Button
                        sx={{ ...mthButtonClasses.primary, float: 'right' }}
                        onClick={() => handleGroupResponse(index)}
                      >
                        <Add />
                        Add Response
                      </Button>
                    </Grid>
                  </Box>
                ))}
              </Grid>
            )}
            {type === 'standard_modal' && (
              <Grid item xs={12}>
                <Subtitle fontWeight='700' size='large'>
                  Standard Responses
                  <IconButton onClick={() => openResponseModal(template?.standard_responses)}>
                    <EditIcon style={{ color: '#4145FF', marginLeft: '5px' }} />
                  </IconButton>
                </Subtitle>
                {template?.standard_responses &&
                  Object.keys(template?.standard_responses).map((_value: string, index: number) => (
                    <Box key={index} className={classes['availbe-row']}>
                      <Subtitle fontWeight='600' color='#A3A3A4' sx={{ fontSize: '18px', marginLeft: '8px' }}>
                        {template?.standard_responses[index].title}
                      </Subtitle>
                    </Box>
                  ))}
              </Grid>
            )}
            {type === 'deadline' && (
              <>
                {reminders.map((reminder, i) => (
                  <Box key={i} sx={{ width: '100%' }}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Subtitle fontWeight='700' size='large'>
                          Reminder {i + 1} (Days before deadline)
                        </Subtitle>
                        {i === reminders.length - 1 && (
                          <Tooltip title='Remove Reminder' style={{ marginLeft: '10px' }} placement='top'>
                            <CloseIcon onClick={() => handleRemoveReminder(i)} className={classes.close} />
                          </Tooltip>
                        )}
                      </Box>
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
                <Box sx={{ width: '100%', marginTop: reminders.length > 0 ? '0' : '16px' }}>
                  <Grid item xs={12}>
                    <Button
                      sx={{ ...mthButtonClasses.primary, float: 'right' }}
                      onClick={handleAddReminder}
                      style={{ color: MthColor.WHITE }}
                    >
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
            {!!availableInserts?.length && (
              <Grid item xs={12}>
                <Subtitle fontWeight='700' size='large'>
                  Available Inserts
                </Subtitle>
                {availableInserts.map((item, i) => (
                  <Box key={i} className={classes['availbe-row']}>
                    <Subtitle fontWeight='600' size='large' className='type-field'>
                      [{item}]
                    </Subtitle>
                    <Subtitle fontWeight='600' color='#A3A3A4' sx={{ fontSize: '18px', marginLeft: '30px' }}>
                      {availableInsertDescription[item]}
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
