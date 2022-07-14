import { Card, CardMedia, CardContent } from '@mui/material'
import React from 'react'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { CommunicationCardTemplateType } from './types'
import EastIcon from '@mui/icons-material/East';
import { DASHBOARD } from '../../../../../utils/constants';
import { useHistory } from 'react-router-dom';

export const CommunicationCard: CommunicationCardTemplateType = ({
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
					<Subtitle size='large' fontWeight='700'>{title}</Subtitle>
					<EastIcon/>
				</CardContent>
			</Card>
	)
}
