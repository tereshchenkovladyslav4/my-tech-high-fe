import React from 'react'
import { ToggleSchoolPartnerMutation } from '../services';
import { toNumber } from 'lodash';
import { SchoolPartnerType } from '../types';
import CustomModal from '../../../../../components/CustomModal/CustomModals';
import { useMutation } from '@apollo/client';


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

	const confirmText = toNumber(el.active) === 1 
		? 'Archive'
		: 'Unarchive'


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
			confirmStr={confirmText}
			onClose={() => handleModem()}
			onConfirm={handleArchive}
			backgroundColor='white'
		/>
	)
}
