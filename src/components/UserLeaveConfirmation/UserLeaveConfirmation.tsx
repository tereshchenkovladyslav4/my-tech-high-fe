import ReactDOM from 'react-dom'
import React from 'react'
import { Box, Button, Modal, Typography } from '@mui/material'
import { SYSTEM_01 } from '../../utils/constants'
import { Paragraph } from '../Typography/Paragraph/Paragraph'
import { Subtitle } from '../Typography/Subtitle/Subtitle'
import { useStyles } from './styles'
import InfoIcon from '@mui/icons-material/InfoOutlined'

export const UserLeaveConfirmation = (
  message,
  callback,
  // confirmOpen,
  // setConfirmOpen
) => {
  const container = document.createElement('div')
  const classes = useStyles

  container.setAttribute('custom-confirm-view', '')

  const handleConfirm = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container)
    callback(callbackState)
    // setConfirmOpen(false);
  }

  const handleCancel = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container)
    callback()
    // setConfirmOpen(false);
  }

  document.body.appendChild(container)
  const { header, content, bgColor } = JSON.parse(message)
  ReactDOM.render(
    <Modal open={true}>
      <Box sx={{ ...classes.modalCard, backgroundColor: bgColor }}>
        <Box sx={classes.header as object}>
          <Typography variant='h5' fontWeight={'bold'}>
            {header}
          </Typography>
        </Box>
        <Box sx={classes.content as object}>
          <InfoIcon sx={{ fontSize: 50, margin: '20px 0px' }} />
          <Paragraph size='large' color={SYSTEM_01}>
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
