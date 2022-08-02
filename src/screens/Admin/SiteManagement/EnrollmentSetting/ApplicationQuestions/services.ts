import { gql } from '@apollo/client'

export const getQuestionsGql = gql`
  query getApplicationQuestions($input: ApplicatinQuestionsInput) {
    getApplicationQuestions(input: $input) {
      id
      type
      order
      question
      options
      required
      validation
      student_question
      default_question
      slug
      main_question
      additional_question
    }
  }
`

export const saveQuestionsGql = gql`
  mutation saveApplicationQuestions($input: [NewApplicationQuestionsInput!]!) {
    saveApplicationQuestions(data: $input)
  }
`
export const deleteQuestionGql = gql`
  mutation deleteApplicationQuestion($id: Int!) {
    deleteApplicationQuestion(id: $id)
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

export const getSchoolDistrictsByRegionId = gql`
  query SchoolDistrict($regionId: ID!) {
    schoolDistrict(id: $regionId) {
      id
      school_district_name
      Region_id
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
