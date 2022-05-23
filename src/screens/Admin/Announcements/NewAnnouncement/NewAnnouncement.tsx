import { Box, Button, Card, Checkbox, FormControlLabel, Grid, IconButton, OutlinedInput } from '@mui/material'
import React, { useEffect, useState, useContext, useRef } from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { ANNOUNCEMENTS, MTHBLUE, GRADES, RED } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { useHistory } from 'react-router-dom'
import Wysiwyg from 'react-draft-wysiwyg'
import { ContentState, EditorState, convertToRaw, ContentBlock } from 'draft-js'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { map } from 'lodash'
import { useMutation } from '@apollo/client'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { AnnouncementType } from '../types'
import { CreateAnnouncementMutation, UpdateAnnouncementMutation } from '../services'
import { PublishModal } from '../PublishModal'

type NewAnnouncementProps = {
  announcement?: AnnouncementType
  setPage: (value: string) => void
  setAnnouncement?: (value: AnnouncementType) => void
}

const NewAnnouncement = ({ setPage, announcement, setAnnouncement }: NewAnnouncementProps) => {
  const classes = useStyles
  const history = useHistory()
  const { me } = useContext(UserContext)
  const [emailFrom, setEmailFrom] = useState<string>('')
  const [announcementId, setAnnouncementId] = useState<number>(0)
  const [subject, setSubject] = useState<string>('')
  const [currentBlocks, setCurrentBlocks] = useState<number>(0)
  const [expand, setExpand] = useState<boolean>(true)
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false)
  const [cronJobTime, setCronJobTime] = useState<Date | null | ''>(new Date())
  const [grades, setGrades] = useState<string[]>([])
  const [users, setUsers] = useState<string[]>([])
  const defaultEmail = 'Vivamus sagitis lacus vel augue laoreet rutrum faucibus dolor auctor...'
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(defaultEmail)),
  )
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false)
  const [subjectInvalid, setSubjectInvalid] = useState<boolean>(false)
  const [bodyInvalid, setBodyInvalid] = useState<boolean>(false)
  const [gradesInvalid, setGradesInvalid] = useState<boolean>(false)
  const [usersInvalid, setUsersInvalid] = useState<boolean>(false)
  const editorRef = useRef(null)
  const [submitCreate, {}] = useMutation(CreateAnnouncementMutation)
  const [submitSave, {}] = useMutation(UpdateAnnouncementMutation)

  const handlePublish = () => {
    setShowPublishModal(false)
    handleSaveClick('Published')
  }

  const handleSetSchedule = () => {
    handleSaveClick('Scheduled')
  }

  const handleBackClick = () => {
    setPage('root')
    if (announcement) setAnnouncement(null)
    history.push(ANNOUNCEMENTS)
  }

  const validation = () => {
    if (
      grades?.length > 0 &&
      users?.length > 0 &&
      subject &&
      emailFrom &&
      draftToHtml(convertToRaw(editorState.getCurrentContent())).length > 8
    ) {
      return true
    } else {
      if (grades?.length == 0) setGradesInvalid(true)
      if (users?.length == 0) setUsersInvalid(true)
      if (!emailFrom) setEmailInvalid(true)
      if (!subject) setSubjectInvalid(true)
      if (draftToHtml(convertToRaw(editorState.getCurrentContent())).length <= 8) setBodyInvalid(true)
      return false
    }
  }

  const handleSaveClick = async (status: string = 'Draft') => {
    if (validation() && announcementId > 0) {
      const submitSaveResponse = await submitSave({
        variables: {
          updateAnnouncementInput: {
            announcement_id: announcementId * 1,
            filter_grades: JSON.stringify(grades),
            filter_users: JSON.stringify(users),
            status: status,
            subject: subject,
            RegionId: me?.selectedRegionId,
            body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            posted_by: emailFrom,
            schedule_time: cronJobTime,
          },
        },
      })

      if (submitSaveResponse) {
        handleBackClick()
      }
    } else if (validation()) {
      const submitCreateResponse = await submitCreate({
        variables: {
          createAnnoucementInput: {
            filter_grades: JSON.stringify(grades),
            filter_users: JSON.stringify(users),
            status: status,
            subject: subject,
            RegionId: me?.selectedRegionId,
            body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            posted_by: emailFrom,
            schedule_time: cronJobTime,
          },
        },
      })

      if (submitCreateResponse) {
        handleBackClick()
      }
    }
  }

  const handlePublishClick = () => {
    if (validation()) {
      setShowPublishModal(true)
    }
  }

  const handleEditorChange = (state) => {
    try {
      if (currentBlocks !== 0 && currentBlocks !== state.blocks.length) {
        editorRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }
      setCurrentBlocks(state.blocks.length)
    } catch {}
  }

  const chevron = () =>
    !expand ? (
      <ChevronRightIcon
        sx={{
          color: MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
      />
    ) : (
      <ExpandMoreIcon
        sx={{
          color: MTHBLUE,
          verticalAlign: 'bottom',
          cursor: 'pointer',
        }}
      />
    )

  const handleChangeAll = (e) => {
    if (e.target.checked) {
      setGrades([...['all'], ...GRADES.map((item) => item.toString())])
      setGradesInvalid(false)
    } else {
      setGrades([])
      setGradesInvalid(true)
    }
  }

  const handleChangeGrades = (e) => {
    if (grades.includes(e.target.value)) {
      setGrades(grades.filter((item) => item !== e.target.value).filter((item) => item !== 'all'))
    } else {
      setGrades([...grades, e.target.value])
    }
    setGradesInvalid(false)
  }

  const renderGrades = () =>
    map(GRADES, (grade, index) => {
      if (typeof grade !== 'string') {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 30 }}
            control={
              <Checkbox checked={grades.includes(grade.toString())} value={grade} onChange={handleChangeGrades} />
            }
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>{`${toOrdinalSuffix(
                grade,
              )} Grade`}</Paragraph>
            }
          />
        )
      } else {
        return (
          <FormControlLabel
            key={index}
            sx={{ height: 30 }}
            control={<Checkbox checked={grades.includes(grade)} value={grade} onChange={handleChangeGrades} />}
            label={
              <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                {grade}
              </Paragraph>
            }
          />
        )
      }
    })

  const handleChangeUsers = (e) => {
    if (users.includes(e.target.value)) {
      setUsers(users.filter((item) => item !== e.target.value))
      setUsersInvalid(false)
    } else {
      setUsers([...users, e.target.value])
      setUsersInvalid(false)
    }
  }

  const Filters = () => (
    <Grid container sx={{ textAlign: 'left', marginY: '12px' }}>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Paragraph size='large' fontWeight='700'>
              Grades
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='all' checked={grades.includes('all')} onChange={handleChangeAll} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Select All
                </Paragraph>
              }
            />
            {renderGrades()}
            {gradesInvalid && (
              <Subtitle size='small' color={RED} fontWeight='700'>
                Please select one at least
              </Subtitle>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}></Grid>
        <Grid item xs={6}>
          <Box sx={{ display: 'grid' }}>
            <Paragraph sx={{ marginTop: '12px' }} size='large' fontWeight='700'>
              Users
            </Paragraph>
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='1' checked={users.includes('1')} onChange={handleChangeUsers} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Parents/Observers
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='2' checked={users.includes('2')} onChange={handleChangeUsers} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Students
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='3' checked={users.includes('3')} onChange={handleChangeUsers} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Teachers & Assistants
                </Paragraph>
              }
            />
            <FormControlLabel
              sx={{ height: 30 }}
              control={<Checkbox value='0' checked={users.includes('0')} onChange={handleChangeUsers} />}
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  Admin
                </Paragraph>
              }
            />
            {usersInvalid && (
              <Subtitle size='small' color={RED} fontWeight='700'>
                Please select one at least
              </Subtitle>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  )

  const handleBodyChange = (e) => {
    setEditorState(e)
    setBodyInvalid(false)
  }

  useEffect(() => {
    if (announcement) {
      setAnnouncementId(announcement.id)
      setEmailFrom(announcement.postedBy)
      setGrades(JSON.parse(announcement.filterGrades))
      setUsers(JSON.parse(announcement.filterUsers))
      setSubject(announcement.subject)
      if (announcement.body) {
        const contentBlock = htmlToDraft(announcement.body)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          setEditorState(EditorState.createWithContent(contentState))
        }
      }
    }
  }, [announcement])

  return (
    <Card sx={classes.cardBody}>
      <Box sx={classes.pageTop}>
        <Box sx={classes.pageTitle}>
          <IconButton
            onClick={handleBackClick}
            sx={{
              position: 'relative',
            }}
          >
            <ArrowBackIosRoundedIcon sx={{ fontSize: '15px', stroke: 'black', strokeWidth: 2 }} />
          </IconButton>
          {announcement ? (
            <Subtitle size='medium' fontWeight='700'>
              Edit Announcement
            </Subtitle>
          ) : (
            <Subtitle size='medium' fontWeight='700'>
              Add Announcement
            </Subtitle>
          )}
        </Box>
        <Box sx={classes.pageTopRight}>
          <Button sx={classes.cancelBtn} onClick={() => handleBackClick()}>
            Cancel
          </Button>
          <Button sx={classes.saveBtn} onClick={() => handleSaveClick()}>
            Save
          </Button>
          <Button sx={classes.publishBtn} onClick={() => handlePublishClick()}>
            Publish
          </Button>
        </Box>
      </Box>
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={6} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <Box sx={{ padding: '40px', paddingBottom: alert ? '20px' : undefined }}>
              <OutlinedInput
                value={emailFrom}
                size='small'
                fullWidth
                onChange={(e) => setEmailFrom(e.target.value)}
                placeholder='From/Reply to'
                sx={classes.subject}
              />
              {emailInvalid && emailFrom == '' && (
                <Subtitle size='small' color={RED} fontWeight='700'>
                  Please enter email
                </Subtitle>
              )}
              {emailInvalid && emailFrom != '' && (
                <Subtitle size='small' color={RED} fontWeight='700'>
                  Invalid Email!. Please enter registered email
                </Subtitle>
              )}
              <OutlinedInput
                value={subject}
                size='small'
                fullWidth
                placeholder='Subject'
                onChange={(e) => {
                  setSubject(e.target.value)
                  setSubjectInvalid(false)
                }}
              />
              {subjectInvalid && (
                <Subtitle size='small' color={RED} fontWeight='700'>
                  Please enter subject
                </Subtitle>
              )}
              <Box sx={classes.editor}>
                <Wysiwyg.Editor
                  onContentStateChange={handleEditorChange}
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
              {bodyInvalid && (
                <Subtitle size='small' color={RED} fontWeight='700'>
                  Please enter email text
                </Subtitle>
              )}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ marginTop: 2, padding: 2 }}>
              <Box display='flex' flexDirection='row' onClick={() => setExpand(!expand)}>
                <Subtitle fontWeight='700' color={MTHBLUE} sx={{ cursor: 'pointer' }}>
                  Filter
                </Subtitle>
                {chevron()}
              </Box>
              {expand && Filters()}
            </Card>
          </Grid>
        </Grid>
        {showPublishModal && (
          <PublishModal
            onClose={() => setShowPublishModal(false)}
            onPublish={() => handlePublish()}
            setCronJobTime={setCronJobTime}
            onSchedule={() => handleSetSchedule()}
          />
        )}
      </Box>
    </Card>
  )
}

export default NewAnnouncement
