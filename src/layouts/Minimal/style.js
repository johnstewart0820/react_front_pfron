import { makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: 'white',
    color: theme.palette.color,
    fontFamily: 'roboto',
    height: '100vh',
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
  footer: {
    width: '100%',
    justifyContent: 'center',
    paddingLeft: theme.spacing(20),
    paddingRight: theme.spacing(20),
    lineHeight: '1em',
    fontSize: '11px',
    textAlign: 'center',
    marginTop: theme.spacing(11)
  }
}));

export default useStyles;
