import { Box } from '@mui/system'
import React, { useContext, useEffect, useState } from 'react'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { MTHORANGE, HOMEROOM, ENROLLMENT } from '../../../../utils/constants'
import { toOrdinalSuffix } from '../../../../utils/stringHelpers'
import { StudentTemplateType } from './type'
import { useHistory } from 'react-router-dom'
import { CircleData, SchoolYearType } from '../../../Dashboard/HomeroomGrade/components/StudentGrade/types'
import { Person } from '../../../HomeroomStudentProfile/Student/types'
import { Avatar } from '@mui/material'
import { Metadata } from '../../../../components/Metadata/Metadata'
import { Title } from '../../../../components/Typography/Title/Title'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { useQuery } from '@apollo/client'
import {} from '../../../Admin/Announcements/services'
import { getSchoolYearsByRegionId } from '../../../Admin/Dashboard/SchoolYear/SchoolYear'

export const Student: StudentTemplateType = ({ student }) => {
  const { me, setMe } = useContext(UserContext)
  const { region_id } = me?.userRegion?.at(-1)
  const [schoolYears, setSchoolYears] = useState<SchoolYearType[]>([])
  const schoolYearData = useQuery(getSchoolYearsByRegionId, {
    variables: {
      regionId: region_id,
    },
    skip: region_id ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (schoolYearData?.data?.region?.SchoolYears) {
      const { SchoolYears } = schoolYearData?.data?.region
      setSchoolYears(
        SchoolYears.map((item) => ({
          school_year_id: item.school_year_id,
          enrollment_packet: item.enrollment_packet,
        })),
      )
    } else {
      setSchoolYears([])
    }
  }, [region_id, schoolYearData])

  const checkEnrollPacketStatus = (student): boolean => {
    if (student?.status?.at(-1).status != 0) return true
    if (schoolYears.length > 0) {
      const { enrollment_packet } = schoolYears
        ?.filter((item) => item.school_year_id == student?.current_school_year_status?.school_year_id)
        .at(-1)
      return enrollment_packet
    }
    return false
  }

  const enrollmentLink = `${HOMEROOM + ENROLLMENT}/${student.student_id}`
  const homeroomLink = `${HOMEROOM}/${student.student_id}`

  const getProfilePhoto = (person: Person) => {
    if (!person.photo) return ''

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

  const history = useHistory()
  const [circleData, setCircleData] = useState<CircleData>()
  const blue = '#2B9EB7'

  const linkChecker = () => {
    const { applications, packets } = student
    const currApplication = applications.at(0)
    const currPacket = packets?.at(0)

    if (currApplication && currApplication?.status === 'Submitted') {
      return HOMEROOM
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      packets &&
      currPacket?.status === 'Not Started'
    ) {
      return enrollmentLink
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Started'
    ) {
      return enrollmentLink
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      ((currPacket && currPacket?.status === 'Submitted') ||
        currPacket?.status === 'Missing Info' ||
        currPacket?.status === 'Accepted')
    ) {
      return homeroomLink
    }
  }

  const toolTipLinkChecker = () => {
    const { applications, packets } = student
    const currApplication = applications.at(0)
    const currPacket = packets?.at(0)

    if (currApplication && currApplication?.status === 'Submitted') {
      return HOMEROOM
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      packets &&
      currPacket?.status === 'Not Started'
    ) {
      return enrollmentLink
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Started'
    ) {
      return enrollmentLink
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Missing Info'
    ) {
      return enrollmentLink
    }
  }

  const [showToolTip, setShowToolTip] = useState(true)
  const [link, setLink] = useState(linkChecker())
  const [toolTipLink] = useState(toolTipLinkChecker())

  useEffect(() => {
    progress()
  }, [])
  const progress = () => {
    const { applications, packets } = student
    const currApplication = applications.at(0)
    const currPacket = packets?.at(0)

    if (currApplication && currApplication?.status === 'Submitted') {
      setCircleData({
        color: blue,
        progress: 25,
        message: 'Application Pending Approval',
        icon: (
          <ScheduleIcon
            sx={{ color: blue, marginTop: 2, cursor: 'pointer' }}
            onClick={() => history.push(toolTipLink)}
          />
        ),
      })
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      packets &&
      (currPacket?.status === 'Not Started' || currPacket?.status === 'Missing Info')
    ) {
      if (currPacket?.status === 'Not Started') {
        setCircleData({
          color: MTHORANGE,
          progress: 50,
          message: 'Please Submit an Enrollment Packet',
          icon: (
            <ErrorOutlineIcon
              sx={{ color: MTHORANGE, marginTop: 2, cursor: 'pointer' }}
              onClick={() => history.push(toolTipLink)}
            />
          ),
        })
      } else {
        setCircleData({
          color: MTHORANGE,
          progress: 50,
          message: 'Please Resubmit Enrollment Packet',
          icon: (
            <ErrorOutlineIcon
              sx={{ color: MTHORANGE, marginTop: 2, cursor: 'pointer' }}
              onClick={() => history.push(toolTipLink)}
            />
          ),
        })
      }
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Started'
    ) {
      setCircleData({
        color: MTHORANGE,
        progress: 50,
        message: 'Please Submit Enrollment Packet',
        icon: (
          <ErrorOutlineIcon
            sx={{ color: MTHORANGE, marginTop: 2, cursor: 'pointer' }}
            onClick={() => history.push(toolTipLink)}
          />
        ),
      })
    } else if (
      currApplication &&
      currApplication?.status === 'Accepted' &&
      currPacket &&
      currPacket?.status === 'Submitted'
    ) {
      setCircleData({
        color: blue,
        progress: 50,
        message: 'Enrollment Packet Pending Approval',
        icon: (
          <ScheduleIcon
            sx={{ color: blue, marginTop: 2, cursor: 'pointer' }}
            onClick={() => history.push(toolTipLink)}
          />
        ),
      })
    } else {
      setShowToolTip(false)
    }
  }

  const gradeText =
    student.grade_levels.at(-1).grade_level !== 'Kin'
      ? `${toOrdinalSuffix(student.grade_levels.at(-1).grade_level as number)} Grade`
      : 'Kindergarten'

  return (
    <Box sx={{ marginX: 2 }}>
      <Metadata
        title={<Title>{student.person.first_name}</Title>}
        subtitle={
          <Box>
            <Subtitle size={'large'}>{gradeText}</Subtitle>
            {showToolTip && checkEnrollPacketStatus(student) && (
              <>
                {circleData?.icon}
                <Paragraph size='medium' color={circleData?.color}>
                  {circleData?.message}
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
            alt='Remy Sharp'
            variant='rounded'
            src={getProfilePhoto(student.person)}
            onClick={() => {
              if (checkEnrollPacketStatus(student)) {
                setMe({
                  ...me,
                  currentTab: 0,
                })
                history.push(link)
              }
            }}
          />
        }
        rounded
        verticle
      />
    </Box>
  )
}
