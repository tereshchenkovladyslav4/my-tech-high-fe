import { Box, Button, Stack, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { DropDown } from '../../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../../components/DropDown/types'
import { useQuery } from '@apollo/client'
import { getEventTypesQuery } from '../../EditTypeComponent/services'
import { UserContext } from '../../../../../providers/UserContext/UserProvider'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import BulletEditor from './BulletEditor'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { RED } from '../../../../../utils/constants'
import { EditEventComponentProps } from '../../types'
import { useStyles } from '../styles'

const EditEventComponent = ({
  event,
  setEvent,
  invalidOption,
  setInvalidOption,
  setIsChanged,
  handleAddRSVPClick,
}: EditEventComponentProps) => {
  const { me } = useContext(UserContext)
  const classes = useStyles
  const [eventTypes, setEventTypes] = useState<DropDownItem[]>([])
  const { loading, data } = useQuery(getEventTypesQuery, {
    variables: {
      regionId: me?.selectedRegionId,
    },
    skip: me?.selectedRegionId ? false : true,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (!loading && data?.eventTypes) {
      setEventTypes(
        data?.eventTypes
          .filter((item: any) => !item.archived)
          .map((eventType: any) => ({
            label: eventType.name,
            value: `${eventType.event_type_id}`,
          })),
      )
    }
  }, [data])
  return (
    <Stack direction='column' justifyContent='center' alignItems='center' width={'100%'} marginTop={3}>
      <TextField
        name='title'
        label='Title'
        placeholder='Entry'
        fullWidth
        value={event?.title}
        onChange={(e) => {
          setEvent({ ...event, title: e.target.value })
          setIsChanged(true)
          setInvalidOption({ ...invalidOption, title: { status: false, message: '' } })
        }}
        sx={{ my: 1, width: '65%' }}
      />
      {invalidOption?.title.status && (
        <Subtitle size={'small'} sx={{ color: RED, width: '65%' }}>
          {invalidOption?.title.message}
        </Subtitle>
      )}
      <Box sx={{ my: 1, width: '65%' }}>
        <DropDown
          dropDownItems={eventTypes}
          placeholder='Type'
          labelTop
          setParentValue={(value) => {
            setEvent({ ...event, eventTypeId: Number(value) })
            setIsChanged(true)
            setInvalidOption({ ...invalidOption, type: { status: false, message: '' } })
          }}
          size='medium'
          defaultValue={`${event?.eventTypeId}`}
        />
        {invalidOption?.type.status && (
          <Subtitle size={'small'} sx={{ color: RED, width: '65%' }}>
            {invalidOption?.type.message}
          </Subtitle>
        )}
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', width: '65%', my: 1, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'grid' }}>
            <DatePicker
              label='Start Date'
              inputFormat='MM/dd/yyyy'
              value={event?.startDate}
              onChange={(e) => {
                setEvent({ ...event, startDate: e || new Date() })
                setIsChanged(true)
                setInvalidOption({ ...invalidOption, startDate: { status: false, message: '' } })
              }}
              renderInput={(params) => <TextField color='primary' size='small' {...params} />}
            />
            {invalidOption?.startDate.status && (
              <Subtitle size={'small'} sx={{ color: RED, width: '65%' }}>
                {invalidOption?.startDate.message}
              </Subtitle>
            )}
          </Box>
          <Box sx={{ display: 'grid' }}>
            <DatePicker
              label='End Date'
              inputFormat='MM/dd/yyyy'
              value={event?.endDate}
              onChange={(e) => {
                setEvent({ ...event, endDate: e || new Date() })
                setIsChanged(true)
                setInvalidOption({ ...invalidOption, endDate: { status: false, message: '' } })
              }}
              renderInput={(params) => <TextField color='primary' size='small' {...params} />}
            />
            {invalidOption?.endDate.status && (
              <Subtitle size={'small'} sx={{ color: RED, width: '65%' }}>
                {invalidOption?.endDate.message}
              </Subtitle>
            )}
          </Box>
        </Box>
      </LocalizationProvider>
      <TextField
        id='time'
        label='Time'
        type='time'
        size='small'
        defaultValue={event?.time}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 300,
        }}
        sx={{ width: '65%', my: 1 }}
        onChange={(e) => {
          setEvent({ ...event, time: e.target.value })
          setIsChanged(true)
        }}
      />
      <Button
        variant={'outlined'}
        sx={classes.addRSVPButton}
        onClick={() => {
          handleAddRSVPClick()
        }}
      >
        Add RSVP Form
      </Button>
      <Box sx={{ my: 1, width: '65%' }}>
        {!event?.eventId && (
          <BulletEditor
            value={event.description}
            setValue={(value) => {
              setEvent({ ...event, description: value })
              setIsChanged(true)
              setInvalidOption({ ...invalidOption, description: { status: false, message: '' } })
            }}
          />
        )}
        {!!event?.eventId && event?.eventId > 0 && event?.description && (
          <BulletEditor
            value={event.description}
            setValue={(value) => {
              setEvent({ ...event, description: value })
              setIsChanged(true)
              setInvalidOption({ ...invalidOption, description: { status: false, message: '' } })
            }}
          />
        )}
      </Box>
      {invalidOption?.description.status && (
        <Subtitle size={'small'} sx={{ color: RED, width: '65%' }}>
          {invalidOption?.description.message}
        </Subtitle>
      )}
    </Stack>
  )
}

export default EditEventComponent
