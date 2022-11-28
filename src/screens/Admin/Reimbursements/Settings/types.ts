export type RemainingFund = {
  grade: number
  amount: number | null
}

export type ReimbursementSetting = {
  id: number | null
  school_year_id: number | null
  information: string | null
  supplemental_reimbursements_forms: number | null
  supplemental_direct_order_forms: number | null
  technology_reimbursements_forms: number | null
  technology_direct_order_forms: number | null
  custom_reimbursements_forms: number | null
  custom_direct_order_forms: number | null
  is_merged_periods: boolean | null
  merged_periods: string | null
  merged_periods_reimbursements_forms: number | null
  merged_periods_direct_order_forms: number | null
  third_party_reimbursements_forms: number | null
  require_software_reimbursements_forms: number | null
  max_receipts: number | null
  require_passing_grade: boolean | null
  min_grade_percentage: number | null
  allow_delete: boolean | null
  allow_submit_with_updates_required: boolean | null
  auto_delete_updates_required: boolean | null
  num_days_delete_updates_required: number | null
  display_remaining_funds: boolean | null
  remaining_funds: string | null

  //  Temp fields
  RemainingFunds?: RemainingFund[]
}
