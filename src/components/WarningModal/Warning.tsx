import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { WarningModalTemplateType } from './types'
import CloseIcon from '@mui/icons-material/Close'
import { useStyles } from './styles'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { SYSTEM_01 } from '../../utils/constants'

export const WarningModal: WarningModalTemplateType = ({
  handleModem,
  title,
  subtitle,
  btntitle = 'Submit',
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
        <Box sx={classes.header as object}>
          <Subtitle fontWeight='700'>{title}</Subtitle>
          <CloseIcon onClick={() => handleModem()} style={classes.close} />
        </Box>
        <Box sx={classes.content as object}>
          {showIcon && <ErrorOutlineIcon style={classes.errorOutline} />}
          <Paragraph size='large' color={SYSTEM_01}>
            {subtitle}
          </Paragraph>
          <Button variant='contained' disableElevation sx={classes.submitButton} onClick={handleSubmit}>
            {btntitle}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
