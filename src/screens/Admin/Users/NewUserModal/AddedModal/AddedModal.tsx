import React from 'react'
import { Button, Modal, Typography } from '@mui/material'
import { Stack } from '@mui/material'
import { Box } from '@mui/system'
import AddedIcon from '@mth/assets/icons/user-added.png'
import { MthColor } from '@mth/enums'
import { useStyles } from './styles'
import { AddedProps } from './types'

export const AddedModal: React.FC<AddedProps> = ({ handleModem }) => {
  const classes = useStyles
  return (
    <Modal
      open={true}
      onClose={() => handleModem('finish')}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalCard}>
        <Typography sx={{ fontWeight: 700, fontSize: 20, textAlign: 'center' }}>New User Added</Typography>
        <Box sx={classes.content as Record<string, unknown>}>
          <img src={AddedIcon} />
          <Typography sx={{ mt: 6.2, fontSize: 14, fontWeight: 500, textAlign: 'center', color: MthColor.SYSTEM_01 }}>
            Do you want to add another user?
          </Typography>
          <Stack sx={{ mt: 4 }} direction='row' justifyContent='center' spacing={3} alignItems='center'>
            <Button
              variant='contained'
              disableElevation
              sx={classes.cancelButton}
              onClick={() => handleModem('finish')}
            >
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: MthColor.SYSTEM_01 }}>Finish</Typography>
            </Button>
            <Button variant='contained' disableElevation sx={classes.submitButton} onClick={() => handleModem('add')}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#F2F2F2' }}>Add User</Typography>
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}
