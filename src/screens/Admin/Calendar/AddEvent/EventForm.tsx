import React, { useContext, useEffect, useState } from 'react'
import { Box, Button, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useQuery } from '@apollo/client'
import { useFormikContext } from 'formik'
import { DropDown } from '../../../../components/DropDown/DropDown'
import { DropDownItem } from '../../../../components/DropDown/types'
import { getEventTypesQuery } from '../services'
import { UserContext } from '../../../../providers/UserContext/UserProvider'
import { BulletEditor } from '../components/BulletEditor'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { EventFormData, EventFormProps } from '../types'
import { addEventClassess } from './styles'
import { Paragraph } from '../../../../components/Typography/Paragraph/Paragraph'
import { calendarClassess } from '../styles'

const EventForm = ({ setIsChanged, handleAddRSVPClick }: EventFormProps) => {
  const { me } = useContext(UserContext)
  const { errors, handleChange, setFieldValue, touched, values } = useFormikContext<EventFormData>()
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
      <Box sx={{ width: '65%' }}>
        <Subtitle sx={calendarClassess.formError}>{touched.title && errors.title}</Subtitle>
        <TextField
          name='title'
          label='Title'
          placeholder='Entry'
          fullWidth
          value={values?.title}
          onChange={(e) => {
            handleChange(e)
            setIsChanged(true)
          }}
          sx={{ my: 1 }}
          error={touched.title && Boolean(errors.title)}
        />
        <Box sx={{ my: 1 }}>
          <Subtitle sx={calendarClassess.formError}>{touched.eventTypeId && errors.eventTypeId}</Subtitle>
          <DropDown
            dropDownItems={eventTypes}
            placeholder='Type'
            labelTop
            setParentValue={(value) => {
              setFieldValue('eventTypeId', Number(value))
              setIsChanged(true)
            }}
            size='medium'
            defaultValue={values?.eventTypeId}
            error={{ error: touched.eventTypeId && Boolean(errors.eventTypeId), errorMsg: '' }}
          />
        </Box>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box
            sx={{
              display: 'flex',
              my: 1,
              gap: '6px',
              justifyContent: 'space-between',
              alignItems: 'end',
            }}
          >
            <Box sx={{ display: 'grid' }}>
              <Subtitle sx={calendarClassess.formError}>{touched.startDate && errors.startDate}</Subtitle>
              <DatePicker
                label='Start Date'
                inputFormat='MM/dd/yyyy'
                value={values?.startDate}
                onChange={(e) => {
                  setFieldValue('startDate', e)
                  setIsChanged(true)
                }}
                renderInput={(params) => (
                  <TextField
                    color='primary'
                    size='small'
                    {...params}
                    error={touched.startDate && Boolean(errors.startDate)}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: 'grid' }}>
              <Subtitle sx={calendarClassess.formError}>{touched.endDate && errors.endDate}</Subtitle>
              <DatePicker
                label='End Date'
                inputFormat='MM/dd/yyyy'
                value={values?.endDate}
                onChange={(e) => {
                  setFieldValue('endDate', e)
                  setIsChanged(true)
                }}
                renderInput={(params) => (
                  <TextField
                    color='primary'
                    size='small'
                    {...params}
                    error={touched.endDate && Boolean(errors.endDate)}
                  />
                )}
              />
            </Box>
          </Box>
        </LocalizationProvider>
        <Box sx={{ display: 'flex', my: 1, justifyContent: 'start' }}>
          <Box sx={{ display: 'grid', width: '50%' }}>
            <TextField
              id='time'
              label='Time'
              type='time'
              size='small'
              disabled={values?.allDay}
              value={values?.time}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300,
              }}
              sx={{ width: '100%', my: 1 }}
              onChange={(e) => {
                handleChange(e)
                setIsChanged(true)
              }}
            />
          </Box>
          <Box sx={{ display: 'grid', my: 1.5, mx: 1 }}>
            <FormControlLabel
              sx={{ height: 30 }}
              control={
                <Checkbox
                  checked={values?.allDay}
                  value={values?.allDay}
                  onChange={() => {
                    setFieldValue('allDay', !values?.allDay)
                    setIsChanged(true)
                  }}
                />
              }
              label={
                <Paragraph size='large' fontWeight='500' sx={{ marginLeft: '12px' }}>
                  All Day
                </Paragraph>
              }
            />
          </Box>
        </Box>
        <Button
          variant={'outlined'}
          sx={addEventClassess.addRSVPButton}
          onClick={() => {
            handleAddRSVPClick()
          }}
        >
          Add RSVP Form
        </Button>
        <Subtitle sx={calendarClassess.formError}>{touched.description && errors.description}</Subtitle>
        <Box sx={{ my: 1 }}>
          <BulletEditor
            value={values?.description}
            setValue={(value) => {
              console.log(value)
              setFieldValue('description', value)
              setIsChanged(true)
            }}
            error={touched.description && Boolean(errors.description)}
          />
        </Box>
      </Box>
    </Stack>
  )
}

export default EventForm
