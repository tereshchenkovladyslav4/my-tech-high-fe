import React from 'react'
import { Close } from '@mui/icons-material'
import { Box, Button, Modal, Typography } from '@mui/material'
import { MthButtonType } from '@mth/models'
import { mthButtonClasses } from '@mth/styles/button.style'
import { useStyles } from './styles'
export type CustomModalType = {
  open: boolean
  title?: string
  center?: boolean
  onClose: () => void
  onConfirm: () => void
  confirmStr?: string
  confirmBtnType?: MthButtonType
  cancelStr?: string
  cancelBtnType?: MthButtonType
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
  confirmBtnType = 'roundSmallDark',
  cancelBtnType = 'roundSmallGray',
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
                <Button sx={{ ...useStyles.button, ...mthButtonClasses[cancelBtnType] }} onClick={onClose}>
                  {cancelStr}
                </Button>
              )}
              {showBtnConfirm && (
                <Button sx={{ ...useStyles.button, ...mthButtonClasses[confirmBtnType] }} onClick={onConfirm}>
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
