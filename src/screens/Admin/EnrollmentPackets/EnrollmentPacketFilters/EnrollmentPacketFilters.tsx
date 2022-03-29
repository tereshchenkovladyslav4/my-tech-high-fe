import { Button, Card } from '@mui/material'
import React from 'react'
import { MTHBLUE, BUTTON_LINEAR_GRADIENT } from '../../../../utils/constants'

export const EnrollmentPacketFilters = ({ filters, setFilters }) => {
	const handleSelectFilter = (value) => {
		if (filters.includes(value)) {
			setFilters(filters.filter(item => item !== value))
		} else {
			setFilters([...filters, ...[value]])
		}
	}
	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				paddingX: '100px',
				marginY: 2,
				paddingY: 3
			}}
		>
			<Button
				variant={filters.includes('Not Started') ? 'text' : 'outlined'}
				sx={{
					background: filters.includes('Not Started') && BUTTON_LINEAR_GRADIENT,
					color: filters.includes('Not Started') ? 'white' : MTHBLUE,
					borderRadius: 2,
					textTransform: 'none',
					height: 25,
					width: '115px'
				}}
				onClick={() => handleSelectFilter('Not Started')}
			>
				Not Started
			</Button>
			<Button
				variant={filters.includes('Started') ? 'text' : 'outlined'}
				sx={{
					borderRadius: 2,
					textTransform: 'none',
					height: 25,
					background: filters.includes('Started') && BUTTON_LINEAR_GRADIENT,
					color: filters.includes('Started') ? 'white' : MTHBLUE,
					width: '115px'
				}}
				onClick={() => handleSelectFilter('Started')}
			>
				Started
			</Button>
			<Button
				variant={filters.includes('Missing Info') ? 'text' : 'outlined'}
				sx={{
					background: filters.includes('Missing Info') && BUTTON_LINEAR_GRADIENT,
					color: filters.includes('Missing Info') ? 'white' : MTHBLUE,
					borderRadius: 2,
					textTransform: 'none',
					height: 25,
					width: '115px'
				}}
				onClick={() => handleSelectFilter('Missing Info')}
			>
				Missing Info
			</Button>
			<Button
				variant={filters.includes('Submitted') ? 'text' : 'outlined'}
				sx={{
					background: filters.includes('Submitted') && BUTTON_LINEAR_GRADIENT,
					color: filters.includes('Submitted') ? 'white' : MTHBLUE,
					borderRadius: 2,
					textTransform: 'none',
					height: 25,
					width: '115px'
				}}
				onClick={() => handleSelectFilter('Submitted')}
			>
				Submitted
			</Button>
			<Button
				variant={filters.includes('Resubmitted') ? 'text' : 'outlined'}
				sx={{
					borderRadius: 2,
					textTransform: 'none',
					height: 25,
					background: filters.includes('Resubmitted') && BUTTON_LINEAR_GRADIENT,
					color: filters.includes('Resubmitted') ? 'white' : MTHBLUE,
					width: '115px'
				}}
				onClick={() => handleSelectFilter('Resubmitted')}
			>
				Resubmitted
			</Button>
			<Button
				variant={filters.includes('Age Issue') ? 'text' : 'outlined'}
				sx={{
					background: filters.includes('Age Issue') && BUTTON_LINEAR_GRADIENT,
					color: filters.includes('Age Issue') ? 'white' : MTHBLUE,
					borderRadius: 2,
					textTransform: 'none',
					height: 25,
					width: '115px'
				}}
				onClick={() => handleSelectFilter('Age Issue')}
			>
				Age Issue
			</Button>
			<Button
				variant={filters.includes('Conditional') ? 'text' : 'outlined'}
				sx={{
					background: filters.includes('Conditional') && BUTTON_LINEAR_GRADIENT,
					color: filters.includes('Conditional') ? 'white' : MTHBLUE,
					borderRadius: 2,
					textTransform: 'none',
					height: 25,
					width: '115px'
				}}
				onClick={() => handleSelectFilter('Conditional')}
			>
				Conditional
			</Button>
		</Card>
	)
}
