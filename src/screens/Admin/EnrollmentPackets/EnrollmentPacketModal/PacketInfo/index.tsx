import React, { FunctionComponent } from 'react'
import { Grid } from '@mui/material'
import { Title } from '../../../../../components/Typography/Title/Title'
import { SYSTEM_01 } from '../../../../../utils/constants'
import { Info } from './Info'
import { SignatureComp } from './Signature'

export const EnrollmentPacketInfo: FunctionComponent = () => {
  return (
    <Grid container columnSpacing={5} maxWidth='100%'>
      <Grid item xs={12}>
        <Title color={SYSTEM_01} size='small' fontWeight='700'>
          Packet Info
        </Title>
      </Grid>
      <Grid item xs={12}>
        <Info />
      </Grid>
      {/* <Grid item md={6} xs={12}>
                <SecondaryContact />
            </Grid>
            <Grid item md={6} xs={12}>
                <SchoolInfo />
                <VoluntaryIncomeInfo />
            </Grid>
            <Grid item md={6} xs={12}>
                <RaceInfo />
            </Grid>
            <Grid item md={6} xs={12}>
                <OtherInfo />
            </Grid>
            <Grid item md={6} xs={12}>
                <LanguagesInfo />
            </Grid> */}
      <Grid item md={6} xs={12}>
        <SignatureComp />
      </Grid>
    </Grid>
  )
}
