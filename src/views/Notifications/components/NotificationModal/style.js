import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: theme.palette.card_border,
		boxShadow: theme.shadows[5],
		padding: '50px',
		outline: 'none',
		color: theme.palette.gray,
		fontSize: '0.9375em',
		fontFamily: 'roboto',
		fontWeight: 400,
		width: '400px',
	},
	closeIcon: {
		color: theme.palette.black_white,
		backgroundColor: theme.palette.pink
	},
	closeIconBlock: {
		display: 'flex',
		justifyContent: 'flex-end'
	},
	form_title: {
		fontSize: '1em'
	},
	input_box: {
		'& svg': {
			fill: theme.palette.text.secondary
		},
		color: theme.palette.text.primary,
		backgroundColor: theme.palette.black_white,
		border: `1px solid ${theme.palette.text.primary}`,
		padding: '12px 30px',
		fontSize: '1em',
		width: '100%',
		color: theme.palette.gray,
		fontWeight: '500',
		fontFamily: 'roboto',
		'&::placeholder': {
			color: theme.palette.gray,
			fontWeight: '500',
			fontStyle: 'italic'
		}
	},
	btnSave: {
		height: '100%',
		'& .MuiButton-label': {
			textTransform: 'none',
			fontSize: '0.9375em',
		},
		'& .MuiButton-containedSecondary:hover': {

		},
		'&:hover': {
			backgroundColor: theme.palette.pink,
		},
		padding: '4px',
		borderRadius: '0px',
		fontWeight: '400',
		backgroundColor: theme.palette.pink,
		color: theme.palette.black_white,
		width: '100%'
	},
	btnClose: {
		'& .MuiButton-label': {
			textTransform: 'none',
			fontSize: '0.9375em',
		},
		'& .MuiButton-containedSecondary:hover': {

		},
		'&:hover': {
			backgroundColor: theme.palette.green,
			color: theme.palette.black_white,
		},
		padding: '4px',
		borderRadius: '0px',
		fontWeight: '400',
		color: theme.palette.green,
		backgroundColor: theme.palette.black_white,
		border: `1px solid ${theme.palette.green}`
	},
	relation: {
		color: theme.palette.pink,
		fontFamily: 'roboto',
		fontSize: '14px',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center'
	},
	title: {
		fontWeight: '500',
		marginBottom: theme.spacing(5),
		textAlign: 'center'
	},
	description: {
		fontWeight: '500',
		marginBottom: theme.spacing(10),
		textAlign: 'center'
	}
}));

export default useStyles;