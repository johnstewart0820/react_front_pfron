import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.15), 0px 4px 5px 0px rgba(0,0,0,0.04), 0px 1px 10px 0px rgba(0,0,0,0.02)',
      left: '299px',
      width: 'calc(100% - 299px)',
      height: '80px',
      backgroundColor: '#575658',
      display: 'flex',
      zIndex: '101'
    },
    flexGrow: {
      flexGrow: 1
    },
    signOutButton: {
      marginLeft: theme.spacing(1)
    },
    toolbar: {
      display: 'flex',
      width: '100%',
      padding: '0px 10px',
      justifyContent: 'space-between'
    },
    close_drawer_icon: {
      display: 'flex',
      justifyContent: 'center',
      color: 'white',
      '& .MuiSvgIcon-root': {
        fontSize: '18px'
      }
    },
    title: {
      fontSize: '20px',
      fontFamily: 'roboto',
      fontWeight: '400',
      display: 'flex',
      alignItems: 'center',
      position: 'absolute',
      width: 'calc(100% - 65px)',
      height: '80%',
      marginLeft: '25px',
      borderRadius: '2px',
      top: '45px',
      paddingLeft: '30px',
      boxShadow: '0 0 0 1px rgb(63 63 68 / 5%), 0 1px 3px 0 rgb(63 63 68 / 15%)',
      backgroundColor: theme.palette.green
    },
    avatar: {

    },
    titlebar: {
      display: 'flex',
      color: 'white'
    },
    avataricon: {
      fontSize: '30px',
      color: 'white'
    },
  }));

  export default useStyles;