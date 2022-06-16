import { gql } from '@apollo/client'

export const newParentApplicationMutation = gql`
  mutation NewParentApplication($createApplicationInput: CreateApplicationInput!) {
    createNewApplication(createApplicationInput: $createApplicationInput) {
      parent {
        parent_id
      }
    }
  }
`

export const checkEmailQuery = gql`
  query CheckEmail($email: String!) {
    emailTaken(email: $email)
  }
`

export const getSchoolYearQuery = gql`
  query SchoolYears {
    schoolYears {
      school_year_id
      date_begin
      date_end
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
      birth_date_cut
      school_year_id
    }
  }
`

export const getQuestionsGql = gql`
  query getApplicationQuestions($input: ApplicatinQuestionsInput) {
    getApplicationQuestions(input: $input) {
      id
      type
      order
      question
      options
      required
      default_question
      student_question
      validation
      region_id
      slug
    }
  }
`