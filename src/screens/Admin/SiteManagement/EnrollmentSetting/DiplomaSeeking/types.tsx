export type SchoolYear = {
  label: string
  value: number | string
}

export type SchoolYearItem = {
  date_begin: string
  date_end: string
  school_year_id: string
  midyear_application: number
  midyear_application_open: string
  midyear_application_close: string
  grades: string
}

export type DiplomaQuestionType = {
  id: string | number
  schoolYearId: string | number
  title: string
  description: string
  grades: string
}

export type DiplomaQuestionEditModalProps = {
  information: DiplomaQuestionType
  onClose: () => void
  refetch: () => void
  selectedSchoolYear: string
}
