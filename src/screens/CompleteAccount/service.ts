import { gql } from '@apollo/client'

export const confirmAccount = gql`
	mutation Verify($verifyInput: VerifyInput!) {
		verify(verifyInput: $verifyInput) {
			email
			status
			token
		}
	}
`

