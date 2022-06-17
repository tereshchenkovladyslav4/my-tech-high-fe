import { gql } from '@apollo/client'

export const getWithdrawalsQuery = gql`
	query Withdrawals($take: Int, $sort: String, $skip: Int, $filter: JSON) {
		withdrawals(take: $take, sort: $sort, skip: $skip, filter: $filter) {
			page_total
			total
			results {
				withdrawal_id
				StudentId
				date
				date_effective
				date_emailed
				funding
				soe
				status
				student_name
				grade_level
			}
		}
	}
`

export const getWithdrawalsCountByStatusQuery = gql`
	query WithdrawalCountsByStatus($filter: JSON) {
		withdrawalCountsByStatus(filter: $filter) {
			error
			message
			results
		}
	}
`
