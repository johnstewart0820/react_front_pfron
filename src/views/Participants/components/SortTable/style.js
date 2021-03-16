import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    
    btnCreate: {
        '& .MuiButton-label': {
            textTransform: 'none',
            fontSize: '0.9375em',
        },
        '&:hover': {
            backgroundColor: theme.palette.pink
        },
        borderRadius: '0px',
        fontWeight: '300',
        backgroundColor: theme.palette.pink,
        color: theme.palette.black_white,
        height: '100%',
        width: '100%',
        lineHeight: '1',
        padding: '10px',
        '&:disabled': {
          backgroundColor: theme.palette.pink_disable,
          color: theme.palette.btn_darkgray
      }
    },
		date_picker: {
			'& svg': {
				fill: theme.palette.text.secondary
			},
		},
    input_box: {
    '& svg': {
			fill: theme.palette.text.secondary
		},
			color: theme.palette.text.primary,
    backgroundColor: theme.palette.black_white,
			border: `1px solid ${theme.palette.text.primary}`,
      padding: '10px 20px',
      width: '100%',
      fontSize: '0.8750em'
    },
    iconButton: {
   '& svg': {
			fill: theme.palette.text.secondary
		},
      marginRight: theme.spacing(1),
      padding: theme.spacing(1),
    },
    icon: {
      height: '50%',
      fontSize: '0.8em'
    },
    root: {
      '& .MuiTableCell-root': {
        padding: theme.spacing(1.5)
      },
			cursor: 'pointer'
    }
}));

export default useStyles;