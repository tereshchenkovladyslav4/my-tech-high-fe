import React, { FunctionComponent } from 'react'
import { Route, Switch } from 'react-router-dom'
import CourseCatalog from '@mth/screens/Admin/Curriculum/CourseCatalog'
import CourseCatalogPeriods from '@mth/screens/Admin/Curriculum/CourseCatalog/Periods'
import { CourseCatalogProviders } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers'
import CourseCatalogSettings from '@mth/screens/Admin/Curriculum/CourseCatalog/Settings'
import CourseCatalogStateCodes from '@mth/screens/Admin/Curriculum/CourseCatalog/StateCodes'
import CourseCatalogSubjects from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects'
import { HomeroomResources } from '@mth/screens/Admin/Curriculum/HomeroomResources/HomeroomResources'
import { Records } from '@mth/screens/Admin/Records'
import { Announcements } from '../screens/Admin/Announcements'
import { Applications } from '../screens/Admin/Applications/Applications'
import { Calendar } from '../screens/Admin/Calendar'
import { Communication } from '../screens/Admin/Communication/Communication'
import Curriculum from '../screens/Admin/Curriculum/Curriculum'
import { AdminDashboard } from '../screens/Admin/Dashboard/AdminDashboard'
import { EmailRecords } from '../screens/Admin/EmailRecords/EmailRecords'
import { Enrollment } from '../screens/Admin/Enrollment/Enrollment'
import { EnrollmentPackets } from '../screens/Admin/EnrollmentPackets/EnrollmentPackets'
import { SchoolOfEnrollment } from '../screens/Admin/SchoolOfEnrollment/SchoolOfEnrollment'
import AdminSettings from '../screens/Admin/Settings/AdminSettings'
import { EmailTemplatePage } from '../screens/Admin/SiteManagement/components/EmailTemplates/EmailTemplatePage'
import SiteManagement from '../screens/Admin/SiteManagement/SiteManagement'
import { Users } from '../screens/Admin/Users/Users'
import { Withdrawals } from '../screens/Admin/Withdrawals'
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
  CURRICULUM_HOMEROOM_RESOURCES,
  CURRICULUM_COURSE_CATALOG,
  RECORDS,
  CURRICULUM_COURSE_CATALOG_SETTINGS,
  CURRICULUM_COURSE_CATALOG_PERIODS,
  CURRICULUM_COURSE_CATALOG_SUBJECTS,
  CURRICULUM_COURSE_CATALOG_PROVIDERS,
  CURRICULUM_COURSE_CATALOG_STATE_CODES,
} from '../utils/constants'

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
      <Route exact path={CURRICULUM}>
        <Curriculum />
      </Route>
      <Route path={CURRICULUM_HOMEROOM_RESOURCES}>
        <HomeroomResources />
      </Route>
      <Route exact path={CURRICULUM_COURSE_CATALOG}>
        <CourseCatalog />
      </Route>
      <Route path={CURRICULUM_COURSE_CATALOG_SETTINGS}>
        <CourseCatalogSettings />
      </Route>
      <Route path={CURRICULUM_COURSE_CATALOG_PERIODS}>
        <CourseCatalogPeriods />
      </Route>
      <Route path={CURRICULUM_COURSE_CATALOG_SUBJECTS}>
        <CourseCatalogSubjects />
      </Route>
      <Route path={CURRICULUM_COURSE_CATALOG_PROVIDERS}>
        <CourseCatalogProviders />
      </Route>
      <Route path={CURRICULUM_COURSE_CATALOG_STATE_CODES}>
        <CourseCatalogStateCodes />
      </Route>
      <Route path={USERS}>
        <Users />
      </Route>
      <Route path={SETTINGS}>
        <AdminSettings />
      </Route>
      <Route path={RECORDS}>
        <Records />
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
