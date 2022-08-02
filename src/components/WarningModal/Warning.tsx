import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Button, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { SYSTEM_01 } from '../../utils/constants'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { useStyles } from './styles'
import { WarningModalTemplateType } from './types'

export const WarningModal: WarningModalTemplateType = ({
  handleModem,
  title,
  subtitle,
  btntitle = 'Submit',
  canceltitle = '',
  handleSubmit,
  showIcon = true,
}) => {
  const classes = useStyles
  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Box sx={classes.header as Record<string, unknown>}>
          <Typography variant='h5' fontSize={'20px'} fontWeight={'bold'}>
            {title}
          </Typography>
        </Box>
        <Box sx={classes.content as Record<string, unknown>}>
          {showIcon && <ErrorOutlineIcon style={classes.errorOutline} />}
          <Paragraph size='large' fontWeight='600' color={SYSTEM_01}>
            {subtitle}
          </Paragraph>
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
            {canceltitle != '' && (
              <Button variant='contained' disableElevation sx={classes.button} onClick={handleModem}>
                {canceltitle}
              </Button>
            )}
            <Button variant='contained' disableElevation sx={classes.submit} onClick={handleSubmit}>
              {btntitle}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
