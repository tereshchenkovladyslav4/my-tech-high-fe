import { gql } from '@apollo/client'

export const enrollmentContactMutation = gql`
mutation SaveEnrollmentPacketEducation($enrollmentPacketEducationInput: EnrollmentPacketEducationInput!) {
  saveEnrollmentPacketEducation(enrollmentPacketEducationInput: $enrollmentPacketEducationInput) {
    packet {
      packet_id
    }
    student {
      student_id
    }
  }
}
`
