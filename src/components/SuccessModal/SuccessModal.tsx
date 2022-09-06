import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import { SYSTEM_01 } from '../../utils/constants'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles, useClasses } from './styles'
import { WarningModalTemplateType } from './types'

export const SuccessModal: WarningModalTemplateType = ({
  title,
  subtitle,
  btntitle = 'Submit',
  handleSubmit,
  showIcon = true,
}) => {
  const classes = useStyles
  const extraClasses = useClasses()
  return (
    <Modal open={true}>
      <Box sx={classes.modalCard} className={extraClasses.modalCard}>
        <Box sx={classes.header as Record<string, unknown>}>
          <Subtitle fontWeight='700'>{title}</Subtitle>
        </Box>
        <Box sx={classes.content as Record<string, unknown>}>
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
