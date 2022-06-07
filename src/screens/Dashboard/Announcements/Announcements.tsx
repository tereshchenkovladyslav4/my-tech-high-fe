import { Box, Button } from '@mui/material'
import { Flexbox } from '../../../components/Flexbox/Flexbox'
import React, { useContext } from 'react'
import { Paragraph } from '../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import { AnnouncementTemplateType } from './types'
import { AnnouncementItem } from './components/AnnouncementItem'
import { map } from 'lodash'
import { EmptyState } from '../../../components/EmptyState/EmptyState'
import { SYSTEM_06 } from '../../../utils/constants'
import { Title } from '../../../components/Typography/Title/Title'
import { useMutation } from '@apollo/client'
import { deleteUserAnnouncementById, deleteUserAnnouncementByUserId } from '../services'
import { UserContext } from '../../../providers/UserContext/UserProvider'
import BGSVG from '../../../assets/AnnouncementBG.svg'

const Announcements: AnnouncementTemplateType = ({
  announcements,
  setAnnouncements,
  setSelectedAnnouncement,
  setSectionName,
}) => {
  const classes = useStyles
  const { me, setMe } = useContext(UserContext)
  const [deleteAnnouncementById, {}] = useMutation(deleteUserAnnouncementById)
  const [deleteAnnouncementByUserId, {}] = useMutation(deleteUserAnnouncementByUserId)
  const onDeleteById = async (id: number) => {
    const response = await deleteAnnouncementById({
      variables: {
        id: id,
      },
    })
    const { error, message } = response.data
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
    const { error, message } = response.data
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
        announcements?.length == 0 && {
          backgroundImage: `url(${BGSVG})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '60vh',
          justifyContent: 'center',
          textAlign: 'center',
        }
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
          <Button onClick={() => setSectionName('viewAll')}>
            <Paragraph size='medium' sx={{ textDecoration: 'underline' }} color='#4145FF'>
              View All
            </Paragraph>
          </Button>
        </Box>
        {announcements?.length > 0 ? (
          <Box sx={{ position: 'relative' }}>
            {renderAnnouncements()}
            <Box sx={classes.clearAll} onClick={() => onDeleteAll()}>
              <Paragraph textAlign='center' size='medium' color={SYSTEM_06} sx={{ textDecoration: 'underline' }}>
                Clear All
              </Paragraph>
            </Box>
          </Box>
        ) : (
          <EmptyState
            title={<Title sx={{ fontSize: '12.85px' }}>Congrats!</Title>}
            subtitle={
              <Subtitle color={SYSTEM_06} sx={{ fontSize: '12.85px' }} fontWeight='500'>
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
