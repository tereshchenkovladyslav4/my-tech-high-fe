import { gql } from '@apollo/client'

export const saveHomeroomSettingMutation = gql`
  mutation CreateOrUpdateHomeroomSetting($createHomeroomSettingInput: CreateOrUpdateHomeroomSettingInput!) {
    createOrUpdateHomeroomSetting(createHomeroomSettingInput: $createHomeroomSettingInput) {
      id
    }
  }
`

/*
CreateOrUpdateReimbursementReceipts Variables Structure
{
  "createHomeroomSettingInput": {
    "id": null,
    "SchoolYearId": null,
    "days_to_submit_early": null,
    "diploma": null,
    "gender": null,
    "grades_by_subject": null,
    "grading_scale_percentage": null,
    "max_of_excused_learning_logs_allowed": null,
    "notify_when_graded": null,
    "notify_when_resubmit_required": null,
    "passing_average": null,
    "special_education": null,
    "update_required_schedule_to_sumbit": null,
    "zero_count": null
  }
}
*/
