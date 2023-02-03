import { gql } from '@apollo/client'

export const getQuestionsGql = gql`
  query getEnrollmentQuestions($input: EnrollmentQuestionsInput) {
    getEnrollmentQuestions(input: $input) {
      id
      tab_name
      is_active
      region_id
      groups {
        id
        group_name
        tab_id
        order
        questions {
          id
          question
          group_id
          order
          options
          additional_question
          required
          type
          slug
          default_question
          display_admin
          validation
        }
      }
    }
  }
`

export const saveQuestionsGql = gql`
  mutation saveEnrollmentQuestions($input: [NewEnrollmentQuestionTabInput!]!) {
    saveEnrollmentQuestions(data: $input)
  }
`
export const deleteQuestionsGql = gql`
  mutation deleteEnrollmentQuestions($id: Int!) {
    deleteEnrollmentQuestions(id: $id)
  }
`
export const deleteQuestionGroupGql = gql`
  mutation deleteEnrollmentQuestionGroup($id: Int!) {
    deleteEnrollmentQuestionGroup(id: $id)
  }
`

export const getCountiesByRegionId = gql`
  query getCounties($regionId: ID!) {
    getCounties(id: $regionId) {
      id
      county_name
    }
  }
`
export const getActiveSchoolYearsByRegionId = gql`
  query GetActiveSchoolYears($regionId: ID!) {
    getSchoolYearsByRegionId(region_id: $regionId) {
      date_begin
      date_end
      date_reg_close
      date_reg_open
      grades
      special_ed
      special_ed_options
      birth_date_cut
      school_year_id
      midyear_application
    }
  }
`

export const getAllRegion = gql`
  query Regions {
    regions {
      id
      name
    }
  }
`

export const getSpecialEdsByRegionId = gql`
  query Region($regionId: ID!) {
    region(id: $regionId) {
      SchoolYears {
        school_year_id
        special_ed
        special_ed_options
        date_begin
      }
    }
  }
`
