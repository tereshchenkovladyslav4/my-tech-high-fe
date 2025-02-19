import React, { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { Box, Button, TextField } from '@mui/material'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { MthColor } from '@mth/enums'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { ColorPicker } from '../../components/ColorPicker'
import { createEventTypeMutation, updateEventTypeMutation } from '../../services'
import { EventType } from '../../types'
import { eventTypeClassess } from '../styles'

type NewTypeProps = {
  eventType?: EventType | null
  eventTypeCount?: number
  onCancel: () => void
  onSave: () => void
}

const NewType: React.FC<NewTypeProps> = ({ eventType, eventTypeCount, onCancel, onSave }) => {
  const { me } = useContext(UserContext)
  const [eventTypeId] = useState<number>(Number(eventType?.id))
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
    <Box sx={eventTypeClassess.eventTypeBody}>
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
          style: { color: MthColor.SYSTEM_05 },
        }}
        sx={eventTypeClassess.textfield}
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ColorPicker color={color} setColor={setColor} />
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', paddingY: '25px' }}>
        <Button sx={eventTypeClassess.cancelBtn} onClick={() => handleCancelClick()}>
          Cancel
        </Button>
        <Button sx={eventTypeClassess.saveBtn} onClick={() => handleSaveClick()}>
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default NewType
