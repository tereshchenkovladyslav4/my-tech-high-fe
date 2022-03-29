import { Box, Button, Card } from '@mui/material'
import { Flexbox } from '../../../components/Flexbox/Flexbox'
import { Metadata } from '../../../components/Metadata/Metadata'
import React, { useEffect, useState } from 'react'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import CloseIcon from '@mui/icons-material/Close'
import { useStyles } from './styles'
import { AnnouncementTemplateType } from './types'
import { AnnouncementItem } from './components/AnnouncementItem/AnnouncementItem'
import { filter, map } from 'lodash'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { SYSTEM_06 } from '../../../utils/constants'
import { Title } from '../../../components/Typography/Title/Title'
import moment from 'moment'
export const Announcements: AnnouncementTemplateType = ({ expandAnnouncments }) => {
  const date = new Date()
  console.log()
  const [announcements, setAnnouncements] = useState([
    {
      title: 'Highlighting our new MTH Game Maker course!',
      date: moment(date).format('MMMM D')
    },
    {
      title: 'Highlighting our new MTH Game Maker course!',
      date: moment(date).format('MMMM D')
    },
    {
      title: 'Highlighting our new MTH Game Maker course!',
      date: moment(date).format('MMMM D')
    },
  ])
  const onClose = (idx: number) => {
    setAnnouncements(announcements.filter((announement, el) => idx !== el))
  }
  const renderAnnouncements = () =>
    map(announcements, (announcment, idx) => {
      return <AnnouncementItem title={announcment.title} subtitle={announcment.date} onClose={() => onClose(idx)} />
    })
  return (
    <Box paddingY={1.5} paddingX={3}>
      <Flexbox flexDirection='column' textAlign='left'>
        <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
          <Paragraph size='large' fontWeight='700'>
            Announcements
          </Paragraph>
          <Button onClick={() => expandAnnouncments(true)}>
              <Paragraph size='medium' color='#4145FF'>
                View All
              </Paragraph>
          </Button>
        </Box>
        {announcements.length > 0 
        ? <Box sx={{position: 'relative'}}>
            {renderAnnouncements()}
            {/*<Box
              sx={{
                marginTop: 20,
                cursor: 'pointer',
                position:'relative',
                alignItems:'center',
                width: '100%'
              }}
              onClick={() => setAnnouncements([])}
            >
              <Paragraph 
                textAlign='center' 
                size='medium' 
                color={SYSTEM_06}
                sx={{position: 'fixed'}}
                >
                Clear All
              </Paragraph>
            </Box>*/}
        </Box>
        : (
          <Box marginTop={20}>
            <EmptyState 
              title={<Title>Congrats</Title>} 
              subtitle={<Subtitle color={SYSTEM_06} fontWeight='700'>You are all caught up.</Subtitle>}
            />
          </Box>
        )}
      </Flexbox>
    </Box>
  )
}
