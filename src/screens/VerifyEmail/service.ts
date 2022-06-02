import { gql } from '@apollo/client'

export const verifyEmail = gql`
	mutation VerifyEmail($verifyInput: VerifyInput!) {
		verifyEmail(verifyInput: $verifyInput) {
			email
			status
			token
		}
	}
`

