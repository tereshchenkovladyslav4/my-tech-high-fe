export type FilterVM = {
  schoolYearId: number
  gradeLevel1: string
  gradeLevel2: string
  programYear: string
  programYearStatus: string
  enrollmentStatus: string
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

export type StudentFilesModalProps = {
  schoolYearId: number | undefined
  record: StudentRecord | undefined
  handleDownload: (value: StudentRecord[], isIndividualFile?: boolean) => void
  handleModem: () => void
  refetch: () => void
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

export type StudentRecordFile = {
  fileId: number
  fileName: string
  filePath: string
  fileKind: string
}

export type StudentRecord = {
  recordId: number
  studentId: number
  firstName: string
  lastName: string
  files: StudentRecordFile[]
}

export type DownloadStudentRecordFilesVM = {
  studentName: string
  fileIds: number[]
  isIndividualFile?: boolean
}
