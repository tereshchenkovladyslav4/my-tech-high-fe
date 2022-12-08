import React from 'react'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { Box, Button, Modal, Typography } from '@mui/material'
import ReactDOM from 'react-dom'
import { SYSTEM_01 } from '../../utils/constants'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { useStyles } from './styles'

type MessageType = {
  header: string
  content: string
  bgColor: string
}
type Callback = (_: unknown) => void

export const UserLeaveConfirmation = (
  message: MessageType,
  callback: Callback,
  // confirmOpen,
  // setConfirmOpen
): void => {
  const container = document.createElement('div')
  const classes = useStyles

  container.setAttribute('custom-confirm-view', '')

  const handleConfirm = (callbackState: unknown) => {
    ReactDOM.unmountComponentAtNode(container)
    callback(callbackState)
    // setConfirmOpen(false);
  }

  const handleCancel = () => {
    ReactDOM.unmountComponentAtNode(container)
    callback()
    // setConfirmOpen(false);
  }

  document.body.appendChild(container)
  const { header, content, bgColor } = JSON.parse(message)
  ReactDOM.render(
    <Modal open={true}>
      <Box sx={{ ...classes.modalCard, backgroundColor: bgColor }}>
        <Box sx={classes.header as Record<string, unknown>}>
          <Typography variant='h5' fontWeight={'bold'}>
            {header}
          </Typography>
        </Box>
        <Box sx={classes.content as Record<string, unknown>}>
          <InfoIcon sx={{ fontSize: 50, margin: '20px 0px' }} />
          <Paragraph size='large' color={SYSTEM_01} sx={{ textAlign: 'center' }}>
            {content}
          </Paragraph>
          <Box display='flex' flexDirection='row'>
            <Button variant='contained' disableElevation sx={classes.cancelButton} onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant='contained' disableElevation sx={classes.submitButton} onClick={handleConfirm}>
              Yes
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>,

    container,
  )
}
