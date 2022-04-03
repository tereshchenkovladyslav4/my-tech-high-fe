import React, { useState } from 'react'
import { Button, Modal } from '@mui/material'
import { Box } from '@mui/system'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { ApplicationEmailModalType } from './types'
import { useStyles } from './styles'
import moment from 'moment'
import { ArrowDropDown } from '@mui/icons-material'
export const ApplicationEmailModal: ApplicationEmailModalType = ({ handleModem, data, handleSubmit }) => {
  const classes = useStyles
  const [sort, setSort] = useState('')
  const [sortDirection, setSortDirection] = useState('')
  return (
    <Modal
      open={true}
      onClose={() => handleModem()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={classes.modalEmailCard}>
        <Box sx={classes.content}>
          <Box sx={classes.emailRowHead}>
            <Subtitle fontWeight='700' sx={classes.emailLabel}>
              Sent Date <ArrowDropDown sx={{ ml: 2 }} />
            </Subtitle>
            <Subtitle fontWeight='700' sx={{ display: 'flex', alignItems: 'center' }}>
              Subject <ArrowDropDown sx={{ ml: 5 }} />
            </Subtitle>
          </Box>
          {data.slice(0, 5).map((item, index) => (
            <Box sx={classes.emailRow} key={index}>
              <Subtitle fontWeight='700' sx={classes.emailLabel}>
                {moment(item.created_at).format('MM/DD/yy')}
              </Subtitle>
              <Subtitle fontWeight='700'>{item.subject}</Subtitle>
            </Box>
          ))}
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Button variant='contained' disableElevation sx={classes.ok} onClick={handleSubmit}>
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
