import React from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, Modal } from '@mui/material'
import { MthColor } from '@mth/enums'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles } from './styles'

type CustomConfirmModalType = {
  header: string
  content: string
  confirmBtnTitle?: string
  maxWidth?: number
  height?: number
  padding?: string
  handleConfirmModalChange: (isOk: boolean) => void
}

export const CustomConfirmModal: React.FC<CustomConfirmModalType> = ({
  header,
  content,
  confirmBtnTitle = 'Yes',
  maxWidth = 441,
  height = 295,
  padding = '32px',
  handleConfirmModalChange,
}) => {
  const classes = useStyles

  const handleConfirm = () => {
    handleConfirmModalChange(true)
  }

  const handleCancel = () => {
    handleConfirmModalChange(false)
  }

  return (
    <Modal open={true}>
      <Box sx={{ ...classes.modalCard, maxWidth: maxWidth, height: height, paddingX: padding }}>
        <Box sx={classes.header}>
          <Subtitle fontWeight='700'>{header}</Subtitle>
        </Box>
        <Box sx={classes.content}>
          <ErrorOutlineIcon style={classes.errorOutline} />
          <Paragraph size='large' color={MthColor.SYSTEM_01} textAlign='center'>
            {content}
          </Paragraph>
          <Box display='flex' flexDirection='row'>
            <Button variant='contained' disableElevation sx={classes.cancelButton} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' disableElevation sx={classes.submitButton} onClick={handleConfirm}>
              {confirmBtnTitle}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}
