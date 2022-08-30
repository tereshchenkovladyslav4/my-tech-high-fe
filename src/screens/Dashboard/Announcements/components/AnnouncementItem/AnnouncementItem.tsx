import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box } from '@mui/system'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { announcementClassess } from '../../styles'
import { AnnouncmentItemProps } from './types'

const AnnouncementItem: React.FC<AnnouncmentItemProps> = ({
  announcement,
  onClose,
  setSectionName,
  setSelectedAnnouncement,
}) => {
  const [style, setStyle] = useState({ display: 'none' })
  const handleReadMore = () => {
    setSelectedAnnouncement(announcement)
    setSectionName('readMore')
  }
  return (
    <Box
      sx={announcementClassess.announcementItem}
      onMouseEnter={() => setStyle({ display: 'block' })}
      onMouseLeave={() => setStyle({ display: 'none' })}
    >
      <Metadata
        disableGutters
        title={
          <Paragraph size='large' onClick={() => handleReadMore()}>
            {announcement?.subject}
          </Paragraph>
        }
        subtitle={
          <Paragraph size='medium' onClick={() => handleReadMore()}>
            {announcement?.date}
          </Paragraph>
        }
        secondaryAction={
          <>
            <Box
              position='absolute'
              sx={{ ...announcementClassess.closeIconContainer, display: { xs: 'none', md: 'block' } }}
            >
              <CloseIcon sx={style} style={announcementClassess.closeIcon} onClick={() => onClose()} />
            </Box>
            <Box
              position='absolute'
              sx={{ ...announcementClassess.closeIconContainer, right: '-33px', display: { xs: 'block', md: 'none' } }}
            >
              <CloseIcon style={announcementClassess.closeIcon} onClick={() => onClose()} />
            </Box>
          </>
        }
      />
    </Box>
  )
}

export default AnnouncementItem
