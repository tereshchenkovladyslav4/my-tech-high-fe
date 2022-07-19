import { Card, CardMedia, CardContent, Box, Typography  } from '@mui/material'
import React from 'react'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { CommunicationCardTemplateType } from './types'
import EastIcon from '@mui/icons-material/East';
import { useHistory } from 'react-router-dom';

export const CommunicationCard: CommunicationCardTemplateType = ({
	title,
	link,
	img,
	description = ''
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
				<Box sx={{position:'relative'}}>	
					<CardMedia
						component="img"
						src={img}
						sx={{ height: 240 }}
					/>
					<Box sx={{ width: '100%', position: 'absolute', left: 0, textAlign: 'center', top: '100px', color: 'white' }}>
						<Typography fontSize='40px' component='div' fontWeight='600'>
							{title}
						</Typography>
					</Box>
				</Box>
				<CardContent 					
				>
					<Box sx={{
						display: 'flex', 
						flexDirection: 'row', 
						justifyContent: 'space-between',
						alignContent:'center'
					}}>
						<Subtitle size='large' fontWeight='700'>{title}</Subtitle>									
						<EastIcon/>					
					</Box>
					<Box sx={{textAlign:'left'}}>
						<Typography color='#A1A1A1' fontSize='16px' fontWeight='600' sx={{ visibility: description ? "shown" : "hidden" }}>
							{description || "N/A"}
						</Typography>
					</Box>
				</CardContent>
			</Card>
	)
}
