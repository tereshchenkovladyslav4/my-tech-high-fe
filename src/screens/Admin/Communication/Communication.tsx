import React, { FunctionComponent } from 'react'
import { Grid } from '@mui/material'
import announcementImg from '../../../assets/quick-link-blue.png'
import emailRecordImg from '../../../assets/quick-link-orange.png'
import { EMAIL_RECORDS, ANNOUNCEMENTS } from '../../../utils/constants'
import { CommunicationCard } from './components/CommunicationCard/CommunicationCard'

const communicationTiles = [
  {
    title: 'Announcements',
    description: 'Draft, Edit, & Publish',
    link: ANNOUNCEMENTS,
    image: announcementImg,
  },
  {
    title: 'Email Records',
    description: '',
    link: EMAIL_RECORDS,
    image: emailRecordImg,
  },
]
export const Communication: FunctionComponent = () => {
  return (
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4 }}>
      {communicationTiles.map((tile, idx) => (
        <Grid item xs={4} key={idx}>
          <CommunicationCard title={tile.title} link={tile.link} img={tile.image} description={tile.description} />
        </Grid>
      ))}
    </Grid>
  )
}
