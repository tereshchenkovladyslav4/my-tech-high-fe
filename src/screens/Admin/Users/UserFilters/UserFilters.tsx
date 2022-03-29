import { Box, Button } from '@mui/material';
import { map } from 'lodash';
import React, { useState } from 'react';
import { BUTTON_LINEAR_GRADIENT, MTHBLUE } from '../../../../utils/constants';


export const UserFilters = ({ onPress, filters }) => {

	const [roles, setRoles] = useState([
		{
			id: 1,
			name: 'Observer',
			type: 'role'
		},
		{
			id: 2,
			name: 'Parent',
			type: 'role'
		},
		{
			id: 3,
			name: 'Student',
			type: 'role'
		},
		{
			id: 4,
			name: 'Admin',
			type: 'role'
		},
		{
			id: 5,
			name: 'Teacher',
			type: 'role'
		},
		{
			id: 6,
			name: 'Inactive',
			type: 'field'
		},
		{
			id: 7,
			name: 'School Partner',
			type: 'role'
		},
	]);

	const [_, setCounter] = useState(0);

	const handleClick = (role: any) => {
		const updatedRoles = roles;
		setRoles(updatedRoles);
		setCounter(counter => counter + 1)
		onPress(role, role.id);
	}


	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				paddingX: 4,
				marginY: 3,
			}}
		>
			{map(roles, role => (
				<Button
					key={role.id}
					variant={filters.findIndex(filter => filter.id === role.id) !== -1 ? 'text' : 'outlined'}
					onClick={() => handleClick(role)}
					sx={{
						color: filters.findIndex(filter => filter.id === role.id) !== -1 ? "white" : MTHBLUE,
						background: filters.findIndex(filter => filter.id === role.id) !== -1 ? BUTTON_LINEAR_GRADIENT : "transparent",
						borderRadius: 2,
						textTransform: 'none',
						height: 25,
						fontWeight: '700',
						width: '115px',
						fontSize: '12px'
					}}
				>
					{role.name}
				</Button>
			))}
		</Box>
	)
}
