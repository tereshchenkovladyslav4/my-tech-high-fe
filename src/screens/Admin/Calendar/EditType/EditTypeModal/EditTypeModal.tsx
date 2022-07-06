import React from 'react'
import { Box, Modal } from '@mui/material'
import { useStyles } from './styles'
import { EventType } from '../../types'
import { NewType } from '../NewType'

export default function EditTypeModal({
  onCancel,
  onSave,
  eventType,
}: {
  onCancel: () => void
  onSave: () => void
  eventType: EventType | null
}) {
  const classes = useStyles

  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box sx={classes.modalContainer}>
        <Box sx={classes.modalBody}>
          <NewType eventType={eventType} onCancel={onCancel} onSave={onSave} />
        </Box>
      </Box>
    </Modal>
  )
}
