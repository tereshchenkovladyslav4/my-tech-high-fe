import React from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { Box, Button, Modal, Typography } from '@mui/material'

type CustomModalProps = {
  title: string
  description: string
  subDescription?: string
  onClose: () => void
  onConfirm: () => void
  confirmStr?: string
  cancelStr?: string
  backgroundColor?: string
}

const useClasses = makeStyles((theme: Theme) => ({
  modalCard: {
    width: '441px',
    [theme.breakpoints.down('xs')]: {
      width: '97% !important',
    },
  },
}))

export const CustomModal: React.FC<CustomModalProps> = ({
  title,
  description,
  subDescription,
  onClose,
  onConfirm,
  confirmStr = 'Confirm',
  cancelStr = 'Cancel',
  backgroundColor = '#EEF4F8',
}) => {
  const classes = useClasses()

  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box
        className={classes.modalCard}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: subDescription ? '550px' : '500px',
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
          <InfoIcon sx={{ fontSize: 50, margin: '20px 0px' }} />
          <Typography>{description}</Typography>
          {subDescription && <Typography>{subDescription}</Typography>}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', gap: '20px' }}>
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
