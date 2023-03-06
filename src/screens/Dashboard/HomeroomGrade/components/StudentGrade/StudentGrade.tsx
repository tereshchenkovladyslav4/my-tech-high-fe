import React, { useCallback, useEffect, useState } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { Avatar, Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useFlag } from '@unleash/proxy-client-react'
import { useHistory, useLocation } from 'react-router-dom'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { BUGFIX_1532 } from '@mth/constants'
import { ApplicationStatus, MthColor, MthRoute, PacketStatus, ScheduleStatus, StudentNotification } from '@mth/enums'
import { SchoolYearType } from '@mth/models'
import { checkEnrollPacketStatus } from '@mth/utils'
import { Person } from '../../../../HomeroomStudentProfile/Student/types'
import { useStyles } from './styles'
import { CircleData, StudentGradeProps } from './types'

export const StudentGrade: React.FC<StudentGradeProps> = ({ student, schoolYears, notifications }) => {
  const classes = useStyles
  const [circleData, setCircleData] = useState<CircleData>()
  const history = useHistory()
  const location = useLocation()

  // MARK: - Unleash Feature Flags
  const infoctr1536 = useFlag(BUGFIX_1532)

  const redirect = useCallback(() => {
    if (checkEnrollPacketStatus(schoolYears, student)) {
      const { applications, packets } = student
      const currApplication = applications?.at(0)
      const currPacket = packets?.at(0)
      if (
        notifications.at(0)?.phrase === StudentNotification.SUBMIT_SCHEDULE ||
        notifications.at(0)?.phrase === StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE
      ) {
        history.push(`${MthRoute.HOMEROOM + MthRoute.SUBMIT_SCHEDULE}/${student.student_id}`)
        return
      }
      if (
        notifications.at(0)?.phrase === StudentNotification.RESUBMIT_SCHEDULE ||
        notifications.at(0)?.phrase === StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE
      ) {
        history.push(
          `${MthRoute.HOMEROOM + MthRoute.SUBMIT_SCHEDULE}/${student.student_id}?backTo=${location.pathname}`,
        )
        return
      }
      if (infoctr1536) {
        if (currApplication?.status === ApplicationStatus.SUBMITTED) {
          return
        }
      }
      if (currApplication?.status === ApplicationStatus.ACCEPTED && currPacket?.status !== PacketStatus.ACCEPTED) {
        history.push(`${MthRoute.HOMEROOM + MthRoute.ENROLLMENT}/` + student.student_id)
      }
    }
  }, [history, infoctr1536, location.pathname, notifications, schoolYears, student])

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const progress = () => {
    const { applications, packets, StudentSchedules } = student
    const currApplication = applications?.at(0)
    const currPacket = packets?.at(0)
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

    const studentSchoolYear = schoolYears
      ?.filter((item) => item.school_year_id == student?.current_school_year_status?.school_year_id)
      .at(-1) as SchoolYearType

    if (currApplication && currApplication?.status === ApplicationStatus.SUBMITTED) {
      setCircleData({
        progress: 25,
        color: MthColor.MTHGREEN,
        message: StudentNotification.APPLICATION_PENDING_APPROVAL,
        icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      packets &&
      (currPacket?.status === PacketStatus.NOT_STARTED || currPacket?.status === PacketStatus.MISSING_INFO)
    ) {
      if (currPacket?.status === PacketStatus.NOT_STARTED) {
        setCircleData({
          progress: 50,
          color: MthColor.RED,
          message: StudentNotification.PLEASE_SUBMIT_ENROLLMENT_PACKET,
          icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
        })
      } else {
        setCircleData({
          progress: 50,
          color: MthColor.RED,
          message: StudentNotification.PLEASE_RESUBMIT_ENROLLMENT_PACKET,
          icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
        })
      }
    } else if (
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.STARTED
    ) {
      setCircleData({
        progress: 50,
        color: MthColor.RED,
        message: StudentNotification.PLEASE_SUBMIT_ENROLLMENT_PACKET,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === ApplicationStatus.ACCEPTED &&
      currPacket &&
      (currPacket?.status === PacketStatus.SUBMITTED || currPacket?.status === PacketStatus.RESUBMITTED)
    ) {
      setCircleData({
        progress: 50,
        color: MthColor.MTHGREEN,
        message: StudentNotification.ENROLLMENT_PACKET_PENDING_APPROVAL,
        icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, cursor: 'pointer' }} />,
      })
    } else if (
      studentSchoolYear?.schedule === true &&
      notifications.at(0)?.phrase !== StudentNotification.SUBMIT_SCHEDULE &&
      notifications.at(0)?.phrase !== StudentNotification.RESUBMIT_SCHEDULE &&
      notifications.at(0)?.phrase !== StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE &&
      notifications.at(0)?.phrase !== StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE &&
      currPacket?.status === PacketStatus.ACCEPTED &&
      currApplication?.status === ApplicationStatus.ACCEPTED
    ) {
      if (
        currentSecondSemesterSchedule?.status === ScheduleStatus.SUBMITTED ||
        currentSecondSemesterSchedule?.status === ScheduleStatus.RESUBMITTED
      ) {
        setCircleData({
          color: MthColor.MTHGREEN,
          progress: 75,
          message: StudentNotification.SECOND_SEMESTER_SCHEDULE_PENDING_APPROVAL,
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, cursor: 'pointer' }} />,
        })
      } else if (currentSchedule?.status === ScheduleStatus.ACCEPTED) {
        setCircleData({
          color: MthColor.MTHGREEN,
          progress: 100,
          message: StudentNotification.HOMEROOM_ASSIGNMENT_IN_PROGRESS,
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, cursor: 'pointer' }} />,
        })
      } else if (
        currentSchedule?.status === ScheduleStatus.SUBMITTED ||
        currentSchedule?.status === ScheduleStatus.RESUBMITTED
      ) {
        setCircleData({
          color: MthColor.MTHGREEN,
          progress: 75,
          message: StudentNotification.SCHEDULE_PENDING_APPROVAL,
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, cursor: 'pointer' }} />,
        })
      } else {
        setCircleData({
          color: MthColor.MTHGREEN,
          progress: 75,
          message: StudentNotification.WAITING_FOR_SCHEDULE_BUILDER_TO_OPEN,
          icon: <ScheduleIcon sx={{ color: MthColor.MTHGREEN, cursor: 'pointer' }} />,
        })
      }
    } else if (notifications.at(0)?.phrase === StudentNotification.SUBMIT_SCHEDULE) {
      setCircleData({
        color: MthColor.RED,
        progress: 75,
        message: StudentNotification.PLEASE_SUBMIT_SCHEDULE,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
      })
    } else if (notifications.at(0)?.phrase === StudentNotification.RESUBMIT_SCHEDULE) {
      setCircleData({
        color: MthColor.RED,
        progress: 75,
        message: StudentNotification.PLEASE_RESUBMIT_SCHEDULE,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
      })
    } else if (notifications.at(0)?.phrase === StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE) {
      setCircleData({
        color: MthColor.RED,
        progress: 75,
        message: StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
      })
    } else if (notifications.at(0)?.phrase === StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE) {
      setCircleData({
        color: MthColor.RED,
        progress: 75,
        message: StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE,
        icon: <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer' }} />,
      })
    }
  }
  useEffect(() => {
    progress()
  }, [notifications])

  return (
    <Box width={'100px'}>
      <Metadata
        title={
          <Subtitle size='medium' fontWeight={'600'}>
            {/*{grade}%*/}
          </Subtitle>
        }
        subtitle={
          <Box>
            <Paragraph fontWeight={'700'} color='black' size='medium'>
              {student.person.preferred_first_name ? student.person.preferred_first_name : student.person.first_name}
            </Paragraph>
            {checkEnrollPacketStatus(schoolYears, student) && (
              <Tooltip title={circleData?.message || ''}>
                <IconButton onClick={redirect}>{circleData?.icon}</IconButton>
              </Tooltip>
            )}
          </Box>
        }
        image={
          <Box sx={classes.progressContainer} position='relative'>
            <CircularProgress
              variant='determinate'
              value={checkEnrollPacketStatus(schoolYears, student) ? circleData?.progress : 0}
              size={60}
              sx={{ color: circleData?.color }}
            />
            <Box sx={classes.avatarContainer} position='absolute'>
              <Avatar alt={student.person.first_name} src={getProfilePhoto(student.person)} sx={classes.avatar} />
            </Box>
          </Box>
        }
        verticle
      />
    </Box>
  )
}
