import { Avatar, Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { CircleData, StudentGradeTemplateType } from './types'
import { useStyles } from './styles'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { Person } from '../../../../HomeroomStudentProfile/Student/types'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { useQuery } from '@apollo/client'
import { GetCurrentSchoolYearByRegionId } from '../../../../Admin/Announcements/services'

export const StudentGrade: StudentGradeTemplateType = ({ student }) => {
  const { me, setMe } = useContext(UserContext)
  const { region_id } = me?.userRegion?.at(-1)
  const [enrollmentPacketFlag, setEnrollmentPacketFlag] = useState<boolean>(false)
  const schoolYearData = useQuery(GetCurrentSchoolYearByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.schoolyear_getcurrent) {
      setEnrollmentPacketFlag(schoolYearData?.data?.schoolyear_getcurrent?.enrollment_packet)
    } else {
      setEnrollmentPacketFlag(false)
    }
  }, [region_id, schoolYearData])
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
        message: 'Finish Submitting Enrollment Packet',
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
            {student.person.preferred_first_name ?? student.person.first_name}
          </Paragraph>
          {enrollmentPacketFlag && (
            <Tooltip title={circleData?.message}>
              <IconButton onClick={redirect}>{circleData?.icon}</IconButton>
            </Tooltip>
          )}
        </Box>
      }
      image={
        <Box sx={classes.progressContainer} position='relative'>
          <CircularProgress
            variant='determinate'
            value={enrollmentPacketFlag ? circleData?.progress : null}
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
