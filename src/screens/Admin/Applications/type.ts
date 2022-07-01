export type FilterVM = {
  grades: string[]
  accountStatus: string[]
  status: string[]
  specialEd: string[]
  schoolYear: string[]
  visibility: string[]
}

export type FiltersProps = {
  filter: FilterVM | undefined
  setFilter: (value: FilterVM | undefined) => void
}

export type ApplicationTableProps = {
  filter: FilterVM | undefined
}

export type EmailTemplateVM = {
  bcc: string
  body: string
  from: string
  id: string
  standard_responses: string
  subject: string
  template_name: string
  title: string
}

export type SchoolYearVM = {
  date_begin: string
  date_end: string
  school_year_id: string
  midyear_application: boolean
  midyear_application_open: string
  midyear_application_close: string
}
