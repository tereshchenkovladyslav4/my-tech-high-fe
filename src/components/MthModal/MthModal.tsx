import React from 'react'
import { Close } from '@mui/icons-material'
import { Box, Button, Modal, Typography } from '@mui/material'
import { useStyles } from './styles'
export type CustomModalType = {
  open: boolean
  title?: string
  center?: boolean
  onClose: () => void
  onConfirm: () => void
  confirmStr?: string
  classNameBtnOk?: string
  cancelStr?: string
  backgroundColor?: string
  noCloseOnBackdrop?: boolean
  width?: number
  showBtnClose?: boolean
  showBtnConfirm?: boolean
  showBtnCancel?: boolean
}

export const MthModal: React.FC<CustomModalType> = ({
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
  classNameBtnOk = 'bg-gradient-dark',
  showBtnClose = false,
  showBtnConfirm = true,
  showBtnCancel = true,
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
          width: width ? 'calc(100% - 20px)' : 'auto',
          maxWidth: width ? `${width}px` : 'calc(100% - 20px)',
          ...useStyles.modal,
        }}
      >
        {showBtnClose && (
          <Button className='modal-btn-close' onClick={onClose}>
            <Close color='inherit' />
          </Button>
        )}

        <Box sx={{ textAlign: center ? 'center' : 'left' }}>
          {!!title && (
            <Typography variant='h5' fontWeight={'bold'}>
              {title}
            </Typography>
          )}
          {children}
          {(showBtnCancel || showBtnConfirm) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px', gap: '40px' }}>
              {showBtnCancel && (
                <Button
                  sx={{ ...useStyles.button, fontSize: '12px' }}
                  variant='contained'
                  color='warning'
                  onClick={onClose}
                >
                  {cancelStr}
                </Button>
              )}
              {showBtnConfirm && (
                <Button
                  sx={{ ...useStyles.button, fontSize: '10px' }}
                  color='primary'
                  variant='contained'
                  onClick={onConfirm}
                  className={classNameBtnOk || ''}
                >
                  {confirmStr}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
