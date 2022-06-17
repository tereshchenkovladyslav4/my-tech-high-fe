import { Box, Button, TextField } from '@mui/material'
import React, { useState, useContext } from 'react'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { useStyles } from '../styles'
import { EventType } from '../../types'
import { SYSTEM_05 } from '../../../../../utils/constants'
import { useMutation } from '@apollo/client'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { createEventTypeMutation, updateEventTypeMutation } from '../services'
import { ColorPicker } from '../../components/EditEventType'

type EditEventTypeProps = {
  eventType?: EventType | null
  eventTypeCount?: number
  onCancel: () => void
  onSave: () => void
}

const EditEventType = ({ eventType, eventTypeCount, onCancel, onSave }: EditEventTypeProps) => {
  const classes = useStyles
  const { me } = useContext(UserContext)
  const [eventTypeId, setEventTypeId] = useState<number>(Number(eventType?.id))
  const [name, setName] = useState<string>(eventType?.name || '')
  const [color, setColor] = useState<string>(eventType?.color || '#000000')
  const [submitCreate, {}] = useMutation(createEventTypeMutation)
  const [submitUpdate, {}] = useMutation(updateEventTypeMutation)

  const handleCancelClick = () => {
    setName('')
    setColor('#000000')
    onCancel()
  }
  const handleSaveClick = async () => {
    if (name && color && !eventTypeId) {
      await submitCreate({
        variables: {
          createEventTypeInput: {
            RegionId: Number(me?.selectedRegionId),
            archived: false,
            color: color,
            name: name,
            priority: eventTypeCount,
          },
        },
      })
    } else if (name && color && eventTypeId) {
      await submitUpdate({
        variables: {
          updateEventTypeInput: {
            RegionId: Number(me?.selectedRegionId),
            color: color,
            name: name,
            event_type_id: eventTypeId,
          },
        },
      })
    }
    setName('')
    setColor('#000000')
    onSave()
  }

  return (
    <Box sx={classes.eventTypeBody}>
      <Subtitle size='medium' textAlign='left' fontWeight='700'>
        {eventType ? 'Edit Type' : 'New Type'}
      </Subtitle>
      <TextField
        size='small'
        label='Type Name'
        variant='outlined'
        inputProps={{
          style: { color: 'black' },
        }}
        InputLabelProps={{
          style: { color: SYSTEM_05 },
        }}
        sx={classes.textfield}
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ColorPicker color={color} setColor={setColor} />
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', paddingY: '25px' }}>
        <Button sx={classes.cancelBtn} onClick={() => handleCancelClick()}>
          Cancel
        </Button>
        <Button sx={classes.saveBtn} onClick={() => handleSaveClick()}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default EditEventType
