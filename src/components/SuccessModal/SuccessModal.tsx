import React from 'react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import { MthColor } from '@mth/enums'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles, useClasses } from './styles'
import { WarningModalProps } from './types'

export const SuccessModal: React.FC<WarningModalProps> = ({
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
          {subtitle && typeof subtitle == 'string' ? (
            <Paragraph size='large' color={MthColor.SYSTEM_01} textAlign='center'>
              {subtitle}
            </Paragraph>
          ) : (
            <>{subtitle}</>
          )}
          <Button variant='contained' disableElevation sx={classes.submitButton} onClick={handleSubmit}>
            {btntitle}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
