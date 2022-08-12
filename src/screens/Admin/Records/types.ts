export type FilterVM = {
  gradeLevel1: string
  gradeLevel2: string
  programYear: string
  status: string
  schoolOfEnrollment: string
  specialEd: string
  EnrollmentPacketDocuments: string
  other: string
  dateRange: {
    startDate: Date | null | undefined
    endDate: Date | null | undefined
  }
}

export type StudentFilesFolderProps = {
  filter: FilterVM | undefined
}

export type FilterComponentProps = {
  setFilter: (value: FilterVM | undefined) => void
}

export type SchoolYearsVM = {
  school_year_id: number
  date_begin: Date
  date_end: Date
  midyear_application: boolean
  midyear_application_open: Date
  midyear_application_close: Date
}

export type StudentRecord = {
  firstName: string
  lastName: string
}
