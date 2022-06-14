import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { WarningModalTemplateType } from './types'
import CloseIcon from '@mui/icons-material/Close'
import { useStyles } from './styles'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { SYSTEM_01 } from '../../utils/constants'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const SuccessModal: WarningModalTemplateType = ({
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
    >
      <Box sx={classes.modalCard}>
        <Box sx={classes.header as object}>
          <Subtitle fontWeight='700'>{title}</Subtitle>
        </Box>
        <Box sx={classes.content as object}>
          {showIcon && <CheckCircleOutlineIcon style={classes.errorOutline} />}
          <Paragraph size='large' color={SYSTEM_01} textAlign='center'>
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
