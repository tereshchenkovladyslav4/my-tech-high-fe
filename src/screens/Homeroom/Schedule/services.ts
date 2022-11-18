import { gql } from '@apollo/client'

export const getActiveScheduleSchoolYearsQuery = gql`
  query ActiveScheduleSchoolYears($studentId: Int!) {
    activeScheduleSchoolYears(studentId: $studentId) {
      school_year_id
      date_begin
      date_end
      IsCurrentYear
      IsScheduleBuilderOpen
      IsSecondSemesterOpen
      ScheduleStatus
      ScheduleBuilder {
        split_enrollment
      }
    }
  }
`

export const ProviderFragment = gql`
  fragment providerFragment on Provider {
    __typename
    id
    name
    reduce_funds
    reduce_funds_notification
    multiple_periods
    multi_periods_notification
    Periods {
      id
      period
      category
    }
  }
`

export const CourseFragment = gql`
  fragment courseFragment on Course {
    __typename
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
  }
`

export const TitleFragment = gql`
  ${CourseFragment}
  fragment titleFragment on Title {
    __typename
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
      ...courseFragment
    }
    AltCourses {
      ...courseFragment
    }
  }
`

export const getStudentPeriodsQuery = gql`
  ${CourseFragment}
  ${TitleFragment}
  query StudentPeriods($studentId: ID!, $schoolYearId: ID!, $diplomaSeekingPath: String) {
    studentPeriods(studentId: $studentId, schoolYearId: $schoolYearId, diplomaSeekingPath: $diplomaSeekingPath) {
      id
      period
      category
      message_period
      notify_period
      semester
      Subjects {
        subject_id
        name
        Titles {
          ...titleFragment
        }
        AltTitles {
          ...titleFragment
        }
        Courses {
          ...courseFragment
        }
        AltCourses {
          ...courseFragment
        }
      }
    }
  }
`

export const getStudentProvidersQuery = gql`
  ${ProviderFragment}
  query StudentProviders($schoolYearId: ID!) {
    studentProviders(schoolYearId: $schoolYearId) {
      ...providerFragment
    }
  }
`
