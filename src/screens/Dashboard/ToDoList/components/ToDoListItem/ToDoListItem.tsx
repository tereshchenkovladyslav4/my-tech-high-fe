import { TableRow, TableCell, Avatar, Button, AvatarGroup, Box } from '@mui/material'
import React from 'react'
import { Metadata } from '../../../../../components/Metadata/Metadata'
import { Paragraph } from '../../../../../components/Typography/Paragraph/Paragraph'
import { Subtitle } from '../../../../../components/Typography/Subtitle/Subtitle'
import { TodoListTemplateType } from './types'
import SubjectIcon from '@mui/icons-material/Subject'
import { HOMEROOM, ENROLLMENT, PRIMARY_MEDIUM_MOUSEOVER } from '../../../../../utils/constants'
import { imageA } from '../../../Dashboard'
import { useHistory } from 'react-router-dom'
import { map } from 'lodash'
import { Person } from '../../../../HomeroomStudentProfile/Student/types'

export const ToDoListItem: TodoListTemplateType = ({
	todoItem, 
	idx
}) => {

	const history = useHistory()
	const {students} = todoItem

	const getProfilePhoto = (person: Person) => {
		if( !person.photo )
		  return 'image';
	
		const s3URL = 'https://infocenter-v2-dev.s3.us-west-2.amazonaws.com/'
		return s3URL + person.photo
	  }

	const renderStudentAvatars = ()  => {
	return (
		<AvatarGroup>
			{
				map(todoItem.students, (student) => (
					<Avatar alt={`${student.person.first_name} ${student.person.last_name}`} src={getProfilePhoto(student.person)}/>
				))
			}
		</AvatarGroup>
	)
}
	const link = students.length > 1 ? HOMEROOM : `${HOMEROOM+ENROLLMENT}/${students.at(-1)?.student_id}`

	return (
		<TableRow
			key={idx}
			sx={{
				'&:last-child td, &:last-child th': { border: 0 },
			}}
		>
			<TableCell style={{ padding: 8 }} component='th' scope='row'>
				<Metadata
					title={<Subtitle fontWeight='500'>{todoItem.phrase}</Subtitle>}
					subtitle={<Paragraph size='medium'>2:11 PM, September 12</Paragraph>}
					image={<SubjectIcon style={{ color: 'black', marginRight: 24 }} />}
				/>
			</TableCell>
			<TableCell component='th' scope='row'>
				<Box width={'100px'}>
					{renderStudentAvatars()}
				</Box>
			</TableCell>
			<TableCell component='th' scope='row'>
				<Button
					onClick={() => history.push(link)}
					variant='contained'
					sx={{
						borderRadius: 2,
						fontSize: 12,
						background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
						width: 140,
						height: 48,
						fontWeight: 700,
						textTransform: 'none',
						'&:hover': {
              background: PRIMARY_MEDIUM_MOUSEOVER,
              color: 'white',
            },
					}}
				>
					{todoItem.button}
				</Button>
			</TableCell>
		</TableRow>
	)
}
