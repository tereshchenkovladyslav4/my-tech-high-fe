import { Box, Grid } from '@mui/material'
import React, { useState } from 'react'
import { ApplicationTable } from './ApplicationTable/ApplicationTable'
import { Filters } from './Filters/Filters'

export const Applications = () => {
	const [filter, setFilter] = useState({})
	return (
		<Box sx={{ marginX: 4 }}>
			<Grid container rowSpacing={2}>
				<Grid item xs={12}>
					<Filters filter={filter} setFilter={setFilter} />
				</Grid>
				<Grid item xs={12}>
					<ApplicationTable filter={filter} />
				</Grid>
			</Grid>
		</Box>
	)
}