import React from 'react'
import { Box, Button, Modal, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'

export default function CustomModal({
  title,
  description,
  onClose,
  onConfirm,
  confirmStr = 'Confirm',
  cancelStr = 'Cancel',
}: {
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
  confirmStr?: string
  cancelStr?: string
}) {
  return (
    <Modal open={true} aria-labelledby='child-modal-title' aria-describedby='child-modal-description'>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '441px',
          height: 'auto',
          bgcolor: '#EEF4F8',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5'>{title}</Typography>
          <InfoIcon sx={{ fontSize: 50, margin: '20px 0px' }} />
          <Typography>{description}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <Button
              sx={{ width: '160px', height: '36px', background: '#E7E7E7', borderRadius: '50px' }}
              onClick={onClose}
            >
              {cancelStr}
            </Button>
            <Button
              sx={{
                width: '160px',
                height: '36px',
                background: '#43484F',
                borderRadius: '50px',
                color: 'white',
              }}
              onClick={onConfirm}
            >
              {confirmStr}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
