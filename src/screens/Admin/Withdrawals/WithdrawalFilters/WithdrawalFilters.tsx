import { Button, Card, Box } from '@mui/material'
import React from 'react'
import { MTHBLUE, BUTTON_LINEAR_GRADIENT, WITHDRAWAL_STATUS_LABEL } from '../../../../utils/constants';

const WithdrawalFilters = ({ filters, setFilters, withdrawCount }) => {
	const handleSelectFilter = (value) => {
		if (filters.includes(value)) {
			setFilters(filters.filter((item) => item !== value))
		} else {
			setFilters([...filters, ...[value]])
		}
	}
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				paddingX: '100px',
				marginY: 2,
			}}
		>
			{WITHDRAWAL_STATUS_LABEL.map((label) => (
				<Button
					variant={filters.includes(label) ? 'text' : 'outlined'}
					sx={{
						background: filters.includes(label) && BUTTON_LINEAR_GRADIENT,
						color: filters.includes(label) ? 'white' : MTHBLUE,
						borderRadius: 2,
						textTransform: 'none',
						height: 25,
						whiteSpace: 'nowrap',
					}}
					onClick={() => handleSelectFilter(label)}
				>
					{label} ({withdrawCount && withdrawCount[label] ? withdrawCount[label] : 0})
				</Button>
			))}
		</Box>
	)
}

export default WithdrawalFilters
