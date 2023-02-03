import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { MthRoute } from '@mth/enums'
import { Communication } from '@mth/screens/Admin/Communication/Communication'
import { Assignments } from '@mth/screens/Admin/HomeRoom/Assignments/Assignments'
import { Records } from '@mth/screens/Admin/Records'

import { Dashboard } from '@mth/screens/Dashboard/Dashboard'
import { Settings } from '../screens/Settings/Settings'

export const TeacherRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path={MthRoute.DASHBOARD}>
        <Dashboard />
      </Route>
      <Route exact path={MthRoute.COMMUNICATION}>
        <Communication />
      </Route>
      <Route path={MthRoute.SETTINGS}>
        <Settings />
      </Route>
      <Route path={MthRoute.RECORDS}>
        <Records />
      </Route>
      <Route exact path={MthRoute.HOMEROOM_ASSIGNMENTS}>
        <Assignments />
      </Route>
    </Switch>
  )
}
