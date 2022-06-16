import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { AnnouncementTable } from './AnnouncementTable'
import { NewAnnouncement } from './NewAnnouncement'
import { ANNOUNCEMENTS } from '../../../utils/constants'
import { AnnouncementType } from './types'
import { ReadMoreSection } from '../../Dashboard/ReadMoreSection'

const Announcemnets = () => {
  const { isExact } = useRouteMatch(ANNOUNCEMENTS)
  const history = useHistory()
  const [announcement, setAnnouncement] = useState<AnnouncementType>()
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
          <NewAnnouncement />
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
