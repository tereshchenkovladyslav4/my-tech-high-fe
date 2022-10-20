import React, { ReactNode } from 'react'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { Box, Button, Modal, Typography } from '@mui/material'

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
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: subDescription ? '550px' : '450px',
          height: 'auto',
          bgcolor: backgroundColor,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='h5' fontWeight={'bold'}>
            {title}
          </Typography>
          {showIcon && <InfoIcon sx={{ fontSize: 50, margin: '20px 0px' }} />}
          {showIcon ? <Typography>{description}</Typography> : <Typography marginTop={4}>{description}</Typography>}
          {subDescription && <Typography>{subDescription}</Typography>}
          <Box
            sx={{
              display: 'flex',
              justifyContent: showCancel ? 'space-between' : 'center',
              marginTop: '30px',
              gap: '20px',
            }}
          >
            {showCancel && (
              <Button
                sx={{ width: '160px', height: '36px', background: '#E7E7E7', borderRadius: '50px' }}
                onClick={onClose}
              >
                {cancelStr}
              </Button>
            )}
            <Button
              sx={{
                width: '160px',
                height: '36px',
                background: '#000000',
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
