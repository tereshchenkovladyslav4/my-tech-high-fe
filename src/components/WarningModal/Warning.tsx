import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Button, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SYSTEM_01 } from '../../utils/constants'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { useStyles } from './styles'
import { WarningModalProps } from './types'

export const WarningModal: React.FC<WarningModalProps> = ({
  handleModem,
  title,
  subtitle,
  btntitle = 'Submit',
  canceltitle = '',
  handleSubmit,
  showIcon = true,
  children,
  textCenter,
}) => {
  const classes = useStyles()
  return (
    <Modal
      open={true}
      onClose={handleModem}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className={classes.modalCard}>
        <Box className={classes.header}>
          <Typography variant='h5' fontSize={'20px'} fontWeight={'bold'}>
            {title}
          </Typography>
        </Box>
        <Box className={classes.content}>
          {showIcon && <ErrorOutlineIcon className={classes.errorOutline} />}
          <Paragraph
            size='large'
            fontWeight='600'
            color={SYSTEM_01}
            sx={{ textAlign: textCenter ? 'center' : 'left', mt: showIcon ? '0' : '56px' }}
          >
            {subtitle}
          </Paragraph>
          {children}
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
            {canceltitle != '' && (
              <Button variant='contained' disableElevation className={classes.button} onClick={handleModem}>
                {canceltitle}
              </Button>
            )}
            <Button variant='contained' disableElevation className={classes.submit} onClick={handleSubmit}>
              {btntitle}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
