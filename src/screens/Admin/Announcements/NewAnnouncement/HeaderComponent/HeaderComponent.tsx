import { Box, Button, IconButton } from '@mui/material'
import React, { useState } from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from '../styles'
import { ANNOUNCEMENTS } from '../../../../../utils/constants'
import { useHistory } from 'react-router-dom'
import { Announcement } from '../../../../Dashboard/Announcements/types'
import CustomModal from '../../../../../components/CustomModal/CustomModals'

type HeaderComponentProps = {
  announcement: Announcement | null
  setAnnouncement: (value: Announcement | null) => void
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
  const [showCancelModal, setShowCancelModal] = useState(false)

  const handleBackClick = () => {
    if (announcement) setAnnouncement(null)
    history.push(ANNOUNCEMENTS)
  }


  return (
    <Box sx={classes.pageTop}>
      {showCancelModal && 
        <CustomModal
          title={'Cancel Changes'}
          description={'Are you sure you want to cancel changes?'}
          confirmStr='Yes'
          cancelStr='No'
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleBackClick}
          backgroundColor='white'
        />
      }
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
        <Button sx={classes.cancelBtn} onClick={() => setShowCancelModal(true)}>
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
