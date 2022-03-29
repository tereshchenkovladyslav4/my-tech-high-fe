import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { EnrollmentPacketFilters } from './EnrollmentPacketFilters/EnrollmentPacketFilters'
import { EnrollmentPacketTable } from './EnrollmentPacketTable/EnrollmentPacketTable'

export const EnrollmentPackets = () => {
	const [filters, setFilters] = useState(['Submitted', 'Resubmitted'])
	return (
		<Box sx={{ marginX: 4 }}>
			<Grid container rowSpacing={2}>
				<Grid item xs={12}>
					<EnrollmentPacketFilters filters={filters} setFilters={setFilters} />
				</Grid>
				<Grid item xs={12}>
					<EnrollmentPacketTable filters={filters} />
				</Grid>
			</Grid>
		</Box>
	)
}