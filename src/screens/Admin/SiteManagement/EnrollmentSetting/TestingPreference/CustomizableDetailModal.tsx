import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Button, Modal, TextField } from '@mui/material'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { TESTING_PREFERENCE } from '@mth/constants'
import { updateSchoolYearMutation } from '../../services'
import { testingPreferenceClasses } from './styles'
import { CustomizableDetailModalProps } from './types'

const CustomizableDetailModal: React.FC<CustomizableDetailModalProps> = ({ information, handleClose, refetch }) => {
  const [informationTitle, setInformationTitle] = useState<string>(information.title)
  const [informationDescription, setInformationDescription] = useState<string>(information.description)
  const [submitSave] = useMutation(updateSchoolYearMutation)
  const handleSave = async () => {
    if (information.schoolYear) {
      const submitedResponse = await submitSave({
        variables: {
          updateSchoolYearInput:
            information.type == TESTING_PREFERENCE
              ? {
                  school_year_id: information.schoolYear,
                  testing_preference_title: informationTitle,
                  testing_preference_description: informationDescription,
                }
              : {
                  school_year_id: information.schoolYear,
                  opt_out_form_title: informationTitle,
                  opt_out_form_description: informationDescription,
                },
        },
      })

      if (submitedResponse) {
        if (refetch) refetch()
        handleClose()
      }
    }
  }
  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={testingPreferenceClasses.customizeModalContainer}>
        <Box sx={testingPreferenceClasses.content}>
          <TextField
            name='title'
            label='Title'
            placeholder='Entry'
            fullWidth
            value={informationTitle}
            onChange={(e) => {
              setInformationTitle(e.target.value)
            }}
            sx={{ my: 1, maxWidth: '50%' }}
          />
          <MthBulletEditor
            value={informationDescription}
            setValue={(value) => {
              setInformationDescription(value)
            }}
          />
        </Box>
        <Box sx={testingPreferenceClasses.btnGroup}>
          <Button sx={testingPreferenceClasses.cancelBtn} onClick={handleClose}>
            Cancel
          </Button>
          <Button sx={testingPreferenceClasses.saveBtn} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default CustomizableDetailModal
