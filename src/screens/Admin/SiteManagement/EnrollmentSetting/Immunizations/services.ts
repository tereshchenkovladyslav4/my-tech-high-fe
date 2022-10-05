import { gql } from '@apollo/client'

export const getSchoolYears = gql`
  query SchoolYears {
    schoolYears {
      school_year_id
      date_begin
      date_end
    }
  }
`

export const getImmunizationSettings = gql`
  query ImmunizationSettings($where: FindImmunizationSettingsInput) {
    immunizationSettings(where: $where) {
      results {
        id
        title
        region_id
        min_grade_level
        max_grade_level
        min_school_year_required
        max_school_year_required
        immunity_allowed
        exempt_update
        level_exempt_update
        consecutive_vaccine
        min_spacing_date
        min_spacing_interval
        max_spacing_date
        max_spacing_interval
        email_update_template
        tooltip
        is_enabled
        order
      }
    }
  }
`
export const saveImmunizationSettings = gql`
  mutation saveImmunizationSettings($input: UpdateImmunizationSettingsInput!) {
    saveImmunizationSettings(updateImmunizationSettingsInput: $input) {
      title
    }
  }
`

export const deleteImmunizationSetting = gql`
  mutation deleteImmunizationSetting($id: Int!) {
    deleteImmunizationSetting(id: $id)
  }
`
export const updateImmunizationOrderMutation = gql`
  mutation ($input: updateImmunizationOrderInput!) {
    updateImmunizationOrder(ids: $input)
  }
`
