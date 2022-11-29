import React, { useEffect, useState } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { Avatar, Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { ApplicantStatus, MthColor, MthRoute, PacketStatus, ScheduleStatus, StudentNotification } from '@mth/enums'
import { SchoolYearType } from '@mth/models'
import { checkEnrollPacketStatus } from '../../../../../utils/utils'
import { Person } from '../../../../HomeroomStudentProfile/Student/types'
import { useStyles } from './styles'
import { CircleData, StudentGradeProps } from './types'

export const StudentGrade: React.FC<StudentGradeProps> = ({ student, schoolYears, notification }) => {
  const red = '#D23C33'
  const blue = '#2B9EB7'
  const classes = useStyles
  const [circleData, setCircleData] = useState<CircleData>()
  const history = useHistory()
  const redirect = () => {
    const { applications, packets } = student
    const currApplication = applications?.at(0)
    const currPacket = packets?.at(0)
    if (notification.at(0)?.phrase === StudentNotification.SUBMIT_SCHEDULE) {
      const scheduleBuilderLink = `${MthRoute.HOMEROOM + MthRoute.SUBMIT_SCHEDULE}/${student.student_id}`
      history.push(scheduleBuilderLink)
      return
    }
    if (currApplication?.status !== ApplicantStatus.ACCEPTED && currPacket?.status !== PacketStatus.ACCEPTED) {
      history.push(`${MthRoute.HOMEROOM + MthRoute.ENROLLMENT}/` + student.student_id)
    }
  }

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

    if (currApplication && currApplication?.status === ApplicantStatus.SUBMITTED) {
      setCircleData({
        progress: 25,
        color: blue,
        message: 'Application Pending Approval',
        icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      packets &&
      (currPacket?.status === PacketStatus.NOT_STARTED || currPacket?.status === PacketStatus.MISSING_INFO)
    ) {
      if (currPacket?.status === PacketStatus.NOT_STARTED) {
        setCircleData({
          progress: 50,
          color: red,
          message: 'Please Submit an Enrollment Packet',
          icon: <ErrorOutlineIcon sx={{ color: red, cursor: 'pointer' }} />,
        })
      } else {
        setCircleData({
          progress: 50,
          color: red,
          message: 'Please Resubmit Enrollment Packet',
          icon: <ErrorOutlineIcon sx={{ color: red, cursor: 'pointer' }} />,
        })
      }
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.STARTED
    ) {
      setCircleData({
        progress: 50,
        color: red,
        message: 'Please Submit Enrollment Packet',
        icon: <ErrorOutlineIcon sx={{ color: red, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket &&
      (currPacket?.status === PacketStatus.SUBMITTED || currPacket?.status === PacketStatus.RESUBMITTED)
    ) {
      setCircleData({
        progress: 50,
        color: blue,
        message: 'Enrollment Packet Pending Approval',
        icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
      })
    } else if (
      studentSchoolYear?.schedule === true &&
      notification.at(0)?.phrase !== StudentNotification.SUBMIT_SCHEDULE &&
      notification.at(0)?.phrase !== StudentNotification.RESUBMIT_SCHEDULE &&
      notification.at(0)?.phrase !== StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE &&
      notification.at(0)?.phrase !== StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE &&
      currPacket?.status === PacketStatus.ACCEPTED &&
      currApplication?.status === ApplicantStatus.ACCEPTED
    ) {
      if (
        currentSecondSemesterSchedule?.status === ScheduleStatus.SUBMITTED ||
        currentSecondSemesterSchedule?.status === ScheduleStatus.RESUBMITTED
      ) {
        setCircleData({
          color: blue,
          progress: 75,
          message: '2nd Semester Schedule Pending Approval',
          icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
        })
      } else if (currentSchedule?.status === ScheduleStatus.ACCEPTED) {
        setCircleData({
          color: blue,
          progress: 100,
          message: 'Homeroom Assignment in Progress',
          icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
        })
      } else if (
        currentSchedule?.status === ScheduleStatus.SUBMITTED ||
        currentSchedule?.status === ScheduleStatus.RESUBMITTED
      ) {
        setCircleData({
          color: blue,
          progress: 75,
          message: 'Schedule Pending Approval',
          icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
        })
      } else {
        setCircleData({
          color: blue,
          progress: 75,
          message: 'Waiting for Schedule Builder to Open',
          icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
        })
      }
    } else if (notification.at(0)?.phrase === StudentNotification.SUBMIT_SCHEDULE) {
      setCircleData({
        color: MthColor.MTHORANGE,
        progress: 75,
        message: 'Please Submit a Schedule',
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, cursor: 'pointer' }} />,
      })
    } else if (notification.at(0)?.phrase === StudentNotification.RESUBMIT_SCHEDULE) {
      setCircleData({
        color: MthColor.MTHORANGE,
        progress: 75,
        message: 'Please resubmit a Schedule',
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, cursor: 'pointer' }} />,
      })
    } else if (notification.at(0)?.phrase === StudentNotification.SUBMIT_SECOND_SEMESTER_SCHEDULE) {
      setCircleData({
        color: MthColor.MTHORANGE,
        progress: 75,
        message: 'Submit 2nd Semester Schedule',
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, cursor: 'pointer' }} />,
      })
    } else if (notification.at(0)?.phrase === StudentNotification.RESUBMIT_SECOND_SEMESTER_SCHEDULE) {
      setCircleData({
        color: MthColor.MTHORANGE,
        progress: 75,
        message: 'Resubmit 2nd Semester Schedule',
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, cursor: 'pointer' }} />,
      })
    }
  }
  useEffect(() => {
    progress()
  }, [notification])

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
                <IconButton
                  onClick={() => {
                    if (checkEnrollPacketStatus(schoolYears, student)) {
                      redirect()
                    }
                  }}
                >
                  {circleData?.icon}
                </IconButton>
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
