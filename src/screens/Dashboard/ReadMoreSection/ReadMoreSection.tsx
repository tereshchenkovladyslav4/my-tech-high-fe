import React, { useContext } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Button, Card, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { avatarGroup } from '../AnnouncementSection/AnnouncementSection'
import { DashboardSection } from '../types'
import { ReadMoreSectionProps } from './types'

const ReadMoreSection: React.FC<ReadMoreSectionProps> = ({ announcement, setSectionName }) => {
  const { me } = useContext(UserContext)
  const students = me?.students

  window.scrollTo(0, 0)

  return (
    <Card sx={{ margin: 2 }}>
      <Box sx={{ textAlign: 'left', paddingX: { xs: 0, sm: 4, md: 4 }, marginTop: 4 }}>
        <Box display='flex' flexDirection='row' alignItems='center' alignContent='center'>
          <Button sx={{ marginBottom: 'auto' }} onClick={() => setSectionName(DashboardSection.VIEW_ALL)}>
            <ChevronLeftIcon />
          </Button>
          <Box sx={{ marginRight: 10 }}>
            <Subtitle size='large' sx={{ fontSize: '24px' }} fontWeight='700'>
              {announcement?.subject}
            </Subtitle>
          </Box>
        </Box>
        <Box sx={{ paddingX: 8 }}>
          <Box sx={{ paddingY: 1 }}>
            <Typography fontSize={'16px'} color={MthColor.SYSTEM_06} fontWeight={700}>
              {announcement?.date}
            </Typography>
          </Box>
          <Box sx={{ paddingY: 1 }}>{announcement?.grades && avatarGroup(announcement?.grades, students)}</Box>
          <Box sx={{ paddingY: 4 }}>
            <Typography
              component={'span'}
              variant={'body2'}
              dangerouslySetInnerHTML={{ __html: announcement?.body || '' }}
            />
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default ReadMoreSection
