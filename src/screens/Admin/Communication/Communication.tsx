import { Grid } from '@mui/material'
import React from 'react'
import { EMAIL_RECORDS } from '../../../utils/constants'
import { CommunicationCard } from './components/CommunicationCard/CommunicationCard'
import emailRecordImg from '../../../assets/applications.png'
export default function Communication() {
  return (
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4 }}>
      <Grid item xs={4}>
        <CommunicationCard title='Email Records' link={EMAIL_RECORDS} img={emailRecordImg} />
      </Grid>      
    </Grid>
  )
}
