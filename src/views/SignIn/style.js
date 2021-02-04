import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(7)
  },

  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(12),
  },
  
  rememberMe: {
    marginTop: '30px',
    '& .MuiTypography-body1': {
      color: theme.palette.gray,
    },
    '& .MuiCheckbox-colorSecondary.Mui-checked' : {
      color: theme.palette.color
    },
  },
  buttonContainer: {
    marginTop: theme.spacing(12),
  },
  input_box_label: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    fontSize: '15px',
  },
  input_box: {
    padding: '10px 20px',
    width: '360px',
  },
  error_log: {
    color: 'red',
    fontFamily: 'roboto'
  },
  btnLogin: {
    '& .MuiButton-label': {
      textTransform: 'none',
      fontSize: '17px',
    },
    '&:hover': {
      backgroundColor: theme.palette.green
    },
    padding: '4px',
    borderRadius: '0px',
    fontWeight: '300',
    backgroundColor: theme.palette.green,
    color: 'white',
    width: '100%'
  },
  btnForgot: {
    marginTop: theme.spacing(2),
    '&:hover': {
      textDecoration: 'none'
    },
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    color: theme.palette.pink,
    fontSize: '17px',
    fontFamily: 'roboto',
    fontWeight: '400',
    lineHeight: '1.75',
  },
  progressContainer: {
    position: 'absolute',
    top: '50%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  progress: {
    color: theme.palette.pink
  }
}));

export default useStyles;
