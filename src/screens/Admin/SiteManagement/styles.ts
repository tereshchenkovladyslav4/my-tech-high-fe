import { PRIMARY_MEDIUM_MOUSEOVER, BUTTON_LINEAR_GRADIENT, RED_GRADIENT } from '../../../utils/constants';
export const useStyles = {
	base: {
		position: "relative",
		px: 4,
		background: "#fff",
		minHeight: "100%",
		width: "95%",
		margin: "auto",
		pb: 4,
		pt: 4
	},
	button: {
		borderRadius: 2,
		fontSize: 12,
		background: 'linear-gradient(90deg, #3E2783 0%, rgba(62, 39, 131, 0) 100%) #4145FF',
		width: "100%",
		height: 37,
		fontWeight: 700,
		textTransform: 'none',
		'&:hover': {
			background: PRIMARY_MEDIUM_MOUSEOVER,
			color: 'white',
		},
	},
	cancelButton: {
		borderRadius: 2,
		textTransform: 'none',
		height: 29,
		color: 'white',
		width: '92px',
		background: RED_GRADIENT,
		marginRight: 3,
		'&:hover': {
			background: '#D23C33',
			color: '#fff',
		},
		marginLeft: 'auto',
	},
	submitButton: {
		background: BUTTON_LINEAR_GRADIENT,
		color: 'white',
		width: '92px',
		borderRadius: 2,
		textTransform: 'none',
		fontWeight: 700,
		height: 29,
	}
}
