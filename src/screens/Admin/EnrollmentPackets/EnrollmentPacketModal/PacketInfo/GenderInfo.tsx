import React, { FunctionComponent } from 'react'
import { Checkbox, Grid } from '@mui/material'
import { Box } from '@mui/system'
import { Controller, useFormContext } from 'react-hook-form'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'

export const GenderInfo: FunctionComponent = () => {
  const { control } = useFormContext()
  return (
    <Controller
      name='gender'
      control={control}
      render={({ field }) => (
        <Box sx={{ paddingTop: '15px', width: '20rem' }}>
          <Subtitle size='small' fontWeight='700'>
            Gender
          </Subtitle>
          <Grid container sx={{ paddingTop: '15px' }}>
            <Grid item xs={6}>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={field.value === 'Male' ? true : false}
                  onChange={(v) => v && field.onChange('Male')}
                />
                <Subtitle size='small'>Male</Subtitle>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={field.value === 'Non Binary' ? true : false}
                  onChange={(v) => v && field.onChange('Non Binary')}
                />
                <Subtitle size='small'>Non Binary</Subtitle>
              </Box>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={field.value === 'Female' ? true : false}
                  onChange={(v) => v && field.onChange('Female')}
                />
                <Subtitle size='small'>Female</Subtitle>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display='flex' alignItems='center'>
                <Checkbox
                  checked={field.value === 'Undeclared' ? true : false}
                  onChange={(v) => v && field.onChange('Undeclared')}
                />
                <Subtitle size='small'>Undeclared </Subtitle>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
    />
  )
}
