import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import { AdminDashboard } from '../screens/Admin/Dashboard/AdminDashboard'
import {
  ADMIN_APPLICATIONS,
  DASHBOARD,
  ENROLLMENT,
  ENROLLMENT_PACKETS,
  SETTINGS,
  USERS,
  EMAILTEMPLATES,
  SITE_MANAGEMENT,
  WITHDRAWAL,
  ANNOUNCEMENTS,
  CALENDAR,
  COMMUNICATION,
  EMAIL_RECORDS,
  SCHOOL_ENROLLMENT,
  CURRICULUM,
} from '../utils/constants'
import Enrollment from '../screens/Admin/Enrollment/Enrollment'
import { Applications } from '../screens/Admin/Applications/Applications'
import { EnrollmentPackets } from '../screens/Admin/EnrollmentPackets/EnrollmentPackets'
import { Users } from '../screens/Admin/Users/Users'
import AdminSettings from '../screens/Admin/Settings/AdminSettings'
import { EmailTemplatePage } from '../screens/Admin/SiteManagement/components/EmailTemplates/EmailTemplatePage'
import SiteManagement from '../screens/Admin/SiteManagement/SiteManagement'
import { Withdrawals } from '../screens/Admin/Withdrawals'
import { Announcements } from '../screens/Admin/Announcements'
import { Calendar } from '../screens/Admin/Calendar'
import Communication from '../screens/Admin/Communication/Communication'
import { EmailRecords } from '../screens/Admin/EmailRecords/EmailRecords'
import { SchoolOfEnrollment } from '../screens/Admin/SchoolOfEnrollment/SchoolOfEnrollment'
import Curriculum from '../screens/Admin/Curriculum/Curriculum'

export const AdminRoutes: FunctionComponent = () => {
  return (
    <Switch>
      <Route exact path={DASHBOARD}>
        <AdminDashboard />
      </Route>
      <Route exact path={ENROLLMENT}>
        <Enrollment />
      </Route>
      <Route exact path={COMMUNICATION}>
        <Communication />
      </Route>
      <Route path={EMAIL_RECORDS}>
        <EmailRecords />
      </Route>
      <Route exact path={ENROLLMENT_PACKETS}>
        <EnrollmentPackets />
      </Route>
      <Route exact path={WITHDRAWAL}>
        <Withdrawals />
      </Route>
      <Route path={ANNOUNCEMENTS}>
        <Announcements />
      </Route>
      <Route path={CALENDAR}>
        <Calendar />
      </Route>
      <Route path={ADMIN_APPLICATIONS}>
        <Applications />
      </Route>
      <Route path={SCHOOL_ENROLLMENT}>
        <SchoolOfEnrollment />
      </Route>
      <Route path={SITE_MANAGEMENT}>
        <SiteManagement />
      </Route>
      <Route path={CURRICULUM}>
        <Curriculum />
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
