import React from 'react'
import { Box, Modal } from '@mui/material'
import { EventType } from '../../types'
import { NewType } from '../NewType'
import { editTypeClassess } from './styles'

type EditModalProps = {
  onCancel: () => void
  onSave: () => void
  eventType: EventType | null
}
export const EditTypeModal: React.FC<EditModalProps> = ({ onCancel, onSave, eventType }) => {
  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box sx={editTypeClassess.modalContainer}>
        <Box sx={editTypeClassess.modalBody}>
          <NewType eventType={eventType} onCancel={onCancel} onSave={onSave} />
        </Box>
      </Box>
    </Modal>
  )
}
