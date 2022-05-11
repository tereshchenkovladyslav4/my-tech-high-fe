import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { AnnouncementTable } from './AnnouncementTable'

const Announcemnets = () => {
  const [filter, setFilter] = useState({})
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          <AnnouncementTable />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Announcemnets
