import { Box, Card, Grid } from '@mui/material'
import React, { useState } from 'react'
import { useStyles } from './styles'
import { CalendarComponent } from '../CalendarComponent'
import { HeaderComponent } from '../HeaderComponent'
import { EventComponent } from '../EventComponent'

const MainComponent = () => {
  const classes = useStyles
  const [searchField, setSearchField] = useState<string>()

  return (
    <Card sx={classes.cardBody}>
      <HeaderComponent searchField={searchField} setSearchField={setSearchField} />
      <Box sx={{ width: '100%', padding: 3 }}>
        <Grid container justifyContent='space-between'>
          <Grid xs={3} sx={{ textAlign: 'left', marginTop: 'auto', marginBottom: 'auto' }}>
            <EventComponent />
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={8}>
            <CalendarComponent />
          </Grid>
        </Grid>
      </Box>
    </Card>
  )
}

export default MainComponent
