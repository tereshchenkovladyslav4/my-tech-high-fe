import { Box, Card, Grid } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import { useStyles } from './styles'
import { ANNOUNCEMENTS } from '../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import { useMutation } from '@apollo/client'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { CreateAnnouncementMutation, UpdateAnnouncementMutation } from '../services'
import { PublishModal } from '../PublishModal'
import { HeaderComponent } from './HeaderComponent'
import { EditComponent } from './EditComponent'
import { FilterComponent } from './FilterComponent'
import { Announcement } from '../../../Dashboard/Announcements/types'

type NewAnnouncementProps = {
  announcement: Announcement | null
  setAnnouncement: (value: Announcement | null) => void
}

const NewAnnouncement = ({ announcement, setAnnouncement }: NewAnnouncementProps) => {
  const classes = useStyles
  const history = useHistory()
  const { me } = useContext(UserContext)
  const [emailFrom, setEmailFrom] = useState<string>('')
  const [announcementId, setAnnouncementId] = useState<number>(0)
  const [isArchived, setIsArchived] = useState<boolean>(false)
  const [subject, setSubject] = useState<string>('')
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false)
  const [cronJobTime, setCronJobTime] = useState<Date | null | ''>(new Date())
  const [grades, setGrades] = useState<string[]>([])
  const [users, setUsers] = useState<string[]>([])
  const defaultEmail = ''
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(defaultEmail)),
  )
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false)
  const [subjectInvalid, setSubjectInvalid] = useState<boolean>(false)
  const [bodyInvalid, setBodyInvalid] = useState<boolean>(false)
  const [gradesInvalid, setGradesInvalid] = useState<boolean>(false)
  const [usersInvalid, setUsersInvalid] = useState<boolean>(false)
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
    if (announcement) setAnnouncement(null)
    history.push(ANNOUNCEMENTS)
  }

  const validation = (): boolean => {
    if (
      grades?.length > 0 &&
      users?.length > 0 &&
      subject &&
      emailFrom &&
      isEmail(emailFrom) &&
      draftToHtml(convertToRaw(editorState.getCurrentContent())).length > 8
    ) {
      return true
    } else {
      if (grades?.length == 0) setGradesInvalid(true)
      if (users?.length == 0) setUsersInvalid(true)
      if (!emailFrom || !isEmail(emailFrom)) setEmailInvalid(true)
      if (!subject) setSubjectInvalid(true)
      if (draftToHtml(convertToRaw(editorState.getCurrentContent())).length <= 8) setBodyInvalid(true)
      return false
    }
  }

  const setFlagDefault = () => {
    setGradesInvalid(false)
    setUsersInvalid(false)
    setEmailInvalid(false)
    setSubjectInvalid(false)
    setBodyInvalid(false)
  }

  const handleSaveClick = async (status: string = 'Draft') => {
    if (validation() && announcementId > 0) {
      const submitSaveResponse = await submitSave({
        variables: {
          updateAnnouncementInput: {
            announcement_id: Number(announcementId),
            filter_grades: JSON.stringify(grades),
            filter_users: JSON.stringify(users),
            status: status,
            subject: subject,
            RegionId: me?.selectedRegionId,
            body: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            posted_by: emailFrom,
            schedule_time: cronJobTime,
            isArchived: isArchived,
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
            isArchived: false,
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

  const isEmail = (email: string): boolean => {
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    )
    return regexp.test(email)
  }

  useEffect(() => {
    if (announcement) {
      setAnnouncementId(Number(announcement?.id))
      setEmailFrom(announcement?.postedBy || '')
      setGrades(JSON.parse(announcement?.filterGrades || ''))
      setUsers(JSON.parse(announcement?.filterUsers || ''))
      setSubject(announcement?.subject || '')
      setIsArchived(!!announcement?.isArchived)
      if (announcement.body) {
        const contentBlock = htmlToDraft(announcement.body)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
          setEditorState(EditorState.createWithContent(contentState))
        }
      }
      return
    }
    setFlagDefault()
  }, [me?.selectedRegionId, announcement])

  return (
    <Card sx={classes.cardBody}>
      <HeaderComponent
        announcement={announcement}
        setAnnouncement={setAnnouncement}
        handleSaveClick={handleSaveClick}
        handlePublishClick={handlePublishClick}
      />
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={6} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <EditComponent
              emailFrom={emailFrom}
              emailInvalid={emailInvalid}
              subject={subject}
              subjectInvalid={subjectInvalid}
              editorState={editorState}
              bodyInvalid={bodyInvalid}
              setEmailFrom={setEmailFrom}
              setEmailInvalid={setEmailInvalid}
              setSubject={setSubject}
              setBodyInvalid={setBodyInvalid}
              setSubjectInvalid={setSubjectInvalid}
              setEditorState={setEditorState}
            />
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ marginTop: 2, padding: 2 }}>
              <FilterComponent
                grades={grades}
                users={users}
                gradesInvalid={gradesInvalid}
                usersInvalid={usersInvalid}
                setUsers={setUsers}
                setGrades={setGrades}
                setGradesInvalid={setGradesInvalid}
                setUsersInvalid={setUsersInvalid}
              />
            </Card>
          </Grid>
        </Grid>
        {showPublishModal && (
          <PublishModal
            onClose={() => setShowPublishModal(false)}
            onPublish={() => handlePublish()}
            setCronJobTime={setCronJobTime}
            onSchedule={() => handleSetSchedule()}
            scheduledTime={announcement?.scheduleTime}
          />
        )}
      </Box>
    </Card>
  )
}

export default NewAnnouncement
