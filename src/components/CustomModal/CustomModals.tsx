import React, { ReactNode } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, Modal, Typography } from '@mui/material'
import { customModalClasses } from '@mth/components/CustomModal/styles'
import { commonClasses } from '@mth/styles/common.style'

export type CustomModalType = {
  title: string
  description: string
  subDescription?: string | ReactNode
  onClose: () => void
  onConfirm: () => void
  confirmStr?: string
  cancelStr?: string
  backgroundColor?: string
  showIcon?: boolean
  showCancel?: boolean
}

export const CustomModal: React.FC<CustomModalType> = ({
  title,
  description,
  subDescription,
  onClose,
  onConfirm,
  confirmStr = 'Confirm',
  cancelStr = 'Cancel',
  backgroundColor = '#EEF4F8',
  showIcon = true,
  showCancel = true,
}) => {
  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        sx={{
          ...commonClasses.modalWrap,
          maxWidth: subDescription ? '550px' : '450px',
          backgroundColor: backgroundColor,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontWeight={'bold'}>
            {title}
          </Typography>
          {showIcon && <ErrorOutlineIcon sx={{ fontSize: 50, margin: '20px 0px' }} />}
          {showIcon ? <Typography>{description}</Typography> : <Typography marginTop={4}>{description}</Typography>}
          {subDescription && <Typography>{subDescription}</Typography>}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '30px',
              gap: '40px',
            }}
          >
            {showCancel && (
              <Button sx={customModalClasses.cancelBtn} onClick={onClose}>
                {cancelStr}
              </Button>
            )}
            <Button sx={customModalClasses.confirmBtn} onClick={onConfirm}>
              {confirmStr}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
