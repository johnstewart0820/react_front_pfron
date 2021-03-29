import { makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: theme.palette.black_white,
    color: theme.palette.color,
    fontFamily: 'roboto',
    minHeight: '100vh',
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  alignRight: {
    textAlign: 'right'
  },
  content: {
    width: '100%',
  },
	site_title: {
		marginBottom: theme.spacing(2),
		color: theme.palette.color,
		fontSize: '1.1em',
		textAlign: 'center',
		lineHeight: '1.1em'
	},
	wcag_controller: {
		[theme.breakpoints.down('xs')]: {
      display: 'none'
    },
		[theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    [theme.breakpoints.up('md')]: {
			display: 'block'
    },
	},
  footer: {
    width: '100%',
    justifyContent: 'center',

    lineHeight: '1em',
    fontSize: '0.6875em',
    textAlign: 'center',
    marginTop: theme.spacing(11),
		[theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing(4),
			paddingRight: theme.spacing(4),
    },
		[theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(4),
			paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.up('md')]: {
			paddingLeft: theme.spacing(20),
			paddingRight: theme.spacing(20),
    },
  },
	helper: {
		color: theme.palette.text.primary,
		fontSize: '8px',
		margin: theme.spacing(0, 2.5),
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer'
	},
}));

export default useStyles;
