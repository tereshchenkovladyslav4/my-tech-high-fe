import { Box, Button, IconButton } from '@mui/material'
import React from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from '../styles'
import { ANNOUNCEMENTS } from '../../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { Announcement } from '../../../../Dashboard/Announcements/types'

type HeaderComponentProps = {
  announcement?: Announcement
  setAnnouncement?: (value: Announcement) => void
  handleSaveClick: () => void
  handlePublishClick: () => void
}

const HeaderComponent = ({
  announcement,
  setAnnouncement,
  handleSaveClick,
  handlePublishClick,
}: HeaderComponentProps) => {
  const classes = useStyles
  const history = useHistory()

  const handleBackClick = () => {
    if (announcement) setAnnouncement(null)
    history.push(ANNOUNCEMENTS)
  }

  return (
    <Box sx={classes.pageTop}>
      <Box sx={classes.pageTitle}>
        <IconButton
          onClick={handleBackClick}
          sx={{
            position: 'relative',
          }}
        >
          <ArrowBackIosRoundedIcon sx={{ fontSize: '15px', stroke: 'black', strokeWidth: 2 }} />
        </IconButton>
        {announcement ? (
          <Subtitle size='medium' fontWeight='700'>
            Edit Announcement
          </Subtitle>
        ) : (
          <Subtitle size='medium' fontWeight='700'>
            Add Announcement
          </Subtitle>
        )}
      </Box>
      <Box sx={classes.pageTopRight}>
        <Button sx={classes.cancelBtn} onClick={() => handleBackClick()}>
          Cancel
        </Button>
        <Button sx={classes.saveBtn} onClick={() => handleSaveClick()}>
          Save
        </Button>
        <Button sx={classes.publishBtn} onClick={() => handlePublishClick()}>
          Publish
        </Button>
      </Box>
    </Box>
  )
}

export default HeaderComponent
