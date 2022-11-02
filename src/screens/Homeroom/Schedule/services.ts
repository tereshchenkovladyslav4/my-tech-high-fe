import { gql } from '@apollo/client'

export const getActiveScheduleSchoolYearsQuery = gql`
  query ActiveScheduleSchoolYears($studentId: Int!) {
    activeScheduleSchoolYears(studentId: $studentId) {
      school_year_id
      date_begin
      date_end
    }
  }
`

export const getStudentPeriodsQuery = gql`
  query StudentPeriods($studentId: ID!, $schoolYearId: ID!, $diplomaSeekingPath: String) {
    studentPeriods(studentId: $studentId, schoolYearId: $schoolYearId, diplomaSeekingPath: $diplomaSeekingPath) {
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
            reduce_funds
            reduce_funds_notification
            display_notification
            course_notification
            Provider {
              id
              name
              reduce_funds
              reduce_funds_notification
            }
          }
          AltCourses {
            id
            provider_id
            name
            min_alt_grade
            max_alt_grade
            website
            reduce_funds
            reduce_funds_notification
            display_notification
            course_notification
            Provider {
              id
              name
              reduce_funds
              reduce_funds_notification
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
            reduce_funds
            reduce_funds_notification
            display_notification
            course_notification
            Provider {
              id
              name
              reduce_funds
              reduce_funds_notification
            }
          }
          AltCourses {
            id
            provider_id
            name
            min_alt_grade
            max_alt_grade
            website
            reduce_funds
            reduce_funds_notification
            display_notification
            course_notification
            Provider {
              id
              name
              reduce_funds
              reduce_funds_notification
            }
          }
        }
      }
    }
  }
`
