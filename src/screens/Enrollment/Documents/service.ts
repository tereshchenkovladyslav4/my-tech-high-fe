import { gql } from '@apollo/client'

export const uploadDocumentMutation = gql`
	mutation SaveEnrollmentPacketDocument($enrollmentPacketDocumentInput: EnrollmentPacketDocumentInput!) {
		saveEnrollmentPacketDocument(enrollmentPacketDocumentInput: $enrollmentPacketDocumentInput) {
			packet {
				packet_id
			}
		}
	}
`