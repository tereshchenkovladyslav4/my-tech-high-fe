export enum MthRoute {
  ADMIN_APPLICATIONS = '/enrollment/applications',
  ANNOUNCEMENTS = '/communication/announcements',
  APPLICATIONS = '/applications',
  CALENDAR = '/calendar',
  COMMUNICATION = '/communication',
  CONFIRM_EMAIL = '/confirm',
  DASHBOARD = '/',
  EMAIL_RECORDS = '/communication/email-records',
  EMAIL_VERIFICATION = '/email-verification',
  EMAILTEMPLATES = '/email-templates',
  ENROLLMENT = '/enrollment',
  ENROLLMENT_PACKETS = '/enrollment/enrollment-packets',
  FORGOT_PASSWORD = '/forgot-password',
  HOMEROOM = '/homeroom',
  PARENT_LINK = '/parent-link',
  RECORDS = '/records',

  REIMBURSEMENTS = '/reimbursements',
  REIMBURSEMENTS_REQUESTS = '/reimbursements/requests',
  REIMBURSEMENTS_SETTINGS = '/reimbursements/settings',
  REIMBURSEMENTS_REIMBURSEMENT_FORM = '/reimbursements/reimbursement_form',
  REIMBURSEMENTS_DIRECT_ORDER_FORM = '/reimbursements/direct_order_form',

  CURRICULUM = '/curriculum',
  CURRICULUM_COURSE_CATALOG = '/curriculum/course-catalog',
  CURRICULUM_COURSE_CATALOG_SETTINGS = '/curriculum/course-catalog/settings',
  CURRICULUM_COURSE_CATALOG_PERIODS = '/curriculum/course-catalog/periods',
  CURRICULUM_COURSE_CATALOG_SUBJECTS = '/curriculum/course-catalog/subjects',
  CURRICULUM_COURSE_CATALOG_PROVIDERS = '/curriculum/course-catalog/providers',
  CURRICULUM_COURSE_CATALOG_STATE_CODES = '/curriculum/course-catalog/state-codes',

  REPORTS = '/reports',
  RESET_PASSWORD = '/reset-password',
  SETTINGS = '/settings',
  SITE_MANAGEMENT = '/site-management',
  SITEMANAGEMENT = '/site-management',
  SNOWPACK_PUBLIC_COUNTIES_TEMPLATE = import.meta.env.SNOWPACK_PUBLIC_COUNTIES_TEMPLATE,
  SNOWPACK_PUBLIC_S3_URL = import.meta.env.SNOWPACK_PUBLIC_S3_URL,
  SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE = import.meta.env.SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE,
  SUBMIT_WITHDRAWAL = '/withdrawal',
  SUBMIT_SCHEDULE = '/schedule',
  USERS = '/users',
  WITHDRAWAL = '/enrollment/withdrawal',
  TESTING_PREFERENCE_PATH = '/site-management/enrollment/testing-preference',
  ENROLLMENT_SCHEDULE = '/enrollment/enrollment-schedule',
}
