import { gql } from '@apollo/client'

export const getReimbursementRequestsQuery = gql`
  query ReimbursementRequests($param: ReimbursementRequestSearchInput!) {
    reimbursementRequests(param: $param) {
      reimbursement_request_id
      SchoolYearId
      SchoolYear {
        school_year_id
      }
      StudentId
      Student {
        student_id
        person {
          person_id
          first_name
          last_name
          email
        }
      }
      periods
      meta
      is_direct_order
      form_type
      date_submitted
      date_paid
      date_ordered
      ParentId
      signature_file_id
      signature_name
      status
      total_amount
    }
  }
`
/*
// Variable Structure //
{
  "param": {
    "filter": {
      "SchoolYearId": number,
      "StudentIds": number[]
    }
  }
}
*/
