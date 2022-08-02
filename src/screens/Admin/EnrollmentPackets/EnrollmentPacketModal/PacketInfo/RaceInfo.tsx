import React, { FunctionComponent } from 'react'
import { Checkbox, Grid, TextField } from '@mui/material'
import { Box } from '@mui/system'
import { Controller, useFormContext } from 'react-hook-form'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'

const RacesTypes = {
  asian: 'Asian',
  american_indian_alaska: 'American Indian or Alaska Native',
  white: 'White',
  black_american: 'Black or African American',
  hawaiian: 'Native Hawaiian or Other Pacific Islander',
  undeclared: 'Undeclared',
}

export const RaceInfo: FunctionComponent = () => {
  const { control } = useFormContext()

  return (
    <Box sx={{ paddingTop: '15px' }}>
      <Subtitle size='small' fontWeight='700'>
        Race
      </Subtitle>
      <Controller
        name='race'
        control={control}
        render={({ field }) => (
          <Grid container sx={{ paddingTop: '15px' }}>
            <Grid item xs={6}>
              <Box display='flex' alignItems='center'>
                <Checkbox checked={field.value === RacesTypes.asian} onClick={() => field.onChange(RacesTypes.asian)} />
                <Subtitle size='small'>Asian</Subtitle>
              </Box>

              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={field.value === RacesTypes.black_american}
                  onClick={() => field.onChange(RacesTypes.black_american)}
                />
                <Subtitle size='small'>Black or African American</Subtitle>
              </Box>

              <Box display='flex' alignItems='center'>
                <Checkbox checked={field.value === RacesTypes.white} onClick={() => field.onChange(RacesTypes.white)} />
                <Subtitle size='small'>White</Subtitle>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={field.value === RacesTypes.american_indian_alaska}
                  onClick={() => field.onChange(RacesTypes.american_indian_alaska)}
                />
                <Subtitle size='small'>American Indian or Alaska Native</Subtitle>
              </Box>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={field.value === RacesTypes.hawaiian}
                  onClick={() => field.onChange(RacesTypes.hawaiian)}
                />
                <Subtitle size='small'>Native Hawaiian or Other Pacific Islander </Subtitle>
              </Box>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={field.value === RacesTypes.undeclared}
                  onClick={() => field.onChange(RacesTypes.undeclared)}
                />
                <Subtitle size='small'>Undeclared</Subtitle>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={!Object.values(RacesTypes).includes(field.value)}
                  onClick={() => field.onChange('')}
                />
                <Subtitle size='small'>Other </Subtitle>
                <TextField
                  sx={{ width: '300px', paddingLeft: 4 }}
                  placeholder='Other'
                  size='small'
                  variant='outlined'
                  fullWidth
                  disabled={Object.values(RacesTypes).includes(field.value)}
                  name='race'
                  value={Object.values(RacesTypes).includes(field.value) ? '' : field.value}
                  onChange={field.onChange}
                />
              </Box>
            </Grid>
          </Grid>
        )}
      />
    </Box>
  )
}
