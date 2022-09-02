import React, { useState } from 'react'
import { Box, Grid } from '@mui/material'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { ANNOUNCEMENTS } from '../../../utils/constants'
import { Announcement } from '../../Dashboard/Announcements/types'
import { ReadMoreSection } from '../../Dashboard/ReadMoreSection'
import { AnnouncementTable } from './AnnouncementTable'
import { NewAnnouncement } from './NewAnnouncement'

const Announcemnets: React.FC = () => {
  const isExact = useRouteMatch(ANNOUNCEMENTS)?.isExact
  const history = useHistory()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  return (
    <Box sx={{ marginX: 4 }}>
      <Grid container rowSpacing={2}>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}>
          {isExact && <AnnouncementTable setAnnouncement={setAnnouncement} />}
        </Grid>
      </Grid>
      <Switch>
        <Route exact path={`${ANNOUNCEMENTS}/new`}>
          <NewAnnouncement announcement={announcement} setAnnouncement={setAnnouncement} />
        </Route>
        <Route exact path={`${ANNOUNCEMENTS}/edit`}>
          <NewAnnouncement announcement={announcement} setAnnouncement={setAnnouncement} />
        </Route>
        <Route exact path={`${ANNOUNCEMENTS}/view`}>
          <ReadMoreSection
            inProp={false}
            announcement={announcement}
            setSectionName={() => history.push(ANNOUNCEMENTS)}
          />
        </Route>
      </Switch>
    </Box>
  )
}

export default Announcemnets
