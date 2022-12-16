import React from 'react'
import { Grid } from '@mui/material'
import { Title } from '@mth/components/Typography/Title/Title'
import { MthColor } from '@mth/enums'
import { Info } from './Info'
import { SignatureComp } from './Signature'

export const EnrollmentPacketInfo: React.FC = () => {
  return (
    <Grid container columnSpacing={5} maxWidth='100%'>
      <Grid item xs={12}>
        <Title color={MthColor.SYSTEM_01} size='small' fontWeight='700'>
          Packet Info
        </Title>
      </Grid>
      <Grid item xs={12}>
        <Info />
      </Grid>
      <Grid item md={6} xs={12}>
        <SignatureComp />
      </Grid>
    </Grid>
  )
}
