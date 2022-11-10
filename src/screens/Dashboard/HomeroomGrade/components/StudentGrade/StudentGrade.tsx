import React, { useEffect, useState } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { Avatar, Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { ApplicantStatus, MthColor, MthRoute, PacketStatus } from '@mth/enums'
import { SchoolYearType } from '@mth/models'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { checkEnrollPacketStatus } from '../../../../../utils/utils'
import { Person } from '../../../../HomeroomStudentProfile/Student/types'
import { useStyles } from './styles'
import { CircleData, StudentGradeTemplateType } from './types'

export const StudentGrade: StudentGradeTemplateType = ({ student, schoolYears, notification }) => {
  const red = '#D23C33'
  const blue = '#2B9EB7'
  const classes = useStyles
  const [circleData, setCircleData] = useState<CircleData>()
  const history = useHistory()
  const redirect = () => {
    const { applications, packets } = student
    const currApplication = applications?.at(0)
    const currPacket = packets?.at(0)
    if (notification.at(0)?.phrase === 'Submit Schedule') {
      const scheduleBuilderLink = `${MthRoute.HOMEROOM + MthRoute.SUBMIT_SCHEDULE}/${student.student_id}`
      history.push(scheduleBuilderLink)
      return
    }
    if (currApplication?.status !== ApplicantStatus.ACCEPTED && currPacket?.status !== PacketStatus.ACCEPTED) {
      history.push('/homeroom/enrollment/' + student.student_id)
    }
  }

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const progress = () => {
    const { applications, packets } = student
    const currApplication = applications?.at(0)
    const currPacket = packets?.at(0)

    const studentSchoolYear = schoolYears
      ?.filter((item) => item.school_year_id == student?.current_school_year_status?.school_year_id)
      .at(-1) as SchoolYearType

    if (currApplication && currApplication?.status === 'Submitted') {
      setCircleData({
        progress: 25,
        color: blue,
        message: 'Application Pending Approval',
        icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      packets &&
      (currPacket?.status === 'Not Started' || currPacket?.status === 'Missing Info')
    ) {
      if (currPacket?.status === 'Not Started') {
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
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Started'
    ) {
      setCircleData({
        progress: 50,
        color: red,
        message: 'Please Submit Enrollment Packet',
        icon: <ErrorOutlineIcon sx={{ color: red, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      (currPacket?.status === 'Submitted' || currPacket?.status === PacketStatus.RESUBMITTED)
    ) {
      setCircleData({
        progress: 50,
        color: blue,
        message: 'Enrollment Packet Pending Approval',
        icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
      })
    } else if (
      studentSchoolYear?.schedule === true &&
      notification.at(0)?.phrase !== 'Submit Schedule' &&
      currPacket?.status === PacketStatus.ACCEPTED &&
      currApplication?.status === ApplicantStatus.ACCEPTED
    ) {
      setCircleData({
        color: blue,
        progress: 75,
        message: 'Waiting for Schedule Builder to Open',
        icon: <ScheduleIcon sx={{ color: blue, cursor: 'pointer' }} />,
      })
    } else if (notification.at(0)?.phrase === 'Submit Schedule') {
      setCircleData({
        color: MthColor.MTHORANGE,
        progress: 75,
        message: 'Please Submit a Schedule',
        icon: <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, cursor: 'pointer' }} />,
      })
    } else if (notification?.phrase === 'Submit Schedule') {
      setCircleData({
        mobileColor: MthColor.MTHORANGE,
        mobileText: notification?.phrase,
        color: MthColor.MTHORANGE,
        progress: 50,
        type: notification?.phrase,
        icon: <ScheduleIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} />,
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
