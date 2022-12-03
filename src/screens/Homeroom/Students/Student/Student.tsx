import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Avatar, Box, Button, Card } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { EditYearModal } from '@mth/components/EmailModal/EditYearModal'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { WarningModal } from '@mth/components/WarningModal/Warning'
import {
  ApplicantStatus,
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
import { checkEnrollPacketStatus, toOrdinalSuffix } from '@mth/utils'
import { updateApplicationMutation, UpdateStudentMutation } from './service'

export const Student: React.FC<StudentProps> = ({
  student,
  schoolYears,
  showNotification,
  withdrawn,
  schoolYearsDropdown,
}) => {
  const { me, setMe } = useContext(UserContext)
  const history = useHistory()

  const [circleData, setCircleData] = useState<CircleData>()
  const [link, setLink] = useState<string>('')
  const [showToolTip, setShowToolTip] = useState(true)
  const [showComingBack, setShowComingBack] = useState(false)
  const [editYearModal, setEditYearModal] = useState(false)

  const [updateApplication] = useMutation(updateApplicationMutation)
  const [updateStudent] = useMutation(UpdateStudentMutation)

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return undefined

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }
  useEffect(() => {
    const { applications, packets, status, StudentSchedules } = student
    const currApplication = applications?.at(-1)
    const currPacket = packets?.at(-1)
    const studentStatus = status?.at(-1)?.status

    const currentSchedule = StudentSchedules?.filter(
      (schedule) =>
        schedule.StudentId === Number(student?.student_id) &&
        schedule.SchoolYearId === Number(student?.current_school_year_status?.school_year_id) &&
        !schedule.is_second_semester,
    )?.at(-1)
    const currentSecondSemesterSchedule = StudentSchedules?.filter(
      (schedule) =>
        schedule.StudentId === Number(student?.student_id) &&
        schedule.SchoolYearId === Number(student?.current_school_year_status?.school_year_id) &&
        schedule.is_second_semester,
    )?.at(-1)

    const enrollmentLink = `${MthRoute.HOMEROOM + MthRoute.ENROLLMENT}/${student.student_id}`
    const homeroomLink = `${MthRoute.HOMEROOM}/${student.student_id}`
    const scheduleBuilderLink = `${MthRoute.HOMEROOM + MthRoute.SUBMIT_SCHEDULE}/${student.student_id}`
    const studentSchoolYear = schoolYears
      ?.filter((item) => item.school_year_id == student?.current_school_year_status?.school_year_id)
      .at(-1) as SchoolYearType
    if (studentStatus === StudentStatus.WITHDRAWN) {
      setCircleData({
        mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
        mobileText: 'Re-apply',
        color: MthColor.MTHORANGE,
        progress: 0,
        type: 'Re-apply',
        icon: (
          <ErrorOutlineIcon
            sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }}
            onClick={handleWithrawanStudent}
          />
        ),
      })
    } else if (currApplication && currApplication?.status === ApplicantStatus.SUBMITTED) {
      setLink(MthRoute.HOMEROOM)
      setCircleData({
        mobileColor: MthColor.MTHGREEN,
        mobileText: 'Application Pending Approval',
        color: MthColor.MTHGREEN,
        progress: 25,
        type: 'Application Pending Approval',
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
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      packets &&
      currPacket?.status === PacketStatus.NOT_STARTED
    ) {
      setLink(enrollmentLink)
      setCircleData({
        mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
        mobileText: 'Submit Now',
        progress: 50,
        color: MthColor.MTHORANGE,
        type: 'Please Submit an Enrollment Packet',
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.STARTED
    ) {
      setLink(enrollmentLink)
      setCircleData({
        mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
        mobileText: 'Submit Now',
        progress: 50,
        color: MthColor.MTHORANGE,
        type: 'Please Submit an Enrollment Packet',
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} />,
      })
    } else if (
      !showNotification &&
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      ((currPacket && currPacket?.status === PacketStatus.SUBMITTED) ||
        currPacket?.status === PacketStatus.MISSING_INFO ||
        currPacket?.status === PacketStatus.RESUBMITTED)
    ) {
      setLink(homeroomLink)
      setCircleData({
        mobileColor: MthColor.MTHGREEN,
        mobileText: 'Enrollment Pending Approval',
        color: MthColor.MTHGREEN,
        progress: 50,
        type: 'Enrollment Packet Pending Approval',
        icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
      })
    } else if (
      studentSchoolYear?.schedule === true &&
      !showNotification &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket?.status === PacketStatus.ACCEPTED
    ) {
      setLink(homeroomLink)
      if (
        currentSecondSemesterSchedule?.status === ScheduleStatus.SUBMITTED ||
        currentSecondSemesterSchedule?.status === ScheduleStatus.RESUBMITTED
      ) {
        setCircleData({
          mobileColor: MthColor.MTHGREEN,
          mobileText: '2nd Semester Schedule Pending Approval',
          color: MthColor.MTHGREEN,
          progress: 75,
          type: '2nd Semester Schedule Pending Approval',
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
        })
      } else if (currentSchedule?.status === ScheduleStatus.ACCEPTED) {
        setCircleData({
          mobileColor: MthColor.MTHGREEN,
          mobileText: 'Homeroom Assignment in Progress',
          color: MthColor.MTHGREEN,
          progress: 75,
          type: 'Homeroom Assignment in Progress',
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
        })
      } else if (
        currentSchedule?.status === ScheduleStatus.SUBMITTED ||
        currentSchedule?.status === ScheduleStatus.RESUBMITTED
      ) {
        setCircleData({
          mobileColor: MthColor.MTHGREEN,
          mobileText: 'Schedule Pending Approval',
          color: MthColor.MTHGREEN,
          progress: 75,
          type: 'Schedule Pending Approval',
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
        })
      } else {
        setCircleData({
          mobileColor: MthColor.MTHGREEN,
          mobileText: 'Waiting for Schedule Builder to Open',
          color: MthColor.MTHGREEN,
          progress: 75,
          type: 'Waiting for Schedule Builder to Open',
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }} />,
        })
      }
    } else if (
      studentSchoolYear.schedule &&
      (showNotification?.phrase === StudentNotification.SUBMIT_SCHEDULE ||
        showNotification?.phrase === StudentNotification.RESUBMIT_SCHEDULE ||
        showNotification?.phrase === StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE ||
        showNotification?.phrase === StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE)
    ) {
      setLink(scheduleBuilderLink)
      setCircleData({
        mobileColor: MthColor.MTHORANGE,
        mobileText: showNotification.phrase,
        color: MthColor.MTHORANGE,
        progress: 50,
        type: showNotification.phrase,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} />,
      })
    } else {
      setLink(homeroomLink)
      setShowToolTip(false)
    }
  }, [student, showNotification])

  const submitEditYear = async (form) => {
    const { schoolYear } = form
    const { applications } = student
    const currApplication = applications?.at(-1)

    await updateApplication({
      variables: {
        updateApplicationInput: {
          application_id: Number(currApplication?.application_id),
          status: ApplicantStatus.SUBMITTED,
          relation_status: RelationStatus.RETURNING,
          school_year_id: parseInt(String(schoolYear)?.split('-')[0]),
          midyear_application: String(schoolYear)?.split('-')[1] === 'mid' ? true : false,
        },
      },
    })

    await updateStudent({
      variables: {
        updateStudentInput: {
          student_id: Number(student?.student_id),
          status: StudentStatus.APPLIED,
          school_year_id: parseInt(String(schoolYear)?.split('-')[0]),
        },
      },
    })

    setEditYearModal(false)
    window.location.reload()
  }

  const handleWithrawanStudent = () => {
    if (schoolYearsDropdown?.length == 0) setShowComingBack(true)
    else setEditYearModal(true)
  }

  const gradeText =
    student?.grade_levels?.at(-1)?.grade_level !== 'Kindergarten'
      ? `${toOrdinalSuffix(student?.grade_levels?.at(-1)?.grade_level as number)} Grade`
      : student?.grade_levels?.at(-1)?.grade_level

  return (
    <>
      <Box sx={{ marginX: 2, display: { xs: 'none', sm: 'inline-block' } }}>
        <Metadata
          title={<Title>{student.person.first_name}</Title>}
          subtitle={
            <Box>
              <Subtitle size={'large'}>{gradeText}</Subtitle>
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
              }}
              alt={student.person.first_name}
              variant='rounded'
              src={getProfilePhoto(student.person)}
              onClick={() => {
                if (checkEnrollPacketStatus(schoolYears, student)) {
                  setMe({ ...me, currentTab: 0 } as UserInfo)
                  if (link) history.push(link)
                  else {
                    if (circleData?.type == 'Re-apply') handleWithrawanStudent()
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
              title={<Subtitle>{student.person.first_name}</Subtitle>}
              subtitle={
                <Box>
                  <Paragraph size={'medium'} color={MthColor.SYSTEM_06}>
                    {gradeText}
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
