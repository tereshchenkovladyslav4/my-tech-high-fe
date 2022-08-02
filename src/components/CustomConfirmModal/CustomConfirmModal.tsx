import React, { FunctionComponent } from 'react'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Button, Modal } from '@mui/material'
import { SYSTEM_01 } from '../../utils/constants'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles } from './styles'

type CustomConfirmModalType = {
  header: string
  content: string
  confirmBtnTitle: string
  handleConfirmModalChange: (val: boolean, isOk: boolean) => void
}

export const CustomConfirmModal: FunctionComponent<CustomConfirmModalType> = ({
  header,
  content,
  confirmBtnTitle = 'Yes',
  handleConfirmModalChange,
}) => {
  const classes = useStyles

  const handleConfirm = () => {
    handleConfirmModalChange(false, true)
  }

  const handleCancel = () => {
    handleConfirmModalChange(false, false)
  }

  return (
    <Modal open={true}>
      <Box sx={classes.modalCard}>
        <Box sx={classes.header as Record<string, unknown>}>
          <Subtitle fontWeight='700'>{header}</Subtitle>
        </Box>
        <Box sx={classes.content as Record<string, unknown>}>
          <ErrorOutlineIcon style={classes.errorOutline} />
          <Paragraph size='large' color={SYSTEM_01} textAlign='center'>
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
