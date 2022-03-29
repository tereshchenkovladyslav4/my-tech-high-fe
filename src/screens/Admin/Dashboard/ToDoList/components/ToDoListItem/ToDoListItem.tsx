import { Box, Button } from '@mui/material'
import React, { Fragment } from 'react'
import { useHistory } from 'react-router-dom'
import { MTHORANGE, PRIMARY_MEDIUM_MOUSEOVER, SYSTEM_06 } from '../../../../../../utils/constants'
import { TodoListTemplateType } from './types'
import { Subtitle } from '../../../../../../components/Typography/Subtitle/Subtitle';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import moment from 'moment'

const Row = (props) => (
	<Box display="flex" flexDirection="row" alignItems="center" justifyContent={props.content || "flex-start"}>
		{props.children}
	</Box>
)
export const ToDoListItem: TodoListTemplateType = ({
	todoItem,
	idx
}) => {
	const history = useHistory();
	return (
		<Box key={idx} sx={{ my: 3 }}	>
			<Row content="space-between">
				<Box>
					<Row>
						<InfoOutlinedIcon fontSize="medium" />
						<Box sx={{ ml: 4 }}>
							<Subtitle fontWeight='bold'>
								{todoItem.title}
							</Subtitle>
							<Subtitle size={12} color={SYSTEM_06}>
								{moment(todoItem.date).format("LL")}
							</Subtitle>
						</Box>
					</Row>
				</Box>
				<Box>
					<Row>
						<Box sx={{
							borderRadius: 1,
							background: "rgba(236, 89, 37, 0.1)",
							width: 72,
							height: 28,
							display: "flex",
							justifyContent: "center",
							mr: 4,
							padding: 0.4,
						}}>
							<Row>
								<WarningAmberOutlinedIcon fontSize='small' htmlColor={MTHORANGE} />
								<Subtitle size={12} color={MTHORANGE} sx={{ ml: 1 }}>
									{todoItem.severity}
								</Subtitle>
							</Row>
						</Box>
						<Button
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
							<Subtitle size={12} >
								Process Now
							</Subtitle>
						</Button>
					</Row>
				</Box>
			</Row >
		</Box >
	)
}
