import { StandardResponseOption } from '../components/EmailModal/StandardReponses/types'

// ROUTES
export const DASHBOARD = '/'
export const HOMEROOM = '/homeroom'
export const PARENT_LINK = '/parent-link'
export const REIMBURSMENTS = '/reimbursements'
export const SETTINGS = '/settings'
export const APPLICATIONS = '/applications'
export const ADMIN_APPLICATIONS = '/enrollment/applications'
export const ENROLLMENT = '/enrollment'
export const COMMUNICATION = '/communication'
export const EMAIL_RECORDS = '/communication/email-records'
export const CONFIRM_EMAIL = '/confirm'
export const EMAIL_VERIFICATION = '/email-verification'
export const ANNOUNCEMENTS = '/communication/announcements'
export const CALENDAR = '/calendar'
export const CURRICULUM = '/curriculum'
export const CURRICULUM_HOMEROOM_RESOURCES = '/curriculum/homeroom-resources'
export const CURRICULUM_COURSE_CATALOG = '/curriculum/course-catalog'
export const CURRICULUM_COURSE_CATALOG_SETTINGS = '/curriculum/course-catalog/settings'
export const CURRICULUM_COURSE_CATALOG_PERIODS = '/curriculum/course-catalog/periods'
export const CURRICULUM_COURSE_CATALOG_SUBJECTS = '/curriculum/course-catalog/subjects'
export const CURRICULUM_COURSE_CATALOG_PROVIDERS = '/curriculum/course-catalog/providers'
export const CURRICULUM_COURSE_CATALOG_STATE_CODES = '/curriculum/course-catalog/state-codes'
export const REPORTS = '/reports'
export const SITEMANAGEMENT = '/site-management'
export const RECORDS = '/records'
export const USERS = '/users'
export const ENROLLMENT_PACKETS = `/enrollment${ENROLLMENT}-packets`
export const ENROLLMENT_SCHEDULE = `/enrollment${ENROLLMENT}-schedule`
export const SCHOOL_ENROLLMENT = '/enrollment/school-enrollment'
export const SUBMIT_WITHDRAWAL = '/withdrawal'
export const WITHDRAWAL = '/enrollment/withdrawal'
export const EMAILTEMPLATES = '/email-templates'
export const SITE_MANAGEMENT = '/site-management'
export const FORGOT_PASSWORD = '/forgot-password'
export const RESET_PASSWORD = '/reset-password'
export const HOMEROOM_GRADEBOOK = '/homeroom/gradebook'
export const HOMEROOM_LEARNING_LOGS = '/homeroom/learning-log'
export const HOMEROOM_ASSIGNMENTS = '/homeroom/assignments'
export const HOMEROOM_SETTINGS = '/homeroom/settings'
export const HOMEROOM_CHECKLIST = '/homeroom/checklist'
export const SNOWPACK_PUBLIC_S3_URL = import.meta.env.SNOWPACK_PUBLIC_S3_URL
export const SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE = import.meta.env.SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE
export const SNOWPACK_PUBLIC_COUNTIES_TEMPLATE = import.meta.env.SNOWPACK_PUBLIC_COUNTIES_TEMPLATE

// COLORS
export const ACTIVELINKBACKGROUND = 'rgba(65, 69, 255, 0.04)'
export const BUTTON_LINEAR_GRADIENT = `linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%),
linear-gradient(0deg, #4145FF, #4145FF)`
export const BUTTON_LINEAR_GRADIENT_DARK = 'linear-gradient(90deg, #0E0E0E 0%, #666666 100%), #0E0E0E;'
export const RED_GRADIENT = 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%), #D23C33;'
export const BLUE_GRDIENT = 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%), #4145FF;'
export const YELLOW_GRADIENT = 'linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(62, 39, 131, 0) 100%), #FFD626;'
export const GREEN_GRADIENT = 'linear-gradient(90deg, rgba(0, 0, 0, 0.5) 0%, rgba(62, 39, 131, 0) 100%), #33FF7C;'
export const BLACK_GRADIENT = 'linear-gradient(90deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.2) 100%), #fff;'
export const RED = '#D23C33'
export const GRAY = '#CCCCCC'
export const LIGHTGRAY = '#F2F2F2'
export const BLACK = '#000000'
export const ERROR_RED = '#BD0043'
export const MTHBLUE = '#4145FF'
export const MTHPURPLE = '#3E2783'
export const MTHORANGE = '#EC5925'
export const MTHGREEN = '#2B9EB7'
export const MTHGBRIGHTREEN = '#38892B'

export const SYSTEM_01 = '#0E0E0E'
export const SYSTEM_02 = '#313131'
export const SYSTEM_03 = '#575757'
export const SYSTEM_04 = '#6E6E6E'
export const SYSTEM_05 = '#767676'
export const SYSTEM_06 = '#A1A1A1'
export const SYSTEM_07 = '#CCCCCC'
export const SYSTEM_08 = '#E7E7E7'
export const SYSTEM_09 = '#EEF4F8'
export const SYSTEM_10 = '#CCCCCC'
export const SYSTEM_11 = '#898C8F'

export const PRIMARY_MEDIUM_DEFAULT = `linear-gradient(90deg, ${MTHPURPLE} -0.75%, rgba(62, 39, 131, 0) 100%),
linear-gradient(0deg, ${MTHBLUE}, ${MTHBLUE})`
export const PRIMARY_MEDIUM_MOUSEOVER = '#585CFF'
export const BUTTON_DISABLED = SYSTEM_08

export const PRIMARY_SMALL_DEFAULT = `linear-gradient(90deg, ${MTHPURPLE} 0%, rgba(62, 39, 131, 0) 100%), linear-gradient(0deg, ${MTHBLUE}, ${MTHBLUE})`
export const PRIMARY_SMALL_MOUSEOVER = SYSTEM_08
export const SMALL_BUTTON_DISABLED = LIGHTGRAY

export const SECONDARY_SMALL_DEFAULT = LIGHTGRAY
export const SECONDARY_SMALL_MOUSEOVER = SYSTEM_08

export const SECONDARY_MEDIUM_DEFAULT = SYSTEM_01
export const SECONDARY_MEDIUM_MOUSEOVER = SYSTEM_02
export const SECONDARY_MEDIUM_DISABLED = SYSTEM_08

export const STATES = ['Arizona', 'Colorado', 'Idaho', 'Indiana', 'Wyoming']
export const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

export const FEATURES = [
  'Announcements',
  'Clubs/Classes',
  'Enrollment',
  'Homeroom Resources',
  'Interventions',
  'Reimbursements & Direct Orders',
]

export const SOE = ['School of Enrollment', 'SPED', 'Provider']

export const SOE_OPTIONS = ['Nebo', 'GPA', 'Tooele', 'ALC']

export const PROVIDERS = ['Alex Math', 'BYU', 'IXL', 'MTH ']

export const SPED = ['No', 'IEP', '504', 'Exit']

export const GRADES = ['Kindergarten', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

export const CURRICULUM_PROVIDERS = ['SNHU', 'Spark', 'Snow']

export const GRADE_GROUPS = ['K', '1-8', '9-12']

export const MISSING_INFO_OPTIONS: StandardResponseOption = {
  type: 'MISSING_INFO',
  default: `Hi, <PARENT>,

The Enrollment Packet we received for <STUDENT NAME> is missing the following information:
<NOTICE>

Please use the link below to submit the required document(s) and/or information:
http://v2-staging.mytechhigh.com/homeroom/enrollment/<STUDENT_ID>

Let us know if you have any questions by contacting us at help@mytechhigh.com. We're happy to help in any way we can!

Thanks!
My Tech High`,
  values: [
    {
      title: 'Birth Certificate',
      checked: false,
      extraText: null,
      abbr: 'bc',
    },
    {
      title: 'Immunizations',
      checked: false,
      extraText: null,
      abbr: 'im',
    },
    {
      title: 'Proof of Residency',
      checked: false,
      extraText: null,
      abbr: 'ur',
    },
    {
      title: 'IEP or 504 Plan',
      checked: false,
      extraText: null,
      abbr: 'iep',
    },
    {
      title: '7th Grade Immunization',
      checked: false,
      extraText:
        'State law requires that students entering 6 the grade be fully immunized or submit a Personal Exemption form that was issued in 2022. Please provide an exemption form that was issued this year.',
      abbr: 'sgim',
    },
    {
      title: 'Kindergarten Immunization',
      checked: false,
      extraText: null,
      abbr: 'kim',
    },
  ],
}

export const AGE_ISSUE_OPTIONS: StandardResponseOption = {
  type: 'AGE_ISSUE',
  default: `Hi <PARENT>,

<NOTICE>

Let us know if you have any questions by contacting Amy at admin@mytechhigh.com. We're happy to help however we can!

My Tech High`,
  values: [
    {
      title: 'No Prior School History',
      checked: false,
      extraText: `We're reviewing <STUDENT NAME>'s Enrollment Packet and need to confirm their grade. The packet indicates that you'd like <STUDENT NAME> in <STUDENT GRADE>th grade for the <SCHOOL YEAR> school year, but age-wise they could be in [BLANK].

Has <STUDENT NAME> previously been enrolled in a public school or public school program? If so, in which year and grade?`,
    },
    {
      title: 'Enrolled in Previous School',
      checked: false,
      extraText: `We're reviewing <STUDENT NAME>'s Enrollment Packet and need to confirm their grade. The packet indicates that you'd like <STUDENT NAME> in <STUDENT GRADE>th grade for the <SCHOOL YEAR> school year, but age-wise they could be in [BLANK].

In which year and grade was <STUDENT NAME> most recently enrolled in Providence Hall Elementary School?`,
    },
  ],
}

export const languages = [
  { value: null, label: '' },

  {
    label: 'English',
    value: 'English',
  },
  {
    label: 'Spanish',
    value: 'Spanish',
  },
  {
    label: 'Other (Indicate)',
    value: 'Other',
  },
]

export const raceOptions = [
  { value: null, label: '' },

  {
    label: 'Asian',
    checked: false,
  },
  {
    label: 'American Indian or Alaska Native',
    checked: false,
  },
  {
    label: 'Black or African American',
    checked: false,
  },
  {
    label: 'Native Hawaiian or Other Pacific Islander',
    checked: false,
  },
  {
    label: 'Undeclared',
    checked: false,
  },
  {
    label: 'White',
    checked: false,
  },
  {
    label: 'Other',
    checked: false,
    value: '',
  },
]

export const hispanicOptions = [
  { value: null, label: '' },

  {
    label: 'Hispanic',
    value: '1',
  },
  {
    label: 'Latino',
    value: '0',
  },
]

export const workInAgricultureOptions = [
  { value: null, label: '' },
  {
    label: 'Yes',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  },
]

export const militaryOptions = [
  { value: null, label: '' },

  {
    label: 'Yes',
    value: '1',
  },
  {
    label: 'No',
    value: '0',
  },
]

export const otherPermissionptions = [
  { value: null, label: '' },

  {
    label: 'NO',
    value: '0',
  },
  {
    label: 'YES',
    value: '1',
  },
]

export const picturePermissionptions = [
  { value: null, label: '' },

  {
    label: 'No',
    value: '0',
  },
  {
    label: 'YES',
    value: '1',
  },
]

export const directoryPermissionptions = [
  { value: null, label: '' },

  {
    label: 'No',
    value: '0',
  },
  {
    label: 'YES',
    value: '1',
  },
]

export const schoolDistricts = [
  { value: null, label: '' },

  {
    label: 'Alpine',
    value: 'Alpine',
  },
  {
    label: 'Beaver',
    value: 'Beaver',
  },
  {
    label: 'Box Elder',
    value: 'Box Elder',
  },
  {
    label: 'Cache',
    value: 'Cache',
  },
  {
    label: 'Canyons',
    value: 'Canyons',
  },
  {
    label: 'Carbon',
    value: 'Carbon',
  },
  {
    label: 'Daggett',
    value: 'Daggett',
  },
  {
    label: 'Davis',
    value: 'Davis',
  },
  {
    label: 'Duchesne',
    value: 'Duchesne',
  },
  {
    label: 'Emery',
    value: 'Emery',
  },
  {
    label: 'Garfield',
    value: 'Garfield',
  },
  {
    label: 'Grand',
    value: 'Grand',
  },
  {
    label: 'Granite',
    value: 'Granite',
  },
  {
    label: 'Iron',
    value: 'Iron',
  },
  {
    label: 'Jordan',
    value: 'Jordan',
  },
  {
    label: 'Juab',
    value: 'Juab',
  },
  {
    label: 'Kane',
    value: 'Kane',
  },
  {
    label: 'Logan',
    value: 'Logan',
  },
  {
    label: 'Millard',
    value: 'Millard',
  },
  {
    label: 'Morgan',
    value: 'Morgan',
  },
  {
    label: 'Murray',
    value: 'Murray',
  },
  {
    label: 'Nebo',
    value: 'Nebo',
  },
  {
    label: 'North Sanpete',
    value: 'North Sanpete',
  },
  {
    label: 'North Summit',
    value: 'North Summit',
  },
  {
    label: 'Ogden',
    value: 'Ogden',
  },
  {
    label: 'Oregon',
    value: 'Oregon',
  },
  {
    label: 'Park City',
    value: 'Park City',
  },
  {
    label: 'Piute',
    value: 'Piute',
  },
  {
    label: 'Provo',
    value: 'Provo',
  },
  {
    label: 'Rich',
    value: 'Rich',
  },
  {
    label: 'Salt Lake City',
    value: 'Salt Lake City',
  },
  {
    label: 'San Juan',
    value: 'San Juan',
  },
  {
    label: 'Sevier',
    value: 'Sevier',
  },
  {
    label: 'South Sanpete',
    value: 'South Sanpete',
  },
  {
    label: 'South Summit',
    value: 'South Summit',
  },
  {
    label: 'Tintic',
    value: 'Tintic',
  },
  {
    label: 'Tooele',
    value: 'Tooele',
  },
  {
    label: 'Uintah',
    value: 'Uintah',
  },
  {
    label: 'Wasatch',
    value: 'Wasatch',
  },
  {
    label: 'Washington',
    value: 'Washington',
  },
  {
    label: 'Wayne',
    value: 'Wayne',
  },
  {
    label: 'Weber',
    value: 'Weber',
  },
]

export const monthlyIncome = [
  { value: null, label: '' },
  {
    label: 'Not Shared',
    value: 0,
  },
  {
    label: 'Less than $1,600',
    value: 1,
  },
  {
    label: '$1,600 - $3,000',
    value: 2,
  },
  {
    label: '$3,000 - $4,000',
    value: 3,
  },
  {
    label: '$4,000 - $5,500',
    value: 4,
  },
  {
    label: '$5,500 - $6,600',
    value: 5,
  },
  {
    label: 'Above $6,600',
    value: 6,
  },
]
