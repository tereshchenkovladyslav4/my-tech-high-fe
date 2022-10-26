import { gql } from '@apollo/client'

export const getStudents = gql`
  query studentsForSOE($skip: Int, $take: Int, $filter: StudentFilters, $sort: String, $search: String) {
    studentsForSOE(skip: $skip, take: $take, filter: $filter, sort: $sort, search: $search) {
      results {
        currentSoe {
          school_partner_id
        }
        status {
          status
        }
      }
      total
      page_total
    }
  }
`

export const GetSchoolsOfEnrollment = gql`
  query GetSchoolsOfEnrollmentByRegion($schoolPartnerArgs: SchoolPartnerArgs!) {
    getSchoolsOfEnrollmentByRegion(schoolPartnerArgs: $schoolPartnerArgs) {
      school_partner_id
      name
      abbreviation
      photo
      active
    }
  }
`
