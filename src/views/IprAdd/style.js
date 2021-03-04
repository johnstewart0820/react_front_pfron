import { makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
    controlBlock: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    formBlock: {
      marginTop: theme.spacing(1.5)
    },
    form: {
      padding: theme.spacing(3),
      fontFamily: 'roboto',
    },
    form_title: {
      fontWeight: '500'
    },
    btnSave: {
        '& .MuiButton-label': {
          textTransform: 'none',
          fontSize: '14px',
        },
        '&:hover': {
          backgroundColor: 'darkgray',
          borderColor: 'darkgray',
        },
        borderRadius: '0px',
        fontWeight: '300',
        backgroundColor: 'darkgray',
        borderColor: 'darkgray',
        color: 'white',
        width: '100%'
    },
    btnBack: {
        '& .MuiButton-label': {
          textTransform: 'none',
          fontSize: '14px',
        },
        '&:hover': {
          backgroundColor: theme.palette.btn_gray,
          borderColor: theme.palette.btn_gray,
          color: 'white'
        },
        padding: theme.spacing(0.5, 6),
        borderRadius: '0px',
        fontWeight: '300',
        color: theme.palette.btn_gray,
        borderColor: theme.palette.btn_gray
    },
    divide: {
        backgroundColor: 'lightgray',
        height: '1px',
        width: '100%',
        margin: theme.spacing(2.5, 0,)
    },
    top_label: {
      marginBottom: theme.spacing(1),
      fontSize: '14px',      
    },
	number: {
		marginTop: theme.spacing(2),
		marginLeft: theme.spacing(2),
		fontSize: '14px',
	},
    input_box_label: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      fontSize: '14px',
    },
    input_box: {
      padding: '10px 20px',
      width: '100%',
      fontSize: '14px'
    },
    error: {
      border: '0.5px solid red'
    },
    name_select_box: {
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
        padding: '2px 10px',
        borderRadius: '0px',
        border: '0px'
      },
      '& fieldset': {
        border: '1px solid gray',
      },
      '& .MuiChip-root': {
        borderRadius: '2px',
        backgroundColor: theme.palette.green,
        color: 'white',
        padding: '0px 10px',
        height: '26px'
      }, 
      '& .MuiChip-deleteIcon': {
        color: 'white',
        height: '70%'
      }
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