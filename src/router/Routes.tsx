import { find } from 'lodash'
import React, { FunctionComponent, useContext, useEffect, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import { QuickLinks } from '../components/QuickLink/QuickLinks'
import { UserContext, UserInfo } from '../providers/UserContext/UserProvider'
import { AdminDashboard } from '../screens/Admin/Dashboard/AdminDashboard'
import AdminEnrollment from '../screens/Admin/Enrollment/Enrollment'
import { Users } from '../screens/Admin/Users/Users'
import { Applications } from '../screens/Applications/Applications'
import { Dashboard } from '../screens/Dashboard/Dashboard'
import { Enrollment } from '../screens/Enrollment/Enrollment'
import { Homeroom } from '../screens/Homeroom/Homeroom'
import { HomeroomStudentProfile } from '../screens/HomeroomStudentProfile/HomeroomStudentProfile'
import { StudentType } from '../screens/HomeroomStudentProfile/Student/types'
import { Settings } from '../screens/Settings/Settings'
import { APPLICATIONS, DASHBOARD, ENROLLMENT, HOMEROOM, PARENT_LINK, SETTINGS, USERS } from '../utils/constants'

export const Routes: FunctionComponent = () => {
  const { me } = useContext(UserContext)
  const { students } = me as UserInfo
  const [isSuper, setIsSuper] = useState(null)

  return (
    <Switch>
      <Route exact path={DASHBOARD}>
        {isSuper ? <AdminDashboard /> : <Dashboard />}
      </Route>
      <Route
        exact
        path={`${HOMEROOM + ENROLLMENT}/:id`}
        children={({ match }) => {
          const currStudent = find(students, { student_id: match?.params.id })
          const packetAccepted = currStudent.packets?.length > 0 && currStudent.packets?.at(-1).status === 'Accepted'
          const packetSubmitted = currStudent.packets?.length > 0 && currStudent.packets?.at(-1).status === 'Submitted'
          const packetStarted = currStudent.packets?.length > 0 && currStudent.packets?.at(-1).status === 'Started'
          if (currStudent === undefined) {
            return <Homeroom />
          } else {
            return currStudent.applications.length > 0 && currStudent.applications.at(-1).status === 'Accepted' ? (
              packetAccepted ? (
                <Enrollment id={match?.params.id} disabled={true}  />
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
        path={`${HOMEROOM}/:id`}
        children={({ match }) => {
          const currStudent = find(students, { student_id: match?.params.id })

          if (currStudent === undefined) {
            return <Homeroom />
          } else {
            return <HomeroomStudentProfile />
          }
        }}
      />
      <Route path={HOMEROOM}>
        <Homeroom />
      </Route>
      <Route path={ENROLLMENT}>
        <AdminEnrollment />
      </Route>
      <Route path={APPLICATIONS}>
        <Applications />
      </Route>
      <Route path={USERS}>
        <Users />
      </Route>
      <Route path={SETTINGS}>
        <Settings />
      </Route>
      <Route path={PARENT_LINK}>
        <QuickLinks />
      </Route>
    </Switch>
  )
}
