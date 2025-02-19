import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Avatar, Box, Button, Card } from '@mui/material'
import { useHistory, useLocation } from 'react-router-dom'
import { EditYearModal } from '@mth/components/EmailModal/EditYearModal'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import {
  ApplicationStatus,
  MthColor,
  MthRoute,
  PacketStatus,
  StudentStatus,
  RelationStatus,
  StudentNotification,
  ScheduleStatus,
} from '@mth/enums'
import { SchoolYearType } from '@mth/models'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { CircleData } from '@mth/screens/Dashboard/HomeroomGrade/components/StudentGrade/types'
import { Person, StudentProps } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { checkEnrollPacketStatus, currentGradeText } from '@mth/utils'
import { updateApplicationMutation, UpdateStudentMutation } from './service'

export const StudentCard: React.FC<StudentProps> = ({
  student,
  schoolYears,
  showNotification,
  withdrawn,
  schoolYearsDropdown = [],
}) => {
  const { me, setMe } = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  const [circleData, setCircleData] = useState<CircleData>()
  const [link, setLink] = useState<string>('')
  const [showToolTip, setShowToolTip] = useState(true)
  const [showComingBack, setShowComingBack] = useState(false)
  const [editYearModal, setEditYearModal] = useState(false)
  const [updateApplication] = useMutation(updateApplicationMutation)
  const [updateStudent] = useMutation(UpdateStudentMutation)

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }
  const handleWithdrawnStudent = useCallback(() => {
    if (schoolYearsDropdown?.length == 0) setShowComingBack(true)
    else setEditYearModal(true)
  }, [schoolYearsDropdown?.length])
  useEffect(() => {
    const { applications, packets, status, StudentSchedules } = student
    const currApplication = applications?.at(-1)
    const currPacket = packets?.at(-1)
    const studentStatus = status?.at(-1)?.status

    const currentSchedule = StudentSchedules?.filter(
      (schedule) =>
        Number(schedule.StudentId) === Number(student?.student_id) &&
        schedule.SchoolYearId === Number(student?.current_school_year_status?.school_year_id) &&
        !schedule.is_second_semester,
    )?.at(-1)

    const currentSecondSemesterSchedule = StudentSchedules?.filter(
      (schedule) =>
        Number(schedule.StudentId) === Number(student?.student_id) &&
        schedule.SchoolYearId === Number(student?.current_school_year_status?.school_year_id) &&
        schedule.is_second_semester,
    )?.at(-1)

    const enrollmentLink = `${MthRoute.HOMEROOM + MthRoute.ENROLLMENT}/${student.student_id}`
    const homeroomLink = `${MthRoute.HOMEROOM}/${student.student_id}`
    const scheduleLink = `${MthRoute.HOMEROOM + MthRoute.SUBMIT_SCHEDULE}/${student.student_id}`
    const scheduleBuilderLink = `${MthRoute.HOMEROOM + MthRoute.SUBMIT_SCHEDULE}/${student.student_id}?backTo=${
      location.pathname
    }`
    const studentSchoolYear = schoolYears
      ?.filter((item) => String(item.school_year_id) === String(student?.current_school_year_status?.school_year_id))
      .at(-1) as SchoolYearType
    if (studentStatus === StudentStatus.WITHDRAWN || studentStatus === StudentStatus.DELETED) {
      setCircleData({
        mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
        mobileText: 'Re-apply',
        color: MthColor.MTHORANGE,
        progress: 0,
        type: 'Re-apply',
        icon: (
          <ErrorOutlineIcon
            sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }}
            onClick={handleWithdrawnStudent}
          />
        ),
      })
      setShowToolTip(true)
    } else if (currApplication && currApplication?.status === ApplicationStatus.SUBMITTED) {
      setLink(MthRoute.HOMEROOM)
      setCircleData({
        mobileColor: MthColor.MTHGREEN,
        mobileText: StudentNotification.APPLICATION_PENDING_APPROVAL,
        color: MthColor.MTHGREEN,
        progress: 25,
        type: StudentNotification.APPLICATION_PENDING_APPROVAL,
        icon: (
          <ScheduleIcon
            sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }}
            onClick={() => {
              if (checkEnrollPacketStatus(schoolYears, student)) {
                setMe({ ...me, currentTab: 0 } as UserInfo)
                if (link) history.push(link)
              }
            }}
          />
        ),
      })
      setShowToolTip(true)
    } else if (
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      packets &&
      (currPacket?.status === PacketStatus.NOT_STARTED || currPacket?.status === PacketStatus.MISSING_INFO)
    ) {
      setLink(enrollmentLink)
      if (currPacket?.status === PacketStatus.NOT_STARTED) {
        setCircleData({
          mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
          mobileText: 'Submit Now',
          progress: 50,
          color: MthColor.MTHORANGE,
          type: StudentNotification.PLEASE_SUBMIT_ENROLLMENT_PACKET,
          icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} />,
        })
      } else {
        setCircleData({
          mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
          mobileText: 'Resubmit Now',
          progress: 50,
          color: MthColor.MTHORANGE,
          type: StudentNotification.PLEASE_RESUBMIT_ENROLLMENT_PACKET,
          icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} />,
        })
      }
      setShowToolTip(true)
    } else if (
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.STARTED
    ) {
      setLink(enrollmentLink)
      setCircleData({
        mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
        mobileText: 'Submit Now',
        progress: 50,
        color: MthColor.MTHORANGE,
        type: StudentNotification.PLEASE_SUBMIT_ENROLLMENT_PACKET,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} />,
      })
      setShowToolTip(true)
    } else if (
      !showNotification &&
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      ((currPacket && currPacket?.status === PacketStatus.SUBMITTED) ||
        currPacket?.status === PacketStatus.MISSING_INFO ||
        currPacket?.status === PacketStatus.RESUBMITTED)
    ) {
      setLink(homeroomLink)
      setCircleData({
        mobileColor: MthColor.MTHGREEN,
        mobileText: StudentNotification.ENROLLMENT_PENDING_APPROVAL,
        color: MthColor.MTHGREEN,
        progress: 50,
        type: StudentNotification.ENROLLMENT_PACKET_PENDING_APPROVAL,
        icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
      })
      setShowToolTip(true)
    } else if (
      studentSchoolYear?.schedule === true &&
      !showNotification &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      currPacket?.status === PacketStatus.ACCEPTED
    ) {
      setLink(homeroomLink)
      if (
        currentSecondSemesterSchedule?.status === ScheduleStatus.SUBMITTED ||
        currentSecondSemesterSchedule?.status === ScheduleStatus.RESUBMITTED
      ) {
        setCircleData({
          mobileColor: MthColor.MTHGREEN,
          mobileText: StudentNotification.SECOND_SEMESTER_SCHEDULE_PENDING_APPROVAL,
          color: MthColor.MTHGREEN,
          progress: 75,
          type: StudentNotification.SECOND_SEMESTER_SCHEDULE_PENDING_APPROVAL,
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
        })
      } else if (currentSchedule?.status === ScheduleStatus.ACCEPTED) {
        setCircleData({
          mobileColor: MthColor.MTHGREEN,
          mobileText: StudentNotification.HOMEROOM_ASSIGNMENT_IN_PROGRESS,
          color: MthColor.MTHGREEN,
          progress: 75,
          type: StudentNotification.HOMEROOM_ASSIGNMENT_IN_PROGRESS,
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
        })
      } else if (
        currentSchedule?.status === ScheduleStatus.SUBMITTED ||
        currentSchedule?.status === ScheduleStatus.RESUBMITTED
      ) {
        setCircleData({
          mobileColor: MthColor.MTHGREEN,
          mobileText: StudentNotification.SCHEDULE_PENDING_APPROVAL,
          color: MthColor.MTHGREEN,
          progress: 75,
          type: StudentNotification.SCHEDULE_PENDING_APPROVAL,
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
        })
      } else {
        setCircleData({
          mobileColor: MthColor.MTHGREEN,
          mobileText: StudentNotification.WAITING_FOR_SCHEDULE_BUILDER_TO_OPEN,
          color: MthColor.MTHGREEN,
          progress: 75,
          type: StudentNotification.WAITING_FOR_SCHEDULE_BUILDER_TO_OPEN,
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
        })
      }
      setShowToolTip(true)
    } else if (
      studentSchoolYear?.schedule &&
      (showNotification?.phrase === StudentNotification.SUBMIT_SCHEDULE ||
        showNotification?.phrase === StudentNotification.RESUBMIT_SCHEDULE ||
        showNotification?.phrase === StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE ||
        showNotification?.phrase === StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE)
    ) {
      setLink(
        showNotification?.phrase === StudentNotification.SUBMIT_SCHEDULE ||
          showNotification?.phrase === StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE
          ? scheduleLink
          : scheduleBuilderLink,
      )
      setCircleData({
        mobileColor: MthColor.MTHORANGE,
        mobileText: showNotification.phrase,
        color: MthColor.MTHORANGE,
        progress: 50,
        type: showNotification.phrase,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} />,
      })
      setShowToolTip(true)
    } else {
      setLink(homeroomLink)
      setShowToolTip(false)
    }
  }, [student, showNotification, location.pathname, schoolYears, handleWithdrawnStudent, setMe, me, link, history])

  const submitEditYear = async (form: { schoolYear: string }) => {
    const { schoolYear } = form
    const { applications } = student
    const currApplication = applications?.at(-1)

    await updateApplication({
      variables: {
        updateApplicationInput: {
          application_id: Number(currApplication?.application_id),
          status: ApplicationStatus.SUBMITTED,
          relation_status: RelationStatus.RETURNING,
          school_year_id: parseInt(String(schoolYear)?.split('-')[0]),
          midyear_application: String(schoolYear)?.split('-')[1] === 'mid',
        },
      },
    })

    await updateStudent({
      variables: {
        updateStudentInput: {
          student_id: Number(student?.student_id),
          status: StudentStatus.REAPPLIED,
          school_year_id: parseInt(String(schoolYear)?.split('-')[0]),
        },
      },
    })

    setEditYearModal(false)
    window.location.reload()
  }

  return (
    <>
      <Box sx={{ marginX: 2, display: { xs: 'none', sm: 'inline-block' } }}>
        <Metadata
          title={
            <Title>
              {student.person.preferred_first_name ? student.person.preferred_first_name : student.person.first_name}
            </Title>
          }
          subtitle={
            <Box>
              <Subtitle size={'large'}>{currentGradeText(student)}</Subtitle>
              {showToolTip && (checkEnrollPacketStatus(schoolYears, student) || showNotification) && (
                <Box
                  onClick={() => {
                    if (checkEnrollPacketStatus(schoolYears, student)) {
                      setMe({ ...me, currentTab: 0 } as UserInfo)
                      if (link) history.push(link)
                    }
                  }}
                >
                  {circleData?.icon}
                  <Paragraph size='medium' color={circleData?.color}>
                    {circleData?.type}
                  </Paragraph>
                </Box>
              )}
            </Box>
          }
          image={
            <Avatar
              sx={{
                height: 150,
                width: 150,
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: '4.0rem',
              }}
              alt={
                student.person.preferred_first_name ? student.person.preferred_first_name : student.person.first_name
              }
              variant='rounded'
              src={getProfilePhoto(student.person)}
              onClick={() => {
                if (checkEnrollPacketStatus(schoolYears, student)) {
                  setMe({ ...me, currentTab: 0 } as UserInfo)
                  if (link) history.push(link)
                  else {
                    if (circleData?.type == 'Re-apply') handleWithdrawnStudent()
                  }
                }
              }}
            />
          }
          rounded
          verticle
        />
      </Box>
      <Card
        elevation={2}
        sx={{ display: { xs: 'flex', sm: 'none' }, borderRadius: 2, paddingX: 2, marginY: 1, flexDirection: 'column' }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Box sx={{ opacity: withdrawn ? 0.35 : 1 }}>
            <Metadata
              title={
                <Subtitle>
                  {student.person.preferred_first_name
                    ? student.person.preferred_first_name
                    : student.person.first_name}
                </Subtitle>
              }
              subtitle={
                <Box>
                  <Paragraph size={'medium'} color={MthColor.SYSTEM_06}>
                    {currentGradeText(student)}
                  </Paragraph>
                </Box>
              }
              image={
                <Avatar
                  sx={{ marginRight: 2 }}
                  alt={student.person.first_name}
                  src={'/'}
                  onClick={() => {
                    if (checkEnrollPacketStatus(schoolYears, student)) {
                      setMe({ ...me, currentTab: 0 } as UserInfo)
                      if (link) history.push(link)
                    }
                  }}
                />
              }
            />
          </Box>
          {showNotification && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  background: 'rgba(236, 89, 37, 0.1)',
                  alignItems: 'center',
                  marginTop: 2,
                  padding: 1,
                  borderRadius: 1,
                }}
              >
                <WarningAmberIcon sx={{ height: 18, color: '#EC5925', fontWeight: 600 }} />
                <Paragraph color='#EC5925' fontWeight='600'>
                  Notification
                </Paragraph>
              </Box>
            </Box>
          )}
        </Box>
        {showToolTip && checkEnrollPacketStatus(schoolYears, student) && (
          <>
            {circleData?.type !== 'Re-apply' ? (
              <Box sx={{ alignItems: 'center', marginBottom: 2 }}>
                {circleData?.icon}
                <Paragraph size='medium' color={circleData?.color}>
                  {circleData?.type}
                </Paragraph>
              </Box>
            ) : (
              <Button
                variant='contained'
                fullWidth
                sx={{ background: MthColor.RED_GRADIENT, color: MthColor.WHITE, marginBottom: 2 }}
                onClick={handleWithdrawnStudent}
              >
                Re-apply
              </Button>
            )}
          </>
        )}
        {!showToolTip && (
          <Button
            variant='contained'
            sx={{ background: MthColor.BUTTON_LINEAR_GRADIENT, color: MthColor.WHITE, marginBottom: 2 }}
            onClick={() => {
              if (checkEnrollPacketStatus(schoolYears, student)) {
                setMe({ ...me, currentTab: 0 } as UserInfo)
                if (link) history.push(link)
              }
            }}
          >
            Select
          </Button>
        )}
      </Card>
      {showComingBack && (
        <WarningModal
          title='Check Back Soon!'
          subtitle='We will be taking applications soon. Please re-apply then.'
          handleSubmit={() => setShowComingBack(false)}
          handleModem={() => setShowComingBack(false)}
          btntitle='Ok'
          showIcon={false}
        />
      )}
      {editYearModal && (
        <EditYearModal
          title={`Select the Program Year ${student.person.first_name} is applying for:`}
          schoolYears={schoolYearsDropdown}
          handleSubmit={submitEditYear}
          handleClose={() => setEditYearModal(false)}
        />
      )}
    </>
  )
}
