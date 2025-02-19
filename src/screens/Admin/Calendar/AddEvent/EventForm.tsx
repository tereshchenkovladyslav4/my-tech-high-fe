import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { Box, Button, Stack, TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useFormikContext } from 'formik'
import { DropDown } from '@mth/components/DropDown/DropDown'
import { DropDownItem } from '@mth/components/DropDown/types'
import { MthBulletEditor } from '@mth/components/MthBulletEditor'
import { MthCheckbox } from '@mth/components/MthCheckbox'
import { Subtitle } from '@mth/components/Typography/Subtitle/Subtitle'
import { UserContext } from '@mth/providers/UserContext/UserProvider'
import { getEventTypesQuery } from '../services'
import { calendarClassess } from '../styles'
import { EventFormData, EventFormProps } from '../types'
import { addEventClassess } from './styles'

const EventForm: React.FC<EventFormProps> = ({ setIsChanged, handleAddRSVPClick }) => {
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
          .filter((item: { archived: boolean }) => !item.archived)
          .map((eventType: { name: string; event_type_id: number }) => ({
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
          <MthCheckbox
            label='All Day'
            checked={values?.allDay}
            onChange={() => {
              setFieldValue('allDay', !values?.allDay)
              setIsChanged(true)
            }}
          />
        </Box>
        <Subtitle sx={calendarClassess.formError}>{touched.description && errors.description}</Subtitle>
        <Box sx={{ my: 1 }}>
          <MthBulletEditor
            value={values?.description}
            setValue={(value) => {
              setFieldValue('description', value)
              setIsChanged(true)
            }}
            error={touched.description && Boolean(errors.description)}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <MthCheckbox
            label='Add RSVP'
            checked={values?.hasRSVP}
            onChange={() => {
              setFieldValue('hasRSVP', !values?.hasRSVP)
              setIsChanged(true)
            }}
          />
          {values?.hasRSVP && (
            <Button sx={addEventClassess.RSVPBtn} onClick={handleAddRSVPClick}>
              Edit RSVP
            </Button>
          )}
        </Box>
      </Box>
    </Stack>
  )
}

export default EventForm
