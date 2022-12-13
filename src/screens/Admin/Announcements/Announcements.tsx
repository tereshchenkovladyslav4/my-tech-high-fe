import React, { useState } from 'react'
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom'
import { Layout } from '@mth/components/Layout'
import { ANNOUNCEMENTS } from '../../../utils/constants'
import { Announcement } from '../../Dashboard/Announcements/types'
import { ReadMoreSection } from '../../Dashboard/ReadMoreSection'
import { AnnouncementTable } from './AnnouncementTable'
import { NewAnnouncement } from './NewAnnouncement'

const Announcements: React.FC = () => {
  const isExact = useRouteMatch(ANNOUNCEMENTS)?.isExact
  const history = useHistory()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  return (
    <Layout>
      {isExact && <AnnouncementTable setAnnouncement={setAnnouncement} />}
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
    </Layout>
  )
}

export default Announcements
