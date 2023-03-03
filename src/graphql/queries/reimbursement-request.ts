import { gql } from '@apollo/client'

export const getReimbursementRequestsForStudentsQuery = gql`
  query ReimbursementRequestsForStudents($param: ReimbursementRequestSearchInput!) {
    reimbursementRequestsForStudents(param: $param) {
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
      ReimbursementReceipts {
        reimbursement_receipt_id
        ReimbursementRequestId
        file_id
        file_name
        amount
      }
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

export const getReimbursementRequestsQuery = gql`
  query ReimbursementRequests(
    $schoolYearId: Int!
    $skip: Int
    $take: Int
    $filter: ReimbursementRequestFilters
    $sort: String
    $search: String
  ) {
    reimbursementRequests(
      schoolYearId: $schoolYearId
      skip: $skip
      take: $take
      filter: $filter
      sort: $sort
      search: $search
    ) {
      total
      results {
        reimbursement_request_id
        form_type
        periods
        is_direct_order
        date_submitted
        date_paid
        date_ordered
        total_amount
        status
        Student {
          student_id
          person {
            first_name
            last_name
            email
            date_of_birth
          }
          parent {
            person {
              first_name
              last_name
              email
            }
          }
          grade_levels {
            school_year_id
            grade_level
          }
        }
      }
    }
  }
`

export const getReimbursementRequestQuery = gql`
  query ReimbursementRequest($reimbursementRequestId: Int!) {
    reimbursementRequest(reimbursementRequestId: $reimbursementRequestId) {
      reimbursement_request_id
      SchoolYearId
      StudentId
      form_type
      periods
      is_direct_order
      meta
      date_submitted
      date_paid
      date_ordered
      total_amount
      status
      Student {
        student_id
        person {
          first_name
          last_name
          email
          date_of_birth
        }
        parent {
          notes
          person {
            first_name
            last_name
            email
          }
          students {
            student_id
            person {
              first_name
              last_name
            }
          }
        }
        grade_levels {
          school_year_id
          grade_level
        }
        applications {
          application_id
          school_year_id
          midyear_application
        }
      }
      SchoolYear {
        reimbursements
        direct_orders
        ReimbursementSetting {
          max_receipts
          is_merged_periods
          merged_periods
          notification_grades
        }
      }
      ReimbursementReceipts {
        reimbursement_receipt_id
        ReimbursementRequestId
        file_id
        file_name
        amount
      }
    }
  }
`
