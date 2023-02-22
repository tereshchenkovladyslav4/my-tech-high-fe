import React, { useEffect, useState } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Avatar, Box, CircularProgress, IconButton } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor, MthRoute } from '@mth/enums'
import { HomeroomTeacher } from '@mth/models'
import { useStyles } from './styles'
import { CircleData } from './types'

export const TeacherItem: React.FC<HomeroomTeacher> = ({ teacher }) => {
  const classes = useStyles
  const [circleData, setCircleData] = useState<CircleData>()

  const getProfilePhoto = (photo?: string) => {
    if (!photo) return 'image'
    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + photo
  }
  const history = useHistory()
  const progress = () => {
    setCircleData({
      color: teacher.ungradedLogs === 0 ? MthColor.MTHGREEN : MthColor.RED,
      progress: 100,
      icon:
        teacher.ungradedLogs !== 0 ? (
          <ErrorOutlineIcon sx={{ color: MthColor.RED, cursor: 'pointer', width: '16px', height: '16px' }} />
        ) : undefined,
    })
  }
  useEffect(() => {
    progress()
  }, [teacher])

  return (
    <Box width={'100px'}>
      <Metadata
        title={
          <Subtitle fontWeight={'700'} color={MthColor.SYSTEM_11} sx={{ fontSize: '16px' }} testId='ungradedLogsNumber'>
            {teacher.ungradedLogs}
          </Subtitle>
        }
        subtitle={
          <Box>
            <Paragraph fontWeight={'700'} color={MthColor.BLACK} size='medium' data-testid='teacherName'>
              {teacher.firstName}
            </Paragraph>
            <IconButton data-testid='exclamationMark'>{circleData?.icon}</IconButton>
          </Box>
        }
        image={
          <Box
            sx={classes.progressWrapper}
            position='relative'
            onClick={() => {
              history.push(`${MthRoute.HOMEROOM}/${teacher.classId}`)
            }}
            data-testid='clickToHomeroom'
          >
            <CircularProgress
              variant='determinate'
              value={circleData?.progress}
              size={60}
              sx={{ color: circleData?.color }}
              data-testid='circleProgress'
            />
            <Box sx={classes.avatarWrapper} position='absolute'>
              <Avatar
                alt={teacher?.firstName}
                src={getProfilePhoto(teacher?.avatarUrl)}
                sx={classes.avatar}
                data-testid='teacherIcon'
              />
            </Box>
          </Box>
        }
        verticle
      />
    </Box>
  )
}
