import {gql} from "../../../_snowpack/pkg/@apollo/client.js";
export const confirmAccount = gql`
	mutation Verify($verifyInput: VerifyInput!) {
		verify(verifyInput: $verifyInput) {
			email
			status
			token
		}
	}
`;
