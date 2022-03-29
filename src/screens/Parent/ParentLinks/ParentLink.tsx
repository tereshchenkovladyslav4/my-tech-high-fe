import { Grid } from '@mui/material'
import React from 'react'
import { DASHBOARD } from '../../../utils/constants'
import withdrawlsImg from '../../../assets/withdrawls.png'
import { ParentLinkCard } from './components/AdminEnrollmentCard/ParentLinkCard'


export const ParentLink = () => {
	return (
		<Grid container rowSpacing={4} columnSpacing={0} sx={{ paddingX: 2, marginTop: 4 }}>
			<Grid item xs={4}>
				<ParentLinkCard
					title='Withdrawal'
					link={DASHBOARD}
					img={withdrawlsImg}
				/>
			</Grid>
		</Grid>
	)
}
