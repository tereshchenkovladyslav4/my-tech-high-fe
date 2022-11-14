export type SchedulePeriod = {
  CourseId: number
  PeriodId: number
  ProviderId: number
  ScheduleId: number
  SubjectId: number
  TitleId: number
  course_type: string
  custom_build_description: string
  osse_coures_name: string
  osse_district_school: string
  osse_school_district_name: string
  schedule_period_id: number
  tp_addtional_specific_course_website: string
  tp_course_name: string
  tp_phone_number: string
  tp_provider_name: string
  tp_specific_course_website: string
  update_required: boolean
}

export type SchedulePeriodHistory = {
  CourseId: number
  PeriodId: number
  ProviderId: number
  ScheduleHistoryId: number
  SubjectId: number
  TitleId: number
  course_type: string
  custom_build_description: string
  osse_coures_name: string
  osse_district_school: string
  osse_school_district_name: string
  schedule_period_history_id: number
  tp_addtional_specific_course_website: string
  tp_course_name: string
  tp_phone_number: string
  tp_provider_name: string
  tp_specific_course_website: string
  update_required: boolean
  ScheduleHistory: {
    schedule_history_id: number
    date_accepted: string
  }
}
