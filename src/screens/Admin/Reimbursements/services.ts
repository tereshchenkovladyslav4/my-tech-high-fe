import { gql } from '@apollo/client'

export const getSchoolYear = gql`
  query GetSchoolYear($school_year_id: ID!) {
    getSchoolYear(school_year_id: $school_year_id) {
      school_year_id
      reimbursements
      require_software
      direct_orders
      ScheduleBuilder {
        max_num_periods
        custom_built
        third_party_provider
      }
      ReimbursementSetting {
        id
        school_year_id
        information
        supplemental_reimbursements_forms
        supplemental_direct_order_forms
        technology_reimbursements_forms
        technology_direct_order_forms
        custom_reimbursements_forms
        custom_direct_order_forms
        is_merged_periods
        merged_periods
        merged_periods_reimbursements_forms
        merged_periods_direct_order_forms
        third_party_reimbursements_forms
        require_software_reimbursements_forms
        max_receipts
        require_passing_grade
        min_grade_percentage
        allow_delete
        allow_submit_with_updates_required
        auto_delete_updates_required
        num_days_delete_updates_required
        display_remaining_funds
        remaining_funds
      }
    }
  }
`

export const createOrUpdateReimbursementSetting = gql`
  mutation CreateOrUpdateReimbursementSetting($reimbursementSettingInput: ReimbursementSettingInput!) {
    createOrUpdateReimbursementSetting(reimbursementSettingInput: $reimbursementSettingInput) {
      id
    }
  }
`
