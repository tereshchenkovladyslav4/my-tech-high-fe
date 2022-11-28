import { ReduceFunds, ScheduleStatus } from '@mth/enums'
import { ScheduleBuilder } from '@mth/models'

export type SchoolYear = {
  school_year_id: number
  date_begin: string
  date_end: string
  label?: string
  midyear_application: boolean
  midyear_application_open: string
  midyear_application_close: string
  testing_preference_title: string
  testing_preference_description: string
  opt_out_form_title: string
  opt_out_form_description: string
  grades: string
  date_reg_open: string
  date_reg_close: string
  schedule_builder_open: string
  schedule_builder_close: string
  second_semester_open: string
  second_semester_close: string
  midyear_schedule_open: string
  midyear_schedule_close: string
  homeroom_resource_open: string
  homeroom_resource_close: string
  schedule: boolean
  diploma_seeking: boolean
  ScheduleBuilder?: ScheduleBuilder
  IsCurrentYear: boolean
  IsScheduleBuilderOpen: boolean
  IsSecondSemesterOpen: boolean
  ScheduleStatus: ScheduleStatus
  reimbursements: ReduceFunds
  require_software: boolean
  direct_orders: ReduceFunds
}
