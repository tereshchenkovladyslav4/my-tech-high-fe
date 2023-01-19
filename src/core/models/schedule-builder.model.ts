export type ScheduleBuilder = {
  split_enrollment: boolean
  split_enrollment_grades?: string
  always_unlock: boolean
  max_num_periods: number
  custom_built: boolean
  third_party_provider: boolean
  parent_tooltip?: string
  id: number
}
