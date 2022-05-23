import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AnnouncementTable } from './AnnouncementTable'
import { NewAnnouncement } from './NewAnnouncement'
import { ANNOUNCEMENTS } from '../../../utils/constants'
import { AnnouncementType } from './types'

const Announcemnets = () => {
  const [page, setPage] = useState<string>('root')
  const [announcement, setAnnouncement] = useState<AnnouncementType>()
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          {page == 'root' && <AnnouncementTable setPage={setPage} setAnnouncement={setAnnouncement} />}
        </Grid>
      </Grid>
      <Switch>
        <Route exact path={`${ANNOUNCEMENTS}/new`}>
          <NewAnnouncement setPage={setPage} />
        </Route>
        <Route exact path={`${ANNOUNCEMENTS}/edit`}>
          <NewAnnouncement setPage={setPage} announcement={announcement} setAnnouncement={setAnnouncement} />
        </Route>
      </Switch>
    </Box>
  )
}

export default Announcemnets
