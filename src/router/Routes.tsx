/* eslint react/no-children-prop: 0 */

import React, { useContext } from 'react'
import { find } from 'lodash'
import { Redirect, Route, Switch } from 'react-router-dom'
import { MthRoute } from '@mth/enums'
import { QUICKLINK_TYPE } from '../components/QuickLink/QuickLinkCardProps'
import { QuickLinks } from '../components/QuickLink/QuickLinks'
import { UserContext, UserInfo } from '../providers/UserContext/UserProvider'
import { Applications } from '../screens/Applications/Applications'
import { Dashboard } from '../screens/Dashboard/Dashboard'
import { Enrollment } from '../screens/Enrollment/Enrollment'
import { Homeroom } from '../screens/Homeroom/Homeroom'
import { HomeroomStudentProfile } from '../screens/HomeroomStudentProfile/HomeroomStudentProfile'
import { Settings } from '../screens/Settings/Settings'

export const Routes: React.FC = () => {
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo

  return (
    <Switch>
      <Route exact path={MthRoute.DASHBOARD}>
        <Dashboard />
      </Route>
      <Route
        exact
        path={`${MthRoute.HOMEROOM + MthRoute.ENROLLMENT}/:id`}
        children={({ match }) => {
          const currStudent = find(students, { student_id: match?.params.id })
          const packetAccepted = currStudent.packets?.length > 0 && currStudent.packets?.at(-1).status === 'Accepted'
          if (currStudent === undefined) {
            return <Homeroom />
          } else {
            return currStudent.applications.length > 0 && currStudent.applications.at(-1).status === 'Accepted' ? (
              packetAccepted ? (
                <Enrollment id={match?.params.id} disabled={true} />
              ) : (
                <Enrollment id={match?.params.id} disabled={false} />
              )
            ) : (
              <Homeroom />
            )
          }
        }}
      />
      <Route
        exact
        path={`${MthRoute.HOMEROOM}/:id`}
        children={({ match }) => {
          const currStudent = find(students, { student_id: match?.params.id })

          if (currStudent === undefined) {
            return <Homeroom />
          } else {
            return <HomeroomStudentProfile />
          }
        }}
      />
      <Route exact path={MthRoute.HOMEROOM}>
        <Homeroom />
      </Route>
      <Route path={MthRoute.APPLICATIONS}>
        <Applications />
      </Route>
      <Route path={MthRoute.SETTINGS}>
        <Settings />
      </Route>
      <Route
        path={`${MthRoute.PARENT_LINK}${MthRoute.SUBMIT_WITHDRAWAL}/:id`}
        children={({ match }) => {
          return <QuickLinks initialLink={QUICKLINK_TYPE.WITHDRAWAL} studentId={match?.params.id} />
        }}
      />
      <Route path={MthRoute.PARENT_LINK}>
        <QuickLinks />
      </Route>
      <Route render={() => <Redirect to={{ pathname: '/' }} />} />
    </Switch>
  )
}
