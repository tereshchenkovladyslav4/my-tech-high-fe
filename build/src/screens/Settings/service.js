import {gql} from "../../../_snowpack/pkg/@apollo/client.js";
export const updateProfile = gql`
	mutation UpdateProfile($updateProfileInput: UpdateProfileInput!) {
		updateProfile(updateProfileInput: $updateProfileInput) {
			user_id
			email
		}
	}
`;
export const updatePassword = gql`
	mutation UpdateAccount($updateAccountInput: UpdateAccountInput!) {
		updateAccount(updateAccountInput: $updateAccountInput) {
			user_id
			email
			updatedAt
		}
}
`;
export const removeProfilePhoto = gql`
	mutation RemoveProfilePhoto {
		removeProfilePhoto {
		user_id
		email
		avatar_url
		}
	}
`;
