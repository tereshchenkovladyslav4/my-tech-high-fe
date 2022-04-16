import { gql } from '@apollo/client'

export const updateProfile = gql`
mutation UpdateStudentProfile($updateStudentProfileInput: UpdateStudentProfileInput!) {
    updateStudentProfile(updateStudentProfileInput: $updateStudentProfileInput) {
      student_id
      person {
        preferred_first_name
        preferred_last_name
        email
        photo
      }
    }
  }
`

export const removeProfilePhoto = gql`
mutation RemoveStudentProfilePhoto($updateStudentProfileInput: UpdateStudentProfileInput!) {
    removeStudentProfilePhoto(updateStudentProfileInput: $updateStudentProfileInput) {
      student_id
      person {
        preferred_first_name
        preferred_last_name
        email
        photo
      }
    }
  }
`