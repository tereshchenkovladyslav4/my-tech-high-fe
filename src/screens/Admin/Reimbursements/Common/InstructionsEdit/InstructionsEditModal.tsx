import React, { useState } from 'react'
import { Box, Button, Modal } from '@mui/material'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { testingPreferenceClasses } from '@mth/screens/Admin/SiteManagement/EnrollmentSetting/TestingPreference/styles'
import { mthButtonClasses } from '@mth/styles/button.style'

type InstructionsEditModalProps = {
  description: string
  handleClose: () => void
  handleSave: (value: string) => void
}

const InstructionsEditModal: React.FC<InstructionsEditModalProps> = ({ description, handleClose, handleSave }) => {
  const [editedDescription, setEditedDescription] = useState<string>(description)

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={testingPreferenceClasses.customizeModalContainer}>
        <Box sx={testingPreferenceClasses.content}>
          <MthBulletEditor
            value={editedDescription}
            setValue={(value) => {
              setEditedDescription(value)
            }}
          />
        </Box>
        <Box sx={testingPreferenceClasses.btnGroup}>
          <Button sx={{ ...mthButtonClasses.roundGray, width: '160px' }} onClick={handleClose}>
            Cancel
          </Button>
          <Button sx={{ ...mthButtonClasses.roundDark, width: '160px' }} onClick={() => handleSave(editedDescription)}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default InstructionsEditModal
