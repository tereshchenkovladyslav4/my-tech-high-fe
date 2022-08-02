import React, { useEffect, useState } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { Avatar, Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { checkEnrollPacketStatus } from '../../../../../utils/utils'
import { Person } from '../../../../HomeroomStudentProfile/Student/types'
import { useStyles } from './styles'
import { CircleData, StudentGradeTemplateType } from './types'
import {} from '../../../../Admin/Announcements/services'

export const StudentGrade: StudentGradeTemplateType = ({ student, schoolYears }) => {
  const red = '#D23C33'
  const blue = '#2B9EB7'
  const classes = useStyles
  const [circleData, setCircleData] = useState<CircleData>()

  const history = useHistory()
  const redirect = () => {
    history.push('/homeroom/enrollment/' + student.student_id)
  }

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const progress = () => {
    const { applications, packets } = student
    const currApplication = applications.at(0)
    const currPacket = packets.at(0)
    if (currApplication && currApplication?.status === 'Submitted') {
      setCircleData({
        progress: 25,
        color: blue,
        message: 'Application Pending Approval',
        icon: <ScheduleIcon sx={{ color: blue, marginTop: 2, cursor: 'pointer' }} />,
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
          icon: <ErrorOutlineIcon sx={{ color: red, marginTop: 2, cursor: 'pointer' }} />,
        })
      } else {
        setCircleData({
          progress: 50,
          color: red,
          message: 'Please Resubmit Enrollment Packet',
          icon: <ErrorOutlineIcon sx={{ color: red, marginTop: 2, cursor: 'pointer' }} />,
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
        icon: <ErrorOutlineIcon sx={{ color: red, marginTop: 2, cursor: 'pointer' }} />,
      })
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Submitted'
    ) {
      setCircleData({
        progress: 50,
        color: blue,
        message: 'Enrollment Packet Pending Approval',
        icon: <ScheduleIcon sx={{ color: blue, marginTop: 2, cursor: 'pointer' }} />,
      })
    }
  }
  useEffect(() => {
    progress()
  }, [])
  return (
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
  )
}
