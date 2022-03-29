import { BLACK, SYSTEM_07 } from "../../../../utils/constants";
import { outlinedInputClasses } from '@mui/material'

export const useStyles = {
	modalCard: {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '85%',
		height: '90%',
		bgcolor: 'background.paper',
		boxShadow: 24,
		p: 2,
		paddingLeft: '28px',
		borderRadius: 2,
	},
	close: {
		background: 'black',
		borderRadius: 1,
		color: 'white',
		cursor: 'pointer'
	},
	errorOutline: {
		background: '#FAFAFA',
		borderRadius: 1,
		color: BLACK,
		marginBottom: 12,
		height: 42,
		width: 42,
	},
	content: {
		marginTop: '10px',
		paddingBottom: '20px',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: 'calc(100% - 60px)',
		overflow: 'auto',
		'&::-webkit-scrollbar': {
			width: '5px',
		},
		'&::-webkit-scrollbar-track': {
			background: '#ffffff',
		},

		'&::-webkit-scrollbar-thumb': {
			background: '#888',
		},

		'&::-webkit-scrollbar-thumb:hover': {
			background: '#555',
		}
	},
	submitButton: {
		position: 'relative',
		top: '480px',
		marginLeft: '-50px',
		borderRadius: 10,
		width: '200px',
		marginBottom: 4,
	},
	tableBorder: {
		borderTop: '1px solid #A3A3A4',
	},
	textfield: {
		[`& .${outlinedInputClasses.root} .${outlinedInputClasses.notchedOutline}`]: {
			borderColor: SYSTEM_07,
		},
		marginY: 1,
		width: '100%',
	},

	deleteIcon: {
		cursor: 'pointer',
		marginLeft: '3px',
		'&:hover': {
			opacity: '0.9'
		}
	},

	editor: {
		border: '1px solid #d1d1d1',
		borderRadius: 1,
		marginBottom: '24px',
		'div.DraftEditor-editorContainer': {
			minHeight: '200px',
			maxHeight: '250px',
			overflow: 'scroll',
			padding: 1,
		},
	},

	toolBar: {
		borderBottom: '1px solid #d1d1d1',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 1,
	},
	cancelButton: {
		borderRadius: 10,
		background: '#E7E7E7',
		width: '200px',
		marginRight: 1
	},
	icon: {
		marginRight: 2,
		color: '#e7e7e7',
		cursor: 'pointer'
	},

	subject: {
		marginTop: 2
	},

	isActive: {
		color: 'black'
	}
}


