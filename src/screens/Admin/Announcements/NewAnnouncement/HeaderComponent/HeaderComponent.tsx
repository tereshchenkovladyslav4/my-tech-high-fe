import React, { useState } from 'react'
import { Box, Button } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { CustomModal } from '@mth/components/CustomModal/CustomModals'
import PageHeader from '@mth/components/PageHeader'
import { MthRoute, MthTitle } from '@mth/enums'
import { mthButtonClasses } from '@mth/styles/button.style'
import { Announcement } from '../../../../Dashboard/Announcements/types'

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
  const history = useHistory()
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showUpdatePublishedModal, setShowUpdatePublishedModal] = useState(false)

  const handleBackClick = () => {
    if (announcement) setAnnouncement(null)
    history.push(`${MthRoute.ANNOUNCEMENTS}`)
  }

  return (
    <PageHeader
      title={announcement ? `Edit ${announcement.status} Announcement` : MthTitle.ADD_ANNOUNCEMENT}
      onBack={handleBackClick}
    >
      <>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Button sx={mthButtonClasses.roundXsRed} onClick={() => setShowCancelModal(true)}>
            Cancel
          </Button>
          {(announcement?.status === 'Draft' || announcement === null) && (
            <Button sx={mthButtonClasses.roundXsPrimary} onClick={() => handleSaveClick()}>
              Save
            </Button>
          )}
          <Button
            sx={mthButtonClasses.roundXsGreen}
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
      </>
    </PageHeader>
  )
}

export default HeaderComponent
