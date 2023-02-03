import React, { useEffect, useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Card, Grid } from '@mui/material'
import { ContentState, EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import { useHistory } from 'react-router-dom'
import { PageBlock } from '@mth/components/PageBlock'
import { MthRoute } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { Announcement } from '../../../Dashboard/Announcements/types'
import { PublishModal } from '../PublishModal'
import { CreateAnnouncementMutation, UpdateAnnouncementMutation } from '../services'
import { EditComponent } from './EditComponent'
import { FilterComponent } from './FilterComponent'
import { HeaderComponent } from './HeaderComponent'

type NewAnnouncementProps = {
  announcement: Announcement | null
  setAnnouncement: (value: Announcement | null) => void
}

const NewAnnouncement: React.FC<NewAnnouncementProps> = ({ announcement, setAnnouncement }) => {
  const history = useHistory()
  const { me } = useContext(UserContext)
  const [emailFrom, setEmailFrom] = useState<string>('')
  const [announcementId, setAnnouncementId] = useState<number>(0)
  const [isArchived, setIsArchived] = useState<boolean>(false)
  const [subject, setSubject] = useState<string>('')
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false)
  const [cronJobTime, setCronJobTime] = useState<Date | null | ''>(announcement?.scheduleTime || new Date())

  const [grades, setGrades] = useState<string[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [programYears, setProgramYears] = useState<string[]>([])
  const [schoolPartners, setSchoolPartners] = useState<string[]>([])
  const [others, setOthers] = useState<string[]>([])
  const [providers, setProviders] = useState<string[]>([])
  const defaultEmail = ''
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(defaultEmail)),
  )
  const [emailInvalid, setEmailInvalid] = useState<boolean>(false)
  const [subjectInvalid, setSubjectInvalid] = useState<boolean>(false)
  const [bodyInvalid, setBodyInvalid] = useState<boolean>(false)
  const [gradesInvalid, setGradesInvalid] = useState<boolean>(false)
  const [usersInvalid, setUsersInvalid] = useState<boolean>(false)
  const [programYearsInvalid, setProgramYearsInvalid] = useState<boolean>(false)
  const [schoolPartnersInvalid, setSchoolPartnersInvalid] = useState<boolean>(false)

  const [submitCreate, {}] = useMutation(CreateAnnouncementMutation)
  const [submitSave, {}] = useMutation(UpdateAnnouncementMutation)

  const handlePublish = () => {
    setShowPublishModal(false)
    handleSaveClick('Published').then(() => {})
  }

  const handleSetSchedule = () => {
    handleSaveClick('Scheduled').then(() => {})
  }

  const handleRepublish = () => {
    handleSaveClick('Published').then(() => {})
  }

  const handleBackClick = () => {
    if (announcement) setAnnouncement(null)
    history.push(`${MthRoute.ANNOUNCEMENTS}`)
  }

  const validation = (): boolean => {
    const isInvalid = () => {
      if (grades?.length == 0) setGradesInvalid(true)
      if (users?.length == 0) setUsersInvalid(true)
      if (programYears?.length == 0) setProgramYearsInvalid(true)
      if (schoolPartners?.length == 0) setSchoolPartnersInvalid(true)
      if (!emailFrom || !isEmail(emailFrom)) setEmailInvalid(true)
      if (!subject) setSubjectInvalid(true)
      if (draftToHtml(convertToRaw(editorState.getCurrentContent())).length <= 8) setBodyInvalid(true)
      return false
    }

    if (users.length > 0) {
      if (users.includes('1') || users.includes('2')) {
        if (
          grades?.length > 0 &&
          subject &&
          emailFrom &&
          isEmail(emailFrom) &&
          draftToHtml(convertToRaw(editorState.getCurrentContent())).length > 8
        ) {
          return true
        } else {
          isInvalid()
        }
      } else {
        if (
          subject &&
          emailFrom &&
          isEmail(emailFrom) &&
          draftToHtml(convertToRaw(editorState.getCurrentContent())).length > 8
        ) {
          return true
        } else {
          isInvalid()
        }
      }
    } else {
      isInvalid()
    }
    return false
  }

  const setFlagDefault = () => {
    setGradesInvalid(false)
    setUsersInvalid(false)
    setEmailInvalid(false)
    setSubjectInvalid(false)
    setBodyInvalid(false)
  }

  const handleSaveClick = async (status = 'Draft') => {
    if (validation() && announcementId > 0) {
      const submitSaveResponse = await submitSave({
        variables: {
          updateAnnouncementInput: {
            announcement_id: Number(announcementId),
            filter_grades: JSON.stringify(grades),
            filter_users: JSON.stringify(users),
            filter_program_years: JSON.stringify(programYears),
            filter_school_partners: JSON.stringify(schoolPartners),
            filter_others: JSON.stringify(others),
            filter_providers: JSON.stringify(providers),
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
          createAnnouncementInput: {
            filter_grades: JSON.stringify(grades),
            filter_users: JSON.stringify(users),
            filter_program_years: JSON.stringify(programYears),
            filter_school_partners: JSON.stringify(schoolPartners),
            filter_others: JSON.stringify(others),
            filter_providers: JSON.stringify(providers),
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
      setProgramYears(announcement?.filterProgramYears ? JSON.parse(announcement?.filterProgramYears) : [])
      setSchoolPartners(announcement?.filterSchoolPartners ? JSON.parse(announcement?.filterSchoolPartners) : [])
      setOthers(announcement?.filterOthers ? JSON.parse(announcement?.filterOthers) : [])
      setProviders(announcement?.filterProviders ? JSON.parse(announcement?.filterProviders) : [])
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
    <PageBlock>
      <HeaderComponent
        announcement={announcement}
        setAnnouncement={setAnnouncement}
        handleSaveClick={handleSaveClick}
        handlePublishClick={handlePublishClick}
        handleRepublish={handleRepublish}
      />
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid item xs={6} sx={{ textAlign: 'left', marginBottom: 'auto' }}>
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
                programYears={programYears}
                schoolPartners={schoolPartners}
                grades={grades}
                users={users}
                gradesInvalid={gradesInvalid}
                usersInvalid={usersInvalid}
                schoolPartnersInvalid={schoolPartnersInvalid}
                programYearsInvalid={programYearsInvalid}
                others={others}
                providers={providers}
                setProviders={setProviders}
                setOthers={setOthers}
                setUsers={setUsers}
                setGrades={setGrades}
                setSchoolPartners={setSchoolPartners}
                setProgramYears={setProgramYears}
                setGradesInvalid={setGradesInvalid}
                setSchoolPartnersInvalid={setSchoolPartnersInvalid}
                setProgramYearsInvalid={setProgramYearsInvalid}
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
            onRepublish={() => handleRepublish()}
          />
        )}
      </Box>
    </PageBlock>
  )
}

export default NewAnnouncement
