import React, { useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Button } from '@mui/material'
import { map } from 'lodash'
import BGSVG from '@mth/assets/AnnouncementBG.svg'
import { EmptyState } from '@mth/components/EmptyState/EmptyState'
import { Flexbox } from '@mth/components/Flexbox/Flexbox'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { Title } from '@mth/components/Typography/Title/Title'
import { MthColor } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { deleteUserAnnouncementByUserId, markRead } from '../services'
import { DashboardSection } from '../types'
import { AnnouncementItem } from './components/AnnouncementItem'
import { announcementClasses } from './styles'
import { AnnnouncementProps } from './types'

const Announcements: React.FC<AnnnouncementProps> = ({
  announcements,
  setAnnouncements,
  setSelectedAnnouncement,
  setSectionName,
}) => {
  const { me } = useContext(UserContext)

  const [markReadById, {}] = useMutation(markRead)
  const [deleteAnnouncementByUserId, {}] = useMutation(deleteUserAnnouncementByUserId)
  const onDeleteById = async (id = 0) => {
    const response = await markReadById({
      variables: {
        id: id,
      },
    })
    const { error } = response.data
    if (!error) {
      setAnnouncements(announcements?.filter((announement) => announement.id !== id))
    }
  }
  const onDeleteAll = async () => {
    const response = await deleteAnnouncementByUserId({
      variables: {
        userId: Number(me?.user_id),
      },
    })
    const { error } = response.data
    if (!error) {
      setAnnouncements([])
    }
  }
  const renderAnnouncements = () =>
    map(announcements, (announcement, idx) => {
      return (
        <AnnouncementItem
          key={idx}
          onClose={() => onDeleteById(announcement.id)}
          setSectionName={setSectionName}
          announcement={announcement}
          setSelectedAnnouncement={setSelectedAnnouncement}
        />
      )
    })
  return (
    <Box
      sx={
        (announcements?.length == 0 && {
          backgroundImage: `url(${BGSVG})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '60vh',
          justifyContent: 'center',
          textAlign: 'center',
        }) ||
        {}
      }
      paddingY={1.5}
      paddingX={3}
    >
      <Flexbox flexDirection='column' textAlign='left'>
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='space-between'
          sx={{ paddingX: '20px' }}
          alignItems='center'
        >
          <Paragraph sx={{ fontSize: '20px', fontWeight: '700' }}>Announcements</Paragraph>
          <Button onClick={() => setSectionName(DashboardSection.VIEW_ALL)}>
            <Paragraph size='medium' sx={{ textDecoration: 'underline' }} color='#4145FF'>
              View All
            </Paragraph>
          </Button>
        </Box>
        {announcements?.length > 0 ? (
          <Box sx={{ position: 'relative' }}>
            {renderAnnouncements()}
            <Box sx={announcementClasses.clearAll} onClick={() => onDeleteAll()}>
              <Paragraph
                textAlign='center'
                size='medium'
                color={MthColor.SYSTEM_06}
                sx={{ textDecoration: 'underline' }}
              >
                Clear All
              </Paragraph>
            </Box>
          </Box>
        ) : (
          <EmptyState
            title={<Title sx={{ fontSize: '12.85px' }}>Congrats!</Title>}
            subtitle={
              <Subtitle color={MthColor.SYSTEM_06} sx={{ fontSize: '12.85px' }} fontWeight='500'>
                You are all caught up.
              </Subtitle>
            }
          />
        )}
      </Flexbox>
    </Box>
  )
}

export default Announcements
