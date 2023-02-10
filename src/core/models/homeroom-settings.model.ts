export type HomeroomSettingsModel = {
  id?: number
  SchoolYearId: number
  days_to_submit_early: number
  max_of_excused_learning_logs_allowed: number
  grading_scale_percentage: number
  passing_average: number
  grades_by_subject: boolean
  notify_when_graded: boolean
  update_required_schedule_to_sumbit: boolean
  notify_when_resubmit_required: boolean
  gender: boolean
  special_education: boolean
  diploma: boolean
  zero_count: boolean
}
