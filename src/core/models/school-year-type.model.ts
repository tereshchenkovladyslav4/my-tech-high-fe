export type SchoolYearType = {
  school_year_id: number | string
  enrollment_packet: boolean
  schedule: boolean
  date_begin?: string
  date_end?: string
  date_reg_open?: string
  date_reg_close?: string
  midyear_application: boolean
  midyear_application_open?: string
  midyear_application_close?: string
}
