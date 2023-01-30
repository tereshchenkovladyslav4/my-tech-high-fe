import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Button, Modal, TextField } from '@mui/material'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { diplomaQuestionSaveGql } from '../../services'
import { diplomaSeekingClasses } from './styles'
import { DiplomaQuestionEditModalProps } from './types'

const DiplomaQuestionEditModal: React.FC<DiplomaQuestionEditModalProps> = ({
  information,
  onClose,
  refetch,
  selectedSchoolYear,
}) => {
  const [informationTitle, setInformationTitle] = useState<string>(information.title)
  const [informationDescription, setInformationDescription] = useState<string>(information.description)

  const [saveDiplomaQuestion] = useMutation(diplomaQuestionSaveGql)
  const handleModalSave = async () => {
    const newDiplomaQuestion = information?.id
      ? {
          id: information.id,
          schoolYearId: +selectedSchoolYear,
          description: informationDescription,
          title: informationTitle,
        }
      : {
          schoolYearId: +selectedSchoolYear,
          description: informationDescription,
          title: informationTitle,
        }
    await saveDiplomaQuestion({
      variables: {
        diplomaQuestionInput: newDiplomaQuestion,
      },
    })
    refetch()
    onClose()
  }

  return (
    <Modal open={true} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={diplomaSeekingClasses.customizeModalContainer}>
        <Box sx={diplomaSeekingClasses.content}>
          <TextField
            name='title'
            label='Title'
            placeholder='Entry'
            fullWidth
            value={informationTitle}
            onChange={(e) => setInformationTitle(e.target.value)}
            sx={{ my: 1, maxWidth: '50%' }}
          />
          <MthBulletEditor value={informationDescription} setValue={(value) => setInformationDescription(value)} />
        </Box>
        <Box sx={diplomaSeekingClasses.btnGroup}>
          <Button sx={diplomaSeekingClasses.cancelBtn} onClick={onClose}>
            Cancel
          </Button>
          <Button sx={diplomaSeekingClasses.modalSaveBtn} onClick={handleModalSave}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}

export default DiplomaQuestionEditModal
