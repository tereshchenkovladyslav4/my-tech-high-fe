import React from 'react'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { Box, Button, Modal, Typography } from '@mui/material'
import { modalClassess } from './styles'

type ConfirmModalProps = {
  title: string
  description: string
  onClose: () => void
  onConfirm: () => void
  confirmStr?: string
  cancelStr?: string
}
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  description,
  onClose,
  onConfirm,
  confirmStr = 'Confirm',
  cancelStr = 'Cancel',
}) => {
  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box sx={modalClassess.body}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontSize={'20px'} fontWeight={'bold'}>
            {title}
          </Typography>
          <InfoIcon sx={{ fontSize: 50, margin: '20px 0px' }} />
          <Typography fontSize={'14px'}>{description}</Typography>
          <Box sx={modalClassess.btnGroup}>
            <Button sx={modalClassess.cancelBtn} onClick={onClose}>
              {cancelStr}
            </Button>
            <Button sx={modalClassess.confirmBtn} onClick={onConfirm}>
              {confirmStr}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
