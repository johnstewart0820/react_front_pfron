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
        color: 'white',
        height: '100%',
        width: '100%',
        lineHeight: '1',
        padding: '10px',
        '&:disabled': {
          backgroundColor: theme.palette.pink_disable,
          color: 'darkgray'
      }
    },
    input_box: {
      padding: '10px 20px',
      width: '100%',
      fontSize: '0.8750em'
    },
    iconButton: {
      marginRight: theme.spacing(1),
      padding: theme.spacing(1),
    },
    icon: {
      height: '50%',
      fontSize: '1.25em'
    },
    root: {
      '& .MuiTableCell-root': {
        padding: theme.spacing(1.5)
      }
    }
}));

export default useStyles;