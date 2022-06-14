import { Box, Button, Modal } from '@mui/material'
import React from 'react'
import { Title } from '../../../../../components/Typography/Title/Title'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle';
import { useMutation } from '@apollo/client';
import { ToggleSchoolPartnerMutation } from '../services';
import { toNumber } from 'lodash';
import { SchoolPartnerType } from '../types';


export const ArchiveSchoolPartnerModal = ({
	handleModem,
	el,
}: {
	handleModem: () => void,
	el: SchoolPartnerType
}) => {

	const text = toNumber(el.active) === 1 
		? 'Archive School Partner'
		: 'Unarchive School Partner'

	const subtext = toNumber(el.active) === 1  ?
		'Are you sure you want to archive this School Partner?' 
		: 'Are you sure you want to unarchive this School Partner?'


	const buttonText = toNumber(el.active) === 1  ? 'Archive' : 'Unarchive'
	
	const [ toggleSchoolPartner, {data, error, loading} ] = useMutation(ToggleSchoolPartnerMutation)

	const handleArchive = () => toggleSchoolPartner({
		variables: {
			schoolPartnerId: toNumber(el.school_partner_id)
		}
	}).then(() => {
		handleModem()
	})

	return (
		<Modal 
			open={true}
      onClose={() => handleModem()}
			>
				<Box
					sx={{
						width: 650,
						borderRadius: 3,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						border: 'none',
						bgcolor: 'background.paper',
						padding: 2,
						paddingX: '65px',
						position: 'absolute' as 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						boxShadow: 24,
						p: 4,
						paddingY: 6
					}}
				>
					<Title size={'medium'} fontWeight={'900'}> {text} </Title>
					<ErrorOutlineOutlinedIcon 
						sx={{
							height: 38,
							width: 38,
							marginY: 4,
						}}
					/>
					<Subtitle size='medium'>{subtext}</Subtitle>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							marginTop: '40px',
							width: '100%',

						}}
					>
						<Button
							sx={{
								height: '36px',
								width: '260px',
								borderRadius: '50px',
								marginRight: 2,
							}}
							variant='contained'
							color='secondary'
							fullWidth
							onClick={() => handleModem()}
						> 
							Cancel 
						</Button>
						<Button
							variant='contained'
							fullWidth
							sx={{
								height: '36px',
								width: '260px',
								borderRadius: '50px',
								marginLeft: 2,
							}}
							onClick={ handleArchive}
						> 
							{ buttonText }
						</Button>
					</Box>
				</Box>
		</Modal>
	)
}
