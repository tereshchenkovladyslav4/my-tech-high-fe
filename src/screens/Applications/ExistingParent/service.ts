import { gql } from '@apollo/client'

export const AddApplicationMutation = gql`
  mutation CreateNewStudentApplication($createApplicationInput: CreateStudentApplicationsInput!) {
    createNewStudentApplication(createApplicationInput: $createApplicationInput) {
      parent {
        parent_id
        person_id
      }
      students {
        student_id
        hidden
        packets {
          status
        }
        applications {
          status
        }
        current_school_year_status {
          student_id
          school_year_id
          application_id
          application_status
          application_school_year_id
          packet_id
          packet_status
        }
        person {
          email
          first_name
          gender
          last_name
          middle_name
          person_id
          preferred_first_name
          preferred_last_name
        }
        grade_levels {
          grade_level
        }
        status {
          student_id
          school_year_id
          status
        }
      }
    }
  }
`
export const getQuestionsGql = gql`
  query getExistApplicationQuestions($input: ApplicatinQuestionsInput) {
    getExistApplicationQuestions(input: $input) {
      id
      type
      order
      question
      options
      required
      validation
      default_question
      student_question
      slug
      additional_question
    }
  }
`
