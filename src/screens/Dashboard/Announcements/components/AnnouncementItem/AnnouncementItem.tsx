import { Box } from '@mui/system'
import React, { useState } from 'react'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import CloseIcon from '@mui/icons-material/Close'
import { useStyles } from '../../styles'
import { AnnouncmentTemplateType } from './types'

const AnnouncementItem: AnnouncmentTemplateType = ({ title, subtitle, onClose, setSectionName }) => {
  const classes = useStyles
  const [style, setStyle] = useState({ display: 'none' })
  return (
    <Box
      sx={classes.announcementItem}
      onMouseEnter={(e) => setStyle({ display: 'block' })}
      onMouseLeave={(e) => setStyle({ display: 'none' })}
      onClick={() => setSectionName('readMore')}
    >
      <Metadata
        disableGutters
        title={<Paragraph size='large'>{title}</Paragraph>}
        subtitle={<Paragraph size='medium'>{subtitle}</Paragraph>}
        secondaryAction={
          <Box position='absolute' sx={classes.closeIconContainer}>
            <CloseIcon sx={style} style={classes.closeIcon} onClick={() => onClose()} />
          </Box>
        }
      />
    </Box>
  )
}

export default AnnouncementItem
