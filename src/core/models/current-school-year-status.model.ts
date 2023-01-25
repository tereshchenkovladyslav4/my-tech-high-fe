export type CurrentSchoolYearStatus = {
  application_id: number
  school_year_id: number
  grade_level: string
  special_ed_options?: string
  midyear_application?: string
  midyear_schedule_open?: string
  midyear_schedule_close?: string
  schedule_builder_open?: string
  schedule_builder_close?: string
  application_date_submitted?: string
  second_semester_close?: string
  second_semester_open?: string
  withdraw_deadline_num_days?: number
  enrollment_packet_date_deadline?: string
  application_date_accepted?: string
}
