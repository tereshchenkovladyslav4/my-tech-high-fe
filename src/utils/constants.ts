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
export const REPORTS = '/reports'
export const SITEMANAGEMENT = '/site-management'
export const RECORDS = '/records'
export const USERS = '/users'
export const ENROLLMENT_PACKETS = `/enrollment${ENROLLMENT}-packets`
export const SCHOOL_ENROLLMENT = '/school-enrollment'
export const SUBMIT_WITHDRAWAL = '/withdrawal'
export const WITHDRAWAL = '/enrollment/withdrawal'
export const EMAILTEMPLATES = '/email-templates'
export const SITE_MANAGEMENT = '/site-management'
export const FORGOT_PASSWORD = '/forgot-password'
export const RESET_PASSWORD = '/reset-password'
export const SNOWPACK_PUBLIC_S3_URL = import.meta.env.SNOWPACK_PUBLIC_S3_URL
export const SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE = import.meta.env.SNOWPACK_PUBLIC_SCHOOL_DISTRICT_TEMPLATE
export const SNOWPACK_PUBLIC_COUNTIES_TEMPLATE = import.meta.env.SNOWPACK_PUBLIC_COUNTIES_TEMPLATE

// COLORS
export const ACTIVELINKBACKGROUND = 'rgba(65, 69, 255, 0.04)'
export const BUTTON_LINEAR_GRADIENT = `linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%),
linear-gradient(0deg, #4145FF, #4145FF)`
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

export const countries = [
  { value: null, label: '' },

  {
    label: 'Afghanistan',
    value: 'AF',
  },
  {
    label: 'Aland Islands',
    value: 'AX',
  },
  {
    label: 'Albania',
    value: 'AL',
  },
  {
    label: 'Algeria',
    value: 'DZ',
  },
  {
    label: 'American Samoa',
    value: 'AS',
  },
  {
    label: 'Andorra',
    value: 'AD',
  },
  {
    label: 'Antigua Barbuda',
    value: 'AG',
  },
  {
    label: 'Argentina',
    value: 'AR',
  },
  {
    label: 'Armenia',
    value: 'AM',
  },
  {
    label: 'Aruba',
    value: 'AW',
  },
  {
    label: 'Australia',
    value: 'AU',
  },
  {
    label: 'Austria',
    value: 'AT',
  },
  {
    label: 'Azerbaijan',
    value: 'AZ',
  },
  {
    label: 'Bahamas’ The',
    value: 'BS',
  },
  {
    label: 'Bahrain',
    value: 'BH',
  },
  {
    label: 'Bangladesh',
    value: 'BD',
  },
  {
    label: 'Barbados',
    value: 'BB',
  },
  {
    label: 'Belarus',
    value: 'BY',
  },
  {
    label: 'Belgium',
    value: 'BE',
  },
  {
    label: 'Belize',
    value: 'BZ',
  },
  {
    label: 'Benin',
    value: 'BJ',
  },
  {
    label: 'Bermuda',
    value: 'BM',
  },
  {
    label: 'Bhutan',
    value: 'BT',
  },
  {
    label: 'Bolivia',
    value: 'BO',
  },
  {
    label: 'Bonaire’ St.Eustat’ Saba',
    value: 'BQ',
  },
  {
    label: 'Bosnia and Herzegovina',
    value: 'BA',
  },
  {
    label: 'Botswana',
    value: 'BW',
  },
  {
    label: 'Bouvet Island',
    value: 'BV',
  },
  {
    label: 'Brazil',
    value: 'BR',
  },
  {
    label: 'British Indian Ocean T.',
    value: 'IO',
  },
  {
    label: 'Virgin Islands’ British',
    value: 'VG',
  },
  {
    label: 'Brunei Darussalam',
    value: 'BN',
  },
  {
    label: 'Bulgaria',
    value: 'BG',
  },
  {
    label: 'Burkina Faso',
    value: 'BF',
  },
  {
    label: 'Burundi',
    value: 'BI',
  },
  {
    label: 'Cabo Verde',
    value: 'CV',
  },
  {
    label: 'Cambodia',
    value: 'KH',
  },
  {
    label: 'Cameroon',
    value: 'CM',
  },
  {
    label: 'Canada',
    value: 'CA',
  },
  {
    label: 'Cayman Islands',
    value: 'KY',
  },
  {
    label: 'Central African Republic',
    value: 'CF',
  },
  {
    label: 'Chad',
    value: 'TD',
  },
  {
    label: 'Chile',
    value: 'CL',
  },
  {
    label: 'China',
    value: 'CN',
  },
  {
    label: 'Christmas Island',
    value: 'CX',
  },
  {
    label: 'Cocos (Keeling) Islands',
    value: 'CC',
  },
  {
    label: 'Colombia',
    value: 'CO',
  },
  {
    label: 'Comoros',
    value: 'KM',
  },
  {
    label: 'Congo',
    value: 'CG',
  },
  {
    label: 'Congo’ Dem. Rep. of the',
    value: 'CD',
  },
  {
    label: 'Cook Islands',
    value: 'CK',
  },
  {
    label: 'Costa Rica',
    value: 'CR',
  },
  {
    label: 'Ivory Coast (Cote d’Ivoire)',
    value: 'CI',
  },
  {
    label: 'Croatia',
    value: 'HR',
  },
  {
    label: 'Cuba',
    value: 'CU',
  },
  {
    label: 'Curaçao',
    value: 'CW',
  },
  {
    label: 'CY"">Cyprus',
    value: 'CY',
  },
  {
    label: 'Czech Republic',
    value: 'CZ',
  },
  {
    label: 'Denmark',
    value: 'DK',
  },
  {
    label: 'Djibouti',
    value: 'DJ',
  },
  {
    label: 'Dominica',
    value: 'DM',
  },
  {
    label: 'Dominican Republic',
    value: 'DO',
  },
  {
    label: 'Timor-Leste (East Timor)',
    value: 'TP',
  },
  {
    label: 'Ecuador',
    value: 'EC',
  },
  {
    label: 'Egypt',
    value: 'EG',
  },
  {
    label: 'El Salvador',
    value: 'SV',
  },
  {
    label: 'Equatorial Guinea',
    value: 'GQ',
  },
  {
    label: 'Eritrea',
    value: 'ER',
  },
  {
    label: 'Estonia',
    value: 'EE',
  },
  {
    label: 'Ethiopia',
    value: 'ET',
  },
  {
    label: 'Falkland Is. (Malvinas)',
    value: 'FK',
  },
  {
    label: 'Faroe Islands',
    value: 'FO',
  },
  {
    label: 'Fiji',
    value: 'FJ',
  },
  {
    label: 'Finland',
    value: 'FI',
  },
  {
    label: 'France',
    value: 'FR',
  },
  {
    label: 'Guiana’ French',
    value: 'GF',
  },
  {
    label: 'French Polynesia',
    value: 'PF',
  },
  {
    label: 'French Southern Terr.',
    value: 'TF',
  },
  {
    label: 'Gabon',
    value: 'GA',
  },
  {
    label: 'Gambia’ the',
    value: 'GM',
  },
  {
    label: 'Georgia',
    value: 'GE',
  },
  {
    label: 'Germany',
    value: 'DE',
  },
  {
    label: 'Ghana',
    value: 'GH',
  },
  {
    label: 'Gibraltar',
    value: 'GI',
  },
  {
    label: 'Greece',
    value: 'GR',
  },
  {
    label: 'Greenland',
    value: 'GL',
  },
  {
    label: 'Grenada',
    value: 'GD',
  },
  {
    label: 'Guinea’ Equatorial',
    value: 'GP',
  },
  {
    label: 'Guam',
    value: 'GU',
  },
  {
    label: 'Guatemala',
    value: 'GT',
  },
  {
    label: 'Guernsey and Alderney',
    value: 'GG',
  },
  {
    label: 'Guinea',
    value: 'GN',
  },
  {
    label: 'Guinea-Bissauvalue',
    value: 'GW',
  },
  {
    label: 'Guyana',
    value: 'GY',
  },
  {
    label: 'Haiti',
    value: 'HT',
  },
  {
    label: 'Heard &amp; McDonald Is.',
    value: 'HM',
  },
  {
    label: 'Vatican (Holy See)',
    value: 'VA',
  },
  {
    label: 'Honduras',
    value: 'HN',
  },
  {
    label: 'Hong Kong’ (China)',
    value: 'HK',
  },
  {
    label: 'HU"">Hungary',
    value: 'HU',
  },
  {
    label: 'Iceland',
    value: 'IS',
  },
  {
    label: 'India',
    value: 'IN',
  },
  {
    label: 'Indonesia',
    value: 'ID',
  },
  {
    label: 'Iran’ Islamic Republic of',
    value: 'IR',
  },
  {
    label: 'Iraq',
    value: 'IQ',
  },
  {
    label: 'Ireland',
    value: 'IE',
  },
  {
    label: 'Israel',
    value: 'IL',
  },
  {
    label: 'Italy',
    value: 'IT',
  },
  {
    label: 'Jamaica',
    value: 'JM',
  },
  {
    label: 'Japan',
    value: 'JP',
  },
  {
    label: 'Jersey',
    value: 'JE',
  },
  {
    label: 'Jordan',
    value: 'JO',
  },
  {
    label: 'Kazakhstan',
    value: 'KZ',
  },
  {
    label: 'Kenya',
    value: 'KE',
  },
  {
    label: 'Kiribati',
    value: 'KI',
  },
  {
    label: 'Korea Dem. People’s Rep.',
    value: 'KP',
  },
  {
    label: 'Korea’ (South) Republic of',
    value: 'KR',
  },
  {
    label: 'Kosovo',
    value: 'KV',
  },
  {
    label: 'Kuwait',
    value: 'KW',
  },
  {
    label: 'Kyrgyzstan',
    value: 'KG',
  },
  {
    label: 'Lao People’s Dem. Rep.',
    value: 'LA',
  },
  {
    label: 'Latvia',
    value: 'LV',
  },
  {
    label: 'Lebanon',
    value: 'LB',
  },
  {
    label: 'Lesotho',
    value: 'LS',
  },
  {
    label: 'Liberia',
    value: 'LR',
  },
  {
    label: 'Libyan Arab Jamahiriya',
    value: 'LY',
  },
  {
    label: 'Liechtenstein',
    value: 'LI',
  },
  {
    label: 'Lithuania',
    value: 'LT',
  },
  {
    label: 'Luxembourg',
    value: 'LU',
  },
  {
    label: 'Macao (China)',
    value: 'MO',
  },
  {
    label: 'Macedonia TFYR',
    value: 'MK',
  },
  {
    label: 'Madagascar',
    value: 'MG',
  },
  {
    label: 'Malawi',
    value: 'MW',
  },
  {
    label: 'Malaysia',
    value: 'MY',
  },
  {
    label: 'Maldives',
    value: 'MV',
  },
  {
    label: 'Mali',
    value: 'ML',
  },
  {
    label: 'Malta',
    value: 'MT',
  },
  {
    label: 'Man Isle of',
    value: 'IM',
  },
  {
    label: 'Marshall Islands',
    value: 'MH',
  },
  {
    label: 'Martinique (FR)',
    value: 'MQ',
  },
  {
    label: 'Mauritania',
    value: 'MR',
  },
  {
    label: 'Mauritius',
    value: 'MU',
  },
  {
    label: 'Mayotte (FR)',
    value: 'YT',
  },
  {
    label: 'Mexico',
    value: 'MX',
  },
  {
    label: 'Micronesia Fed. States of',
    value: 'FM',
  },
  {
    label: 'Moldova Republic of',
    value: 'MD',
  },
  {
    label: 'Monaco',
    value: 'MC',
  },
  {
    label: 'Mongolia',
    value: 'MN',
  },
  {
    label: 'Montenegro',
    value: 'CS',
  },
  {
    label: 'Montserrat',
    value: 'MS',
  },
  {
    label: 'Morocco',
    value: 'MA',
  },
  {
    label: 'Mozambique',
    value: 'MZ',
  },
  {
    label: 'Myanmar (ex-Burma)',
    value: 'MM',
  },
  {
    label: 'Namibia',
    value: 'NA',
  },
  {
    label: 'Nauru',
    value: 'NR',
  },
  {
    label: 'Nepal',
    value: 'NP',
  },
  {
    label: 'Netherlands',
    value: 'NL',
  },
  {
    label: 'Netherlands Antilles',
    value: 'AN',
  },
  {
    label: 'New Caledonia',
    value: 'NC',
  },
  {
    label: 'New Zealand',
    value: 'NZ',
  },
  {
    label: 'Nicaragua',
    value: 'NI',
  },
  {
    label: 'Niger',
    value: 'NE',
  },
  {
    label: 'Nigeria',
    value: 'NG',
  },
  {
    label: 'Niue',
    value: 'NU',
  },
  {
    label: 'Norfolk Island',
    value: 'NF',
  },
  {
    label: 'Northern Mariana Islands',
    value: 'MP',
  },
  {
    label: 'Norway',
    value: 'NO',
  },
  {
    label: 'Oman',
    value: 'OM',
  },
  {
    label: 'Pakistan',
    value: 'PK',
  },
  {
    label: 'Palau',
    value: 'PW',
  },
  {
    label: 'Palestinian Territory',
    value: 'PS',
  },
  {
    label: 'Panama',
    value: 'PA',
  },
  {
    label: 'Papua New Guinea',
    value: 'PG',
  },
  {
    label: 'Paraguay',
    value: 'PY',
  },
  {
    label: 'Peru',
    value: 'PE',
  },
  {
    label: 'Philippines',
    value: 'PH',
  },
  {
    label: 'Pitcairn Island',
    value: 'PN',
  },
  {
    label: 'Poland',
    value: 'PL',
  },
  {
    label: 'Portugal',
    value: 'PT',
  },
  {
    label: 'Puerto Rico',
    value: 'PR',
  },
  {
    label: 'Qatar',
    value: 'QA',
  },
  {
    label: 'Reunion (FR)',
    value: 'RE',
  },
  {
    label: 'Romania',
    value: 'RO',
  },
  {
    label: 'Russia (Russian Fed.)',
    value: 'RU',
  },
  {
    label: 'Rwanda',
    value: 'RW',
  },
  {
    label: 'Western Sahara',
    value: 'EH',
  },
  {
    label: 'Saint Barthelemy (FR)',
    value: 'BL',
  },
  {
    label: 'Saint Helena (UK)',
    value: 'SH',
  },
  {
    label: 'Saint Kitts and Nevis',
    value: 'KN',
  },
  {
    label: 'Saint Lucia',
    value: 'LC',
  },
  {
    label: 'Saint Martin (FR)',
    value: 'MF',
  },
  {
    label: 'S Pierre &amp; Miquelon(FR)',
    value: 'PM',
  },
  {
    label: 'S Vincent &amp; Grenadines',
    value: 'VC',
  },
  {
    label: 'Samoa',
    value: 'WS',
  },
  {
    label: 'San Marino',
    value: 'SM',
  },
  {
    label: 'Sao Tome and Principe',
    value: 'ST',
  },
  {
    label: 'Saudi Arabia',
    value: 'SA',
  },
  {
    label: 'Senegal',
    value: 'SN',
  },
  {
    label: 'Serbia',
    value: 'RS',
  },
  {
    label: 'Seychelles',
    value: 'SC',
  },
  {
    label: 'Sierra Leone',
    value: 'SL',
  },
  {
    label: 'Singapore',
    value: 'SG',
  },
  {
    label: 'Slovakia',
    value: 'SK',
  },
  {
    label: 'Slovenia',
    value: 'SI',
  },
  {
    label: 'Solomon Islands',
    value: 'SB',
  },
  {
    label: 'Somalia',
    value: 'SO',
  },
  {
    label: 'South Africa',
    value: 'ZA',
  },
  {
    label: 'S.George &amp; S.Sandwich',
    value: 'GS',
  },
  {
    label: 'South Sudan',
    value: 'SS',
  },
  {
    label: 'Spain',
    value: 'ES',
  },
  {
    label: 'Sri Lanka (ex-Ceilan)',
    value: 'LK',
  },
  {
    label: 'Sudan',
    value: 'SD',
  },
  {
    label: 'Suriname',
    value: 'SR',
  },
  {
    label: 'Svalbard Jan Mayen Is.',
    value: 'SJ',
  },
  {
    label: 'Swaziland',
    value: 'SZ',
  },
  {
    label: 'Sweden',
    value: 'SE',
  },
  {
    label: 'Switzerland',
    value: 'CH',
  },
  {
    label: 'Syrian Arab Republic',
    value: 'SY',
  },
  {
    label: 'Taiwan',
    value: 'TW',
  },
  {
    label: 'Tajikistan',
    value: 'TJ',
  },
  {
    label: 'Tanzania United Rep. of',
    value: 'TZ',
  },
  {
    label: 'Thailand',
    value: 'TH',
  },
  {
    label: 'Togo',
    value: 'TG',
  },
  {
    label: 'Tokelau',
    value: 'TK',
  },
  {
    label: 'Tonga',
    value: 'TO',
  },
  {
    label: 'Trinidad Tobago',
    value: 'TT',
  },
  {
    label: 'Tunisia',
    value: 'TN',
  },
  {
    label: 'Turkey',
    value: 'TR',
  },
  {
    label: 'Turkmenistan',
    value: 'TM',
  },
  {
    label: 'Turks and Caicos Is.',
    value: 'TC',
  },
  {
    label: 'Tuvalu',
    value: 'TV',
  },
  {
    label: 'Uganda',
    value: 'UG',
  },
  {
    label: 'Ukraine',
    value: 'UA',
  },
  {
    label: 'United Arab Emirates',
    value: 'AE',
  },
  {
    label: 'United Kingdom',
    value: 'UK',
  },
  {
    label: 'United States',
    value: 'US',
  },
  {
    label: 'US Minor Outlying Isl.',
    value: 'UM',
  },
  {
    label: 'Uruguay',
    value: 'UY',
  },
  {
    label: 'Uzbekistan',
    value: 'UZ',
  },
  {
    label: 'Vanuatu',
    value: 'VU',
  },
  {
    label: 'Venezuela',
    value: 'VE',
  },
  {
    label: 'Viet Nam',
    value: 'VN',
  },
  {
    label: 'Virgin Islands U.S.',
    value: 'VI',
  },
  {
    label: 'Wallis and Futuna',
    value: 'WF',
  },
  {
    label: 'Yemen',
    value: 'YE',
  },
  {
    label: 'Zambia',
    value: 'ZM',
  },
  {
    label: 'Zimbabwe',
    value: 'ZW',
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

//  Withdrawal
export const WITHDRAWAL_STATUS_LABEL = ['Requested', 'Notified', 'Withdrawn']
