import React, { FunctionComponent } from 'react'
import { Grid, TextField } from '@mui/material'
import { useFormContext, Controller } from 'react-hook-form'
import { extractContent } from '@mth/utils'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_01 } from '../../../../utils/constants'

export const EnrollmentPacketNotes: FunctionComponent = () => {
  const { control } = useFormContext()
  return (
    <Grid container sx={{ paddingTop: '20px' }}>
      <Grid item md={12} sm={12} xs={12}>
        <Subtitle color={SYSTEM_01} size='medium' fontWeight='700'>
          Packet Notes
        </Subtitle>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Controller
          name='notes'
          control={control}
          render={({ field }) => {
            const value = extractContent(field.value)
            return (
              <TextField
                {...field}
                value={value}
                size='small'
                variant='outlined'
                fullWidth
                multiline
                rows={8}
                sx={{ padding: '10px 0px 20px 0px', width: '70%' }}
              />
            )
          }}
        />
      </Grid>
    </Grid>
  )
}
