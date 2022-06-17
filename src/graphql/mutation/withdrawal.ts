import { gql } from '@apollo/client';

export const saveWithdrawalMutation = gql`
	mutation SaveWithdrawal($withdrawalInput: WithdrawalInput!) {
		saveWithdrawal(withdrawalInput: $withdrawalInput)
	}
`
