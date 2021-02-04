import { makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    backgroundColor: 'white',
    width: '600px',
    height: '100%',
    boxShadow: '0px 0px 20px grey',
  },
  public: {
    '& .ql-align-right': {
      textAlign: 'right'
    },
    '& .ql-align-left': {
      textAlign: 'left'
    },
    '& .ql-align-center': {
      textAlign: 'center'
    },
    color: theme.palette.gray,
    fontSize: '15px',
    fontFamily: 'roboto',
    fontWeight: 400,
  },
  normalBlock: {
    padding: '30px 30px 30px 30px',
    height: '100%',
    '& img': {
      width: '100%'
    }
  },
  controlBlock: {
    padding: '30px 30px 70px 30px',
    height: '100%',
    textAlign: 'center'
  },
  buttonBlock: {
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    color: theme.palette.gray,
    fontSize: '22px',
    fontFamily: 'roboto',
    fontWeight: 400
  },
  subHeader: {
    color: theme.palette.gray,
    fontSize: '15px',
    fontFamily: 'roboto',
    fontWeight: 400,
    marginTop: '60px',
    marginBottom: '30px'
  },
  btnOpen: {
    '& .MuiButton-label': {
        textTransform: 'none',
        fontSize: '15px',
    },
    '& .MuiButton-containedSecondary:hover': {

    },
    '&:hover': {
        backgroundColor: theme.palette.pink
    },
    padding: '4px',
    border: '1px solid #a52b02',
    borderRadius: '0px',
    fontWeight: '300',
    backgroundColor: theme.palette.pink,
    color: 'white',
    marginLeft: '20px',
    marginRight: '20px',
    paddingLeft: '40px',
    paddingRight: '40px',
    width: '25%'
  },
  progressContainer: {
    position: 'absolute',
    top: '50%',
    width: 'calc(100% - 600px)',
    display: 'flex',
    justifyContent: 'center',
  },
  progress: {
      color: theme.palette.pink
  },
}));

export default useStyles;
