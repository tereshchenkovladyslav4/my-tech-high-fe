import React, { FunctionComponent, useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AdminDashboard } from '../screens/Admin/Dashboard/AdminDashboard'
import {
  APPLICATIONS,
  DASHBOARD,
  ENROLLMENT,
  ENROLLMENT_PACKETS,
  SETTINGS,
  USERS,
  SITEMANAGEMENT,
  EMAILTEMPLATES,SITE_MANAGEMENT
} from '../utils/constants'
// import { APPLICATIONS, DASHBOARD, ENROLLMENT, ENROLLMENT_PACKETS, SETTINGS, USERS, SITE_MANAGEMENT } from '../utils/constants'
import Enrollment from '../screens/Admin/Enrollment/Enrollment'
import { Applications } from '../screens/Admin/Applications/Applications'
import { EnrollmentPackets } from '../screens/Admin/EnrollmentPackets/EnrollmentPackets'
import { Users } from '../screens/Admin/Users/Users'
import { EnrollmentPacketView } from '../screens/Admin/EnrollmentPackets/EnrollmentPacketView/EnrollmentPacketView'
import { UserProfile } from '../screens/Admin/UserProfile/UserProfile'
import AdminSettings from '../screens/Admin/Settings/AdminSettings'
// import { SiteManagementPage } from '../screens/Admin/SiteManagement/SiteManagement'
import { EmailTemplatePage } from '../screens/Admin/SiteManagement/components/EmailTemplates/EmailTemplatePage'
import SiteManagement from '../screens/Admin/SiteManagement/SiteManagement'

export const AdminRoutes: FunctionComponent = () => {
  return (
    <Switch>
      <Route exact path={DASHBOARD}>
        <AdminDashboard />
      </Route>
      <Route exact path={ENROLLMENT}>
        <Enrollment />
      </Route>
      <Route exact path={ENROLLMENT_PACKETS}>
        <EnrollmentPackets />
      </Route>
      <Route path={APPLICATIONS}>
        <Applications />
      </Route>
      <Route path={SITE_MANAGEMENT}>
        <SiteManagement />
      </Route>
      <Route path={USERS}>
        <Users />
      </Route>
      <Route path={SETTINGS}>
        <AdminSettings />
      </Route>
      {/* <Route path={SITEMANAGEMENT}>
        <SiteManagementPage />
      </Route> */}
      <Route path={EMAILTEMPLATES}>
        <EmailTemplatePage />
      </Route>
    </Switch>
  )
}
