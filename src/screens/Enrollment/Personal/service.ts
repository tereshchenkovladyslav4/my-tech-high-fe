import { gql } from '@apollo/client'

export const enrollmentPersonalMutation = gql`
  mutation SaveEnrollmentPacketPersonal($enrollmentPacketPersonalInput: EnrollmentPacketPersonalInput!) {
    saveEnrollmentPacketPersonal(enrollmentPacketPersonalInput: $enrollmentPacketPersonalInput) {
      packet {
        packet_id
      }
      student {
        student_id
      }
    }
  }
`
