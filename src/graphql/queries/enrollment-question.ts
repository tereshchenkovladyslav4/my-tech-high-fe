import { gql } from '@apollo/client'

export const getEnrollmentQuestionsGql = gql`
	query getEnrollmentQuestions($input: EnrollmentQuestionsInput) {
		getEnrollmentQuestions(input: $input) {
			id
			tab_name
			is_active
			region_id
			groups {
				id
				group_name
				tab_id
				order
				questions {
					id
					question
					group_id
					order
					options
					additional
					additional2
					required
					removable
					type
					slug
					default_question
					display_admin
					validation
				}
			}
		}
	}
`