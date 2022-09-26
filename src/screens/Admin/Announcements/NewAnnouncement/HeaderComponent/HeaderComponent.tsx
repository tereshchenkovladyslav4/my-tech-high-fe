import React, { useState } from 'react'
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded'
import { Box, Button, IconButton } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthTitle } from '@mth/enums'
import { ANNOUNCEMENTS } from '../../../../../utils/constants'
import { Announcement } from '../../../../Dashboard/Announcements/types'
import { useStyles } from '../styles'

type HeaderComponentProps = {
  announcement: Announcement | null
  setAnnouncement: (value: Announcement | null) => void
  handleSaveClick: () => void
  handlePublishClick: () => void
  handleRepublish: () => void
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  announcement,
  setAnnouncement,
  handleSaveClick,
  handlePublishClick,
  handleRepublish,
}) => {
  const classes = useStyles
  const history = useHistory()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showUpdatePublishedModal, setShowUpdatePublishedModal] = useState(false)

  const handleBackClick = () => {
    if (announcement) setAnnouncement(null)
    history.push(ANNOUNCEMENTS)
  }

  return (
    <Box sx={classes.pageTop}>
      {showCancelModal && (
        <CustomModal
          title={'Cancel Changes'}
          description={'Are you sure you want to cancel changes?'}
          confirmStr='Yes'
          cancelStr='No'
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleBackClick}
          backgroundColor='white'
        />
      )}
      {showUpdatePublishedModal && (
        <CustomModal
          title={'Update'}
          description={`This announcement has already been published. 
            This message will appear as unread on user’s dashboard, 
            but they will not receive a new email. 
            If any recipients have changed, they will receive 
            the new announcement via email.`}
          confirmStr='Update'
          cancelStr='Cancel'
          onClose={() => setShowUpdatePublishedModal(false)}
          onConfirm={() => {
            handleRepublish()
          }}
          backgroundColor='white'
        />
      )}
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
            Edit {announcement.status} Announcement
          </Subtitle>
        ) : (
          <Subtitle size='medium' fontWeight='700'>
            {MthTitle.ADD_ANNOUNCEMENT}
          </Subtitle>
        )}
      </Box>
      <Box sx={classes.pageTopRight}>
        <Button
          sx={announcement?.status !== 'Published' ? classes.cancelBtn : classes.cancelBtnAlt}
          onClick={() => setShowCancelModal(true)}
        >
          Cancel
        </Button>
        {(announcement?.status === 'Draft' || announcement === null) && (
          <Button sx={classes.saveBtn} onClick={() => handleSaveClick()}>
            Save
          </Button>
        )}
        <Button
          sx={announcement?.status !== 'Published' ? classes.publishBtn : classes.publishBtnAlt}
          onClick={() =>
            announcement?.status === undefined ||
            announcement?.status === 'Draft' ||
            announcement.status === 'Scheduled'
              ? handlePublishClick()
              : setShowUpdatePublishedModal(true)
          }
        >
          {announcement?.status === undefined || announcement?.status === 'Draft' ? 'Publish' : 'Update'}
        </Button>
      </Box>
    </Box>
  )
}

export default HeaderComponent
