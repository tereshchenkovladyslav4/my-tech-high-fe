import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { Box } from '@mui/system'
import { Metadata } from '@mth/components/Metadata/Metadata'
import { Paragraph } from '@mth/components/Typography/Paragraph/Paragraph'
import { DashboardSection } from '../../../types'
import { announcementClasses } from '../../styles'
import { AnnouncementItemProps } from './types'

const AnnouncementItem: React.FC<AnnouncementItemProps> = ({
  announcement,
  onClose,
  setSectionName,
  setSelectedAnnouncement,
}) => {
  const [style, setStyle] = useState({ display: 'none' })
  const handleReadMore = () => {
    setSelectedAnnouncement(announcement)
    setSectionName(DashboardSection.READ_MORE)
  }
  return (
    <Box
      sx={announcementClasses.announcementItem}
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
              sx={{ ...announcementClasses.closeIconContainer, display: { xs: 'none', md: 'block' } }}
            >
              <CloseIcon sx={style} style={announcementClasses.closeIcon} onClick={() => onClose()} />
            </Box>
            <Box
              position='absolute'
              sx={{ ...announcementClasses.closeIconContainer, right: '-33px', display: { xs: 'block', md: 'none' } }}
            >
              <CloseIcon style={announcementClasses.closeIcon} onClick={() => onClose()} />
            </Box>
          </>
        }
      />
    </Box>
  )
}

export default AnnouncementItem
