import { Grid } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import { WithdrawalTable } from './WithdrawalTable'

const Withdrawals = () => {
	return (
		<Box sx={{ marginX: 4 }}>
			<Grid container rowSpacing={2}>
				<Grid item xs={12} />
				<Grid item xs={12}>
					<WithdrawalTable />
				</Grid>
			</Grid>
		</Box>
	)
}

export default Withdrawals
