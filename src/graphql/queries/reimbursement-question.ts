import { gql } from '@apollo/client'

export const getReimbursementQuestionsQuery = gql`
  query ReimbursementQuestions(
    $isDirectOrder: Boolean!
    $reimbursementFormType: ReimbursementFormType!
    $schoolYearId: Int!
  ) {
    reimbursementQuestions(
      isDirectOrder: $isDirectOrder
      reimbursementFormType: $reimbursementFormType
      schoolYearId: $schoolYearId
    ) {
      reimbursement_question_id
      required
      SchoolYearId
      type
      sortable
      slug
      reimbursement_form_type
      question
      priority
      options
      is_direct_order
      display_for_admin
      default_question
      additional_question
      SchoolYear {
        school_year_id
      }
    }
  }
`
