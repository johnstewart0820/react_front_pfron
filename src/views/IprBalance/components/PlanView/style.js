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
      color: '#263238',
      marginTop: theme.spacing(0)
    },
    form_title: {
      fontWeight: '500'
    },
	small_title: {
		fontSize: '0.8125em',
		marginTop: theme.spacing(0.5)
	},
	normal_font: {
		fontSize: '0.8750em'
	},
	name: {
		fontSize: '0.8750em',
		marginLeft: theme.spacing(2),
		marginTop: theme.spacing(2),
	},
    textArea: {
      width: '100%',
      padding: theme.spacing(2)
    },
	divide: {
        backgroundColor: 'lightgray',
        height: '1px',
        width: 'calc(100% / 3 * 4)',
        margin: theme.spacing(2.5, 0,),
		marginLeft: 'calc(-100% / 3)',
    },
	divide_big: {
        backgroundColor: 'lightgray',
        height: '1px',
        width: '100%',
        margin: theme.spacing(2.5, 0,),
    },
    btnSave: {
      '& .MuiButton-label': {
        textTransform: 'none',
        fontSize: '0.8750em',
      },
      '&:hover': {
        backgroundColor: 'darkgray',
        borderColor: 'darkgray',
      },
      marginTop: theme.spacing(3),
      borderRadius: '0px',
      fontWeight: '300',
      backgroundColor: 'darkgray',
      borderColor: 'darkgray',
      color: 'white',
      width: '100%'
    },
    error: {
      border: '0.5px solid red',
    },
    btnOption: {
      '& .MuiButton-label': {
        textTransform: 'none',
        fontSize: '0.8750em',
      },
      '&:hover': {
        backgroundColor: '#727e91',
        borderColor: '#727e91',
      },
      marginTop: theme.spacing(3),
      borderRadius: '0px',
      fontWeight: '300',
      backgroundColor: '#727e91',
      borderColor: '#727e91',
      color: 'white',
      width: '100%'
    },
    date_picker: {
      marginTop: theme.spacing(1),
    },
    btnCreate: {
        '& .MuiButton-label': {
          textTransform: 'none',
          fontSize: '0.8750em',
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
    top_label: {
        fontWeight: '400',
        fontSize: '0.8750em',
		marginBottom: theme.spacing(1)
    },
    top_label_content: {
        fontSize: '0.8750em',
    },
    label_content: {
        fontSize: '0.8750em',
        marginBottom: theme.spacing(1)
    },
    input_box_label: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      fontSize: '0.8750em',
    },
    input_box: {
      padding: '10px 20px',
      width: '100%',
      fontSize: '0.8750em'
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
