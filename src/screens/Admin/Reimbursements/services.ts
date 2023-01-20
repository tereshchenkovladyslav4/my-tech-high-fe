import { gql } from '@apollo/client'

export const getSchoolYear = gql`
  query GetSchoolYear($school_year_id: ID!) {
    getSchoolYear(school_year_id: $school_year_id) {
      school_year_id
      reimbursements
      require_software
      direct_orders
      direct_order_open
      direct_order_close
      reimbursement_open
      reimbursement_close
      custom_built_open
      custom_built_close
      require_software_open
      require_software_close
      third_party_open
      third_party_close
      mid_direct_order_open
      mid_direct_order_close
      mid_reimbursement_open
      mid_reimbursement_close
      mid_custom_built_open
      mid_custom_built_close
      mid_require_software_open
      mid_require_software_close
      mid_third_party_open
      mid_third_party_close
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
      direct_orders_technology_instructions
      direct_orders_supplement_instructions
      direct_orders_custom_built_instructions
      reimbursements_technology_instructions
      reimbursements_supplement_instructions
      reimbursements_custom_built_instructions
      reimbursements_third_party_instructions
      reimbursements_required_software_instructions
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
