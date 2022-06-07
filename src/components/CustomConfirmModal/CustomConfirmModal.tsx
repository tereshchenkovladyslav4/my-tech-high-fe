import React from "react";
import { Box, Button, Modal } from "@mui/material";
import { SYSTEM_01 } from "../../utils/constants";
import { Paragraph } from "../Typography/Paragraph/Paragraph";
import { Subtitle } from "../Typography/Subtitle/Subtitle";
import { useStyles } from './styles'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

type CustomConfirmModalType = {
	header: string
	content: string
	handleConfirmModalChange: (val: boolean, isOk: boolean) => void
}

export default function CustomConfirmModal (
	{ header, content, handleConfirmModalChange }: CustomConfirmModalType
) {
	const classes = useStyles

	const handleConfirm = (callbackState) => {
		handleConfirmModalChange(false, true);
	};

	const handleCancel = (callbackState) => {
		handleConfirmModalChange(false, false);
	};

	return (
		<Modal
			open={true}
		>
			<Box sx={classes.modalCard}>
				<Box sx={classes.header as object}>
					<Subtitle fontWeight='700'>{header}</Subtitle>
				</Box>
				<Box sx={classes.content as object}>
					<ErrorOutlineIcon style={classes.errorOutline} />
					<Paragraph size='large' color={SYSTEM_01} textAlign="center">
						{content}
					</Paragraph>
					<Box display='flex' flexDirection='row'>
						<Button variant='contained' disableElevation sx={classes.cancelButton} onClick={handleCancel}>
							Cancel
						</Button>
						<Button variant='contained' disableElevation sx={classes.submitButton} onClick={handleConfirm}>
							Yes
						</Button>
					</Box>
				</Box>
			</Box>
		</Modal>
	)
};