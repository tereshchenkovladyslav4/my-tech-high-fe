import React from 'react'
import { Box, Button, Modal, Typography } from '@mui/material'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { useStyles } from './styles'

export default function ConfirmModal({
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
  const classess = useStyles
  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box sx={classess.body}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontSize={'20px'} fontWeight={'bold'}>
            {title}
          </Typography>
          <InfoIcon sx={{ fontSize: 50, margin: '20px 0px' }} />
          <Typography fontSize={'14px'}>{description}</Typography>
          <Box sx={classess.btnGroup}>
            <Button sx={classess.cancelBtn} onClick={onClose}>
              {cancelStr}
            </Button>
            <Button sx={classess.confirmBtn} onClick={onConfirm}>
              {confirmStr}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
