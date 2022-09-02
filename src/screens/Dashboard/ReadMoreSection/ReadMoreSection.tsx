import React, { useContext, useEffect, useState } from 'react'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import { Button, Card, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getWindowDimension } from '@mth/utils'
import { announcementClassess } from '../Announcements/styles'
import { avatarGroup } from '../AnnouncementSection/AnnouncementSection'
import { ReadMoreSectionProps } from './types'

const ReadMoreSection: React.FC<ReadMoreSectionProps> = ({ announcement, setSectionName }) => {
  const { me } = useContext(UserContext)
  const students = me?.students
  const [windowDimensions, setWindowDimensions] = useState<{ width: number; height: number }>(getWindowDimension())

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimension())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'left',
        marginTop: 2,
        backgroundColor: windowDimensions.width > 600 ? '' : '#FAFAFA',
        mt: windowDimensions.width > 600 ? '20px' : '-10px',
      }}
    >
      <Grid container spacing={2} justifyContent='center'>
        <Grid item xs={11}>
          <Box display='flex' flexDirection='row' textAlign='left' marginTop={2}></Box>
        </Grid>
        <Grid item xs={11}>
          <Card
            sx={{
              marginBottom: '60vh',
            }}
          >
            <Box
              display='flex'
              flexDirection='row'
              textAlign='left'
              marginTop={2}
              justifyContent='space-between'
              marginX={4}
            >
              <Box display='flex' flexDirection='row' alignItems='center' alignContent='center'>
                <Button sx={{ marginBottom: 'auto' }} onClick={() => setSectionName('viewAll')}>
                  <ChevronLeftIcon sx={{ marginRight: 0.5, marginLeft: -2.5 }} />
                </Button>
                <Box sx={{ marginRight: 10 }}>
                  <Subtitle size='large' sx={{ fontSize: '24px' }} fontWeight='700'>
                    {announcement?.subject}
                  </Subtitle>
                </Box>
              </Box>
            </Box>
            <Box sx={announcementClassess.readMoreSection}>
              <Typography fontSize={'16px'} color={'#A1A1A1'} fontWeight={700}>
                {announcement?.date}
              </Typography>
            </Box>
            <Box sx={announcementClassess.readMoreSection}>
              {announcement?.grades && avatarGroup(announcement?.grades, students)}
            </Box>
            <Box sx={announcementClassess.readMoreSection}>
              <Typography
                component={'span'}
                variant={'body2'}
                dangerouslySetInnerHTML={{ __html: announcement?.body || '' }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ReadMoreSection
