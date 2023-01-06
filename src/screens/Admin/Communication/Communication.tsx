import React from 'react'
import { Grid } from '@mui/material'
import announcementImg from '@mth/assets/quick-link-blue.png'
import emailRecordImg from '@mth/assets/quick-link-orange.png'
import { MthRoute } from '@mth/enums'
import { CommunicationCard } from './components/CommunicationCard/CommunicationCard'

const communicationTiles = [
  {
    title: 'Announcements',
    description: 'Draft, Edit, & Publish',
    link: MthRoute.ANNOUNCEMENTS.toString(),
    image: announcementImg,
  },
  {
    title: 'Email Records',
    description: '',
    link: MthRoute.EMAIL_RECORDS.toString(),
    image: emailRecordImg,
  },
]
export const Communication: React.FC = () => {
  return (
    <Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 3, marginTop: 4 }}>
      {communicationTiles.map((tile, idx) => (
        <Grid item xs={4} key={idx}>
          <CommunicationCard title={tile.title} link={tile.link} img={tile.image} description={tile.description} />
        </Grid>
      ))}
    </Grid>
  )
}
