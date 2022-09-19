import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Announcements } from '@mth/screens/Admin/Announcements'
import { Applications } from '@mth/screens/Admin/Applications/Applications'
import { Calendar } from '@mth/screens/Admin/Calendar'
import { Communication } from '@mth/screens/Admin/Communication/Communication'
import CourseCatalog from '@mth/screens/Admin/Curriculum/CourseCatalog'
import CourseCatalogPeriods from '@mth/screens/Admin/Curriculum/CourseCatalog/Periods'
import { CourseCatalogProviders } from '@mth/screens/Admin/Curriculum/CourseCatalog/Providers'
import CourseCatalogSettings from '@mth/screens/Admin/Curriculum/CourseCatalog/Settings'
import CourseCatalogStateCodes from '@mth/screens/Admin/Curriculum/CourseCatalog/StateCodes'
import { CourseCatalogSubjects } from '@mth/screens/Admin/Curriculum/CourseCatalog/Subjects'
import Curriculum from '@mth/screens/Admin/Curriculum/Curriculum'
import { HomeroomResources } from '@mth/screens/Admin/Curriculum/HomeroomResources/HomeroomResources'
import { AdminDashboard } from '@mth/screens/Admin/Dashboard/AdminDashboard'
import { EmailRecords } from '@mth/screens/Admin/EmailRecords/EmailRecords'
import { Enrollment } from '@mth/screens/Admin/Enrollment/Enrollment'
import { EnrollmentPackets } from '@mth/screens/Admin/EnrollmentPackets/EnrollmentPackets'
import { Records } from '@mth/screens/Admin/Records'
import { SchoolOfEnrollment } from '@mth/screens/Admin/SchoolOfEnrollment/SchoolOfEnrollment'
import AdminSettings from '@mth/screens/Admin/Settings/AdminSettings'
import { EmailTemplatePage } from '@mth/screens/Admin/SiteManagement/components/EmailTemplates/EmailTemplatePage'
import SiteManagement from '@mth/screens/Admin/SiteManagement/SiteManagement'
import { Users } from '@mth/screens/Admin/Users/Users'
import { Withdrawals } from '@mth/screens/Admin/Withdrawals'
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

export const AdminRoutes: React.FC = () => {
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
      <Route path={EMAILTEMPLATES}>
        <EmailTemplatePage />
      </Route>
    </Switch>
  )
}
