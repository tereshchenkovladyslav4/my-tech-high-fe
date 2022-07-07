import { Box, Button, Modal } from '@mui/material'
import React from 'react'
import { Title } from '../../../../../components/Typography/Title/Title'
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle';
import { useMutation } from '@apollo/client';
import { ToggleSchoolPartnerMutation } from '../services';
import { toNumber } from 'lodash';
import { SchoolPartnerType } from '../types';
import CustomModal from '../../../../../components/CustomModal/CustomModals';


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
	
	const [ toggleSchoolPartner ] = useMutation(ToggleSchoolPartnerMutation)

	const handleArchive = () => toggleSchoolPartner({
		variables: {
			schoolPartnerId: toNumber(el.school_partner_id)
		}
	}).then(() => {
		handleModem()
	})

	return (
		<CustomModal
			title={text}
			description={subtext}
			confirmStr='Archive'
			onClose={() => handleModem()}
			onConfirm={handleArchive}
		/>
	)
}
