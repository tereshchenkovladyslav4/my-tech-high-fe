import { gql } from '@apollo/client'
export const updateApplicationSchoolYearByIds = gql`
  mutation updateApplicationSchoolYearByIds($updateApplicationSchoolYearInput: UpdateSchoolYearIdsInput!) {
    updateApplicationSchoolYearByIds(updateApplicationSchoolYearInput: $updateApplicationSchoolYearInput)
  }
`
export const updateApplicationMutation = gql`
  mutation UpdateApplication($updateApplicationInput: UpdateApplicationInput!) {
    updateApplication(updateApplicationInput: $updateApplicationInput) {
      status
      application_id
    }
  }
`
export const UpdateStudentMutation = gql`
  mutation UpdateStudent($updateStudentInput: UpdateStudentInput!) {
    updateStudent(updateStudentInput: $updateStudentInput)
  }
`
