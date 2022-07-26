import { HeadCell } from '../components/SortableTable/SortableTableHeader/types'
import { isNumber } from './stringHelpers';

export const WITHDRAWAL_HEADCELLS: HeadCell[] = [
  {
    id: 'submitted',
    numeric: false,
    disablePadding: true,
    label: 'Submitted',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status',
  },
  {
    id: 'effective',
    numeric: false,
    disablePadding: true,
    label: 'Effective',
  },
  {
    id: 'student',
    numeric: false,
    disablePadding: true,
    label: 'Student',
  },
  {
    id: 'grade',
    numeric: false,
    disablePadding: true,
    label: 'Grade',
  },
  {
    id: 'soe',
    numeric: false,
    disablePadding: true,
    label: 'SoE',
  },
  {
    id: 'funding',
    numeric: false,
    disablePadding: true,
    label: 'Funding',
  },
  {
    id: 'emailed',
    numeric: false,
    disablePadding: true,
    label: 'Emailed',
  },
]

export const ANNOUNCEMENT_HEADCELLS: HeadCell[] = [
  {
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'Date',
  },
  {
    id: 'subject',
    numeric: false,
    disablePadding: true,
    label: 'Subject',
  },
  {
    id: 'postedBy',
    numeric: false,
    disablePadding: true,
    label: 'Posted By',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status',
  },
]

export const APPLICATION_HEADCELLS: HeadCell[] = [
  // {
  // 	id: 'id',
  // 	numeric: false,
  // 	disablePadding: true,
  // 	label: 'ID'
  // },
  {
    id: 'submitted',
    numeric: false,
    disablePadding: true,
    label: 'Submitted',
  },
  {
    id: 'year',
    numeric: false,
    disablePadding: true,
    label: 'Year',
  },
  {
    id: 'student',
    numeric: false,
    disablePadding: true,
    label: 'Student',
  },
  {
    id: 'grade',
    numeric: false,
    disablePadding: true,
    label: 'Grade',
  },
  {
    id: 'sped',
    numeric: false,
    disablePadding: true,
    label: 'SPED',
  },
  {
    id: 'parent',
    numeric: false,
    disablePadding: true,
    label: 'Parent',
  },
  // {
  //   id: 'status',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'Status',
  // },
  {
    id: 'relation',
    numeric: false,
    disablePadding: true,
    label: 'Relation',
  },
  {
    id: 'verified',
    numeric: false,
    disablePadding: true,
    label: 'Verified',
  },
  {
    id: 'emailed',
    numeric: false,
    disablePadding: true,
    label: 'Emailed',
  },
  {
    id: 'Actions',
    numeric: false,
    disablePadding: true,
    label: 'Actions',
  },
]

export const ENROLLMENT_SCHOOL_HEADCELLS: HeadCell[] = [
  // {
  // 	id: 'id',
  // 	numeric: false,
  // 	disablePadding: true,
  // 	label: 'ID'
  // },
  {
    id: 'student',
    numeric: false,
    disablePadding: true,
    label: 'Student',
  },
  {
    id: 'year',
    numeric: false,
    disablePadding: true,
    label: 'Grade',
  },
  {
    id: 'student',
    numeric: false,
    disablePadding: true,
    label: 'City',
  },
  {
    id: 'grade',
    numeric: false,
    disablePadding: true,
    label: 'Parent',
  },
  {
    id: 'sped',
    numeric: false,
    disablePadding: true,
    label: '2021-22 SoE',
  },
  {
    id: 'parent',
    numeric: false,
    disablePadding: true,
    label: '2020-21 SoE',
  },
]

export const EMAIL_RECORDS_HEADCELLS: HeadCell[] = [
  {
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'Date'
  },
  {
    id: 'to',
    numeric: false,
    disablePadding: true,
    label: 'To'
  },
  {
    id: 'email_template',
    numeric: false,
    disablePadding: true,
    label: 'Email Template'
  },
  {
    id: 'subject',
    numeric: false,
    disablePadding: true,
    label: 'Subject'
  },
  {
    id: 'from',
    numeric: false,
    disablePadding: true,
    label: 'From'
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status'
  }
]

export const ENROLLMENT_PACKET_HEADCELLS: HeadCell[] = [
  // {
  //   id: 'id',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'ID',
  // },
  {
    id: 'submitted',
    numeric: false,
    disablePadding: true,
    label: 'Submitted',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status',
  },
  {
    id: 'deadline',
    numeric: false,
    disablePadding: true,
    label: 'Deadline',
  },
  {
    id: 'student',
    numeric: false,
    disablePadding: true,
    label: 'Student',
  },
  {
    id: 'grade',
    numeric: false,
    disablePadding: true,
    label: 'Grade',
  },
  {
    id: 'parent',
    numeric: false,
    disablePadding: true,
    label: 'Parent',
  },
  {
    id: 'studentStatus',
    numeric: false,
    disablePadding: true,
    label: 'Student',
  },
  {
    id: 'emailed',
    numeric: false,
    disablePadding: true,
    label: 'Emailed',
  },
]

export const SCHOOL_PARTNER_HEADCELLS: HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Partner Name',
  },
  {
    id: 'abbreviation',
    numeric: false,
    disablePadding: true,
    label: 'Abbreviation',
  },
]

export const USERS_HEADCELLS: HeadCell[] = [
  {
    id: 'user_id',
    numeric: false,
    disablePadding: true,
    label: 'ID',
  },
  {
    id: 'first_name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email',
  },
  {
    id: 'level',
    numeric: false,
    disablePadding: true,
    label: 'Level',
  },
  {
    id: 'last_login',
    numeric: false,
    disablePadding: true,
    label: 'Last Login',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'Status',
  },
  {
    id: 'can_emulate',
    numeric: false,
    disablePadding: true,
    label: 'Can Emulate',
  },
]
