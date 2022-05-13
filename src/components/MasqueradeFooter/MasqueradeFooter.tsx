import { Box, Avatar, Button } from '@mui/material'
import React from 'react'
import { Person } from '../../screens/HomeroomStudentProfile/Student/types'
import { Paragraph } from '../Typography/Paragraph/Paragraph'

export const MasqueradeFooter = ({me}) => {

	const getProfilePhoto = (person: Person) => {
    if (!person.photo) return 'image'

    const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
    return s3URL + person.photo
  }

	return (
		<Box 
			sx={{ 
				background: 'rgba(236, 89, 37, 0.7)', 
				width: '100%', 
				height: '100px', 
				bottom: 0, 
				zIndex: 999999, 
				position: 'absolute',
				display:'flex',
				justifyContent: 'space-between',
				paddingX: 10,
				alignContent: 'center',
			}} 
		>
		<Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
			<Avatar
				alt={me.first_name}
				variant='rounded'
				src={getProfilePhoto(me.profile)}
				sx={{marginRight: 2, height: 45, width: 45}}
			/>
			<Paragraph 
				size='large' 
				color='white'
				fontWeight='700'
			>
				You are currently acting as {me.first_name}
			</Paragraph>
		</Box>
		<Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
			<Button 
				variant='contained'
				onClick={() => {
					localStorage.removeItem('masquerade')
					location.reload()
				}}
				sx={{
					height: '53px',
					background: 'rgba(231, 231, 231, 1)',
					color: 'black',
					borderRadius: '33.33440017700195px',
					'&:hover': {
						background: '#000',
						color: '#fff',
					},
				}}
			> 
				Stop Acting as User
			</Button>
		</Box>
	</Box>
	)
}
