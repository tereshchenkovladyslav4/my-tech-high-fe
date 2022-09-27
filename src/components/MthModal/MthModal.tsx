import React, { FunctionComponent } from 'react'
import { Box, Button, Modal, Typography } from '@mui/material'

export type CustomModalType = {
  open: boolean
  title?: string
  center?: boolean
  onClose: () => void
  onConfirm: () => void
  confirmStr?: string
  cancelStr?: string
  backgroundColor?: string
  noCloseOnBackdrop?: boolean
  width?: number
}

export const MthModal: FunctionComponent<CustomModalType> = ({
  open,
  title,
  center = false,
  onClose,
  onConfirm,
  confirmStr = 'Confirm',
  cancelStr = 'Cancel',
  children,
  noCloseOnBackdrop = false,
  width,
}) => {
  const onBackdropClick = () => {
    if (!noCloseOnBackdrop) onClose()
  }
  return (
    <Modal
      open={open}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
      onBackdropClick={onBackdropClick}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: 'auto',
          borderRadius: 2,
          bgcolor: 'white',
          p: 4,
          maxHeight: 'calc(100vh - 20px)',
          width: width ? 'calc(100% - 20px)' : 'auto',
          maxWidth: width ? `${width}px` : 'calc(100% - 20px)',
          overflow: 'auto',
        }}
      >
        <Box sx={{ textAlign: center ? 'center' : 'left' }}>
          {!!title && (
            <Typography variant='h5' fontWeight={'bold'}>
              {title}
            </Typography>
          )}
          {children}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '40px' }}>
            <Button
              sx={{ width: '160px', height: '36px', borderRadius: '50px' }}
              variant='contained'
              color='secondary'
              onClick={onClose}
            >
              {cancelStr}
            </Button>
            <Button
              sx={{
                width: '160px',
                height: '36px',
                borderRadius: '50px',
              }}
              color='primary'
              variant='contained'
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
