import { gql } from '@apollo/client'

export const getStudentPeriodsQuery = gql`
  query StudentPeriods($studentId: ID!, $schoolYearId: ID!) {
    studentPeriods(studentId: $studentId, schoolYearId: $schoolYearId) {
      id
      period
      category
      message_period
      notify_period
      Subjects {
        subject_id
        name
        Titles {
          title_id
          name
          display_notification
          subject_notification
          reduce_funds
          reduce_funds_notification
          custom_built
          custom_built_description
          third_party_provider
          Courses {
            id
            provider_id
            name
            min_alt_grade
            max_alt_grade
            website
            Provider {
              id
              name
            }
          }
          AltCourses {
            id
            provider_id
            name
            min_alt_grade
            max_alt_grade
            website
            Provider {
              id
              name
            }
          }
        }
        AltTitles {
          title_id
          name
          display_notification
          subject_notification
          reduce_funds
          reduce_funds_notification
          min_alt_grade
          max_alt_grade
          custom_built
          custom_built_description
          third_party_provider
          Courses {
            id
            provider_id
            name
            min_alt_grade
            max_alt_grade
            website
            Provider {
              id
              name
            }
          }
          AltCourses {
            id
            provider_id
            name
            min_alt_grade
            max_alt_grade
            website
            Provider {
              id
              name
            }
          }
        }
      }
    }
  }
`
