import React from 'react'
import { Grid, TextField } from '@mui/material'
import { useFormikContext } from 'formik'
import { Subtitle } from '../../../../components/Typography/Subtitle/Subtitle'
import { SYSTEM_01 } from '../../../../utils/constants'
import { EnrollmentPacketFormType } from './types'


export default function EnrollmentPacketNotes({ textRef }) {
  const { values: { notes }, handleChange } = useFormikContext<EnrollmentPacketFormType>()

  return (
    <Grid container sx={{ paddingTop: '20px' }}>
      <Grid item md={12} sm={12} xs={12}>
        <Subtitle color={SYSTEM_01} size='medium' fontWeight='700'>
          Packet Notes
        </Subtitle>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          inputRef={textRef}
          size='small'
          variant='outlined'
          fullWidth
          value={notes}
          name="notes"
          onChange={handleChange}
          multiline
          rows={8}
          sx={{ padding: '10px 0px 20px 0px', width: '70%' }}
        />
      </Grid>
    </Grid>
  )
}
