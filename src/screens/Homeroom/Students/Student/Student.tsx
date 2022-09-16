import React, { useContext, useEffect, useState } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Avatar, Box, Button, Card } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { ApplicantStatus, MthColor, MthRoute, PacketStatus, StudentStatus } from '@mth/enums'
import { UserContext, UserInfo } from '@mth/providers/UserContext/UserProvider'
import { CircleData } from '@mth/screens/Dashboard/HomeroomGrade/components/StudentGrade/types'
import { Person } from '@mth/screens/HomeroomStudentProfile/Student/types'
import { checkEnrollPacketStatus, toOrdinalSuffix } from '@mth/utils'
import { StudentTemplateType } from './type'

export const Student: StudentTemplateType = ({ student, schoolYears, showNotification, withdrawn }) => {
  const { me, setMe } = useContext(UserContext)
  const history = useHistory()

  const [circleData, setCircleData] = useState<CircleData>()
  const [link, setLink] = useState<string>('')
  const [showToolTip, setShowToolTip] = useState(true)
  const [toolTipLink, setToolTipLink] = useState<string>('')

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return undefined

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }
  useEffect(() => {
    const { applications, packets } = student
    const currApplication = applications?.at(0)
    const currPacket = packets?.at(0)

    const enrollmentLink = `${MthRoute.HOMEROOM + MthRoute.ENROLLMENT}/${student.student_id}`
    const homeroomLink = `${MthRoute.HOMEROOM}/${student.student_id}`

    if (currApplication && currApplication?.status === ApplicantStatus.SUBMITTED) {
      setLink(MthRoute.HOMEROOM)
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      packets &&
      currPacket?.status === PacketStatus.NOT_STARTED
    ) {
      setLink(enrollmentLink)
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.STARTED
    ) {
      setLink(enrollmentLink)
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      ((currPacket && currPacket?.status === PacketStatus.SUBMITTED) ||
        currPacket?.status === PacketStatus.MISSING_INFO ||
        currPacket?.status === PacketStatus.ACCEPTED)
    ) {
      setLink(homeroomLink)
    }

    if (currApplication && currApplication?.status === ApplicantStatus.SUBMITTED) {
      setToolTipLink(MthRoute.HOMEROOM)
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      packets &&
      currPacket?.status === PacketStatus.NOT_STARTED
    ) {
      setToolTipLink(enrollmentLink)
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.STARTED
    ) {
      setToolTipLink(enrollmentLink)
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.MISSING_INFO
    ) {
      setToolTipLink(enrollmentLink)
    }
  }, [student])

  useEffect(() => {
    progress()
  }, [])

  const progress = () => {
    const { applications, packets, status } = student
    const currApplication = applications?.at(0)
    const currPacket = packets?.at(0)
    const studentStatus = status?.at(0)?.status

    if (studentStatus === StudentStatus.WITHDRAWN) {
      setCircleData({
        mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
        mobileText: 'Re-apply',
        color: MthColor.MTHORANGE,
        progress: 0,
        type: 'Re-apply',
        icon: (
          <ErrorOutlineIcon sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }} onClick={() => {}} />
        ),
      })
    } else if (currApplication && currApplication?.status === ApplicantStatus.SUBMITTED) {
      setCircleData({
        mobileColor: MthColor.MTHGREEN,
        mobileText: 'Application Pending Approval',
        color: MthColor.MTHGREEN,
        progress: 25,
        type: 'Application Pending Approval',
        icon: (
          <ScheduleIcon
            sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }}
            onClick={() => history.push(toolTipLink)}
          />
        ),
      })
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      packets &&
      (currPacket?.status === PacketStatus.NOT_STARTED || currPacket?.status === PacketStatus.MISSING_INFO)
    ) {
      if (currPacket?.status === PacketStatus.NOT_STARTED) {
        setCircleData({
          mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
          mobileText: 'Submit Now',
          progress: 50,
          color: MthColor.MTHORANGE,
          type: 'Please Submit an Enrollment Packet',
          icon: (
            <ErrorOutlineIcon
              sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }}
              onClick={() => history.push(toolTipLink)}
            />
          ),
        })
      } else {
        setCircleData({
          mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
          mobileText: 'Resubmit Now',
          color: MthColor.MTHORANGE,
          progress: 50,
          type: 'Please Resubmit Enrollment Packet',
          icon: (
            <ErrorOutlineIcon
              sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }}
              onClick={() => history.push(toolTipLink)}
            />
          ),
        })
      }
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket &&
      currPacket?.status === PacketStatus.STARTED
    ) {
      setCircleData({
        mobileColor: MthColor.BUTTON_LINEAR_GRADIENT,
        mobileText: 'Submit Now',
        color: MthColor.MTHORANGE,
        progress: 50,
        type: 'Please Submit Enrollment Packet',
        icon: (
          <ErrorOutlineIcon
            sx={{ color: MthColor.MTHORANGE, marginTop: 2, cursor: 'pointer' }}
            onClick={() => history.push(toolTipLink)}
          />
        ),
      })
    } else if (
      currApplication &&
      currApplication?.status === ApplicantStatus.ACCEPTED &&
      currPacket &&
      (currPacket?.status === PacketStatus.SUBMITTED || currPacket?.status === PacketStatus.RESUBMITTED)
    ) {
      setCircleData({
        mobileColor: MthColor.MTHGREEN,
        mobileText: 'Enrollment Pending Approval',
        color: MthColor.MTHGREEN,
        progress: 50,
        type: 'Enrollment Packet Pending Approval',
        icon: (
          <ScheduleIcon
            sx={{ color: MthColor.MTHGREEN, marginTop: 2, cursor: 'pointer' }}
            onClick={() => history.push(toolTipLink)}
          />
        ),
      })
    } else {
      setShowToolTip(false)
    }
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
              {showToolTip && checkEnrollPacketStatus(schoolYears, student) && (
                <>
                  {circleData?.icon}
                  <Paragraph size='medium' color={circleData?.color}>
                    {circleData?.type}
                  </Paragraph>
                </>
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
    </>
  )
}
