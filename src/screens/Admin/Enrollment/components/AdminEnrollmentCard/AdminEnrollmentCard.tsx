import { Card, CardMedia, CardContent } from '@mui/material'
import React from 'react'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { AdminEnrollmentCardTemplateType } from './types'
import EastIcon from '@mui/icons-material/East';
import { DASHBOARD } from '../../../../../utils/constants';
import { useHistory } from 'react-router-dom';

export const AdminEnrollmentCard: AdminEnrollmentCardTemplateType = ({
	title,
	link,
	img,
}) => {

	const history = useHistory()

	return (
			<Card 
				sx={{ 
					cursor: 'pointer',
					borderRadius: 2,
					marginX: 4
				}}
				onClick={() => history.push(link)}
			>
				<CardMedia
					component="img"
					src={img}
				/>
				<CardContent 
					sx={{
						display: 'flex', 
						flexDirection: 'row', 
						justifyContent: 'space-between',
						alignContent:'center'
					}}
				>
					<Subtitle>{title}</Subtitle>
					<EastIcon/>
				</CardContent>
			</Card>
	)
}
