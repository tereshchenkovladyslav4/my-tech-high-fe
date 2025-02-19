import React, { useState } from 'react'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import moment, { Moment } from 'moment'
import { MthColor } from '@mth/enums'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from './styles'

type PublishModalProps = {
  onClose: () => void
  onPublish: () => void
  onRepublish: () => void
  onSchedule: () => void
  setCronJobTime: (value: Date) => void
  scheduledTime?: Date
}
export const PublishModal: React.FC<PublishModalProps> = ({
  onClose,
  onPublish,
  onSchedule,
  setCronJobTime,
  scheduledTime,
}) => {
  const classes = useStyles

  const [dateTime, setDateTime] = useState<Date | Moment>(scheduledTime ? moment(scheduledTime).local() : new Date())
  const [hours, setHours] = useState(
    scheduledTime ? moment(scheduledTime).format('HH:mm') : moment(new Date()).format('HH:mm'),
  )
  const [invalidTime, setInvalidTime] = useState<boolean>(false)

  const handleSchedule = () => {
    if (dateTime && dateTime > new Date()) {
      onSchedule()
    } else {
      setInvalidTime(true)
    }
  }

  const handleTimeChange = (value: string) => {
    setHours(value)
    const selectedDate = new Date(dateTime as Date).setHours(
      Number(value.split(':')[0]),
      Number(value.split(':')[1]),
      0,
      0,
    )
    setDateTime(new Date(selectedDate))
    setCronJobTime(new Date(selectedDate))
    setInvalidTime(false)
  }

  return (
    <Modal
      open={true}
      aria-labelledby='child-modal-title'
      disableAutoFocus={true}
      aria-describedby='child-modal-description'
    >
      <Box sx={classes.modalContainer}>
        <Box sx={classes.modalBody}>
          <Typography variant='h5' fontWeight={'bold'}>
            Publish
          </Typography>
          <InfoIcon sx={classes.modalIcon} />
          <Typography>Do you want to publish this announcement now?</Typography>
          <Box sx={classes.buttonGroup}>
            <Button sx={classes.cancelBtn} onClick={onClose}>
              Cancel
            </Button>
            <Button sx={classes.publishBtn} onClick={onPublish}>
              Publish
            </Button>
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={classes.scheduleContainer}>
              <Box sx={{ width: 220, px: 3, mt: 2 }}>
                <DatePicker
                  label='Date'
                  disablePast
                  inputFormat='MM/dd/yyyy'
                  value={dateTime}
                  onChange={(e) => {
                    setDateTime(e || new Date())
                    setCronJobTime(new Date(e || ''))
                    setInvalidTime(false)
                  }}
                  renderInput={(params) => <TextField color='primary' size='small' {...params} />}
                />
              </Box>
              <Box sx={{ width: 220, px: 3, mt: 2 }}>
                <TextField
                  id='time'
                  label='Time'
                  type='time'
                  size='small'
                  value={hours}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    step: 300,
                  }}
                  sx={{ width: 150 }}
                  onChange={(e) => handleTimeChange(e.target.value)}
                />
              </Box>
              <Box sx={{ width: 220, px: 3, mt: 2 }}>
                <Button sx={classes.scheduleSendBtn} onClick={handleSchedule}>
                  Schedule Send
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
          {invalidTime && (
            <Box sx={{ textAlign: 'center' }}>
              <Subtitle size='small' color={MthColor.RED} fontWeight='700'>
                Please select future time.
              </Subtitle>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  )
}
