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
			border: theme.palette.card_border,
      padding: theme.spacing(3),
      fontFamily: 'roboto',
    },
    form_title: {
      fontWeight: '500'
    },
    textArea: {
                backgroundColor: theme.palette.black_white,
		color: theme.palette.text.primary,
		border: `1px solid ${theme.palette.text.primary}`,
		'&::placeholder': {
			color: theme.palette.text.primary,
		},
      width: '100%',
      padding: theme.spacing(2)
    },
    btnSave: {
height: '100%',
      '& .MuiButton-label': {
        textTransform: 'none',
        fontSize: '0.8750em',
      },
      '&:hover': {
        backgroundColor: theme.palette.btn_darkgray,
        borderColor: theme.palette.btn_darkgray,
      },
      marginTop: theme.spacing(3),
      borderRadius: '0px',
      fontWeight: '300',
      backgroundColor: theme.palette.btn_darkgray,
      borderColor: theme.palette.btn_darkgray,
      color: theme.palette.black_white,
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
        backgroundColor: theme.palette.btn_gray,
        borderColor: theme.palette.btn_gray,
      },
      marginTop: theme.spacing(3),
      borderRadius: '0px',
      fontWeight: '300',
      backgroundColor: theme.palette.btn_gray,
      borderColor: theme.palette.btn_gray,
      color: theme.palette.black_white,
      width: '100%'
    },
		btnControl: {
      '& .MuiButton-label': {
        textTransform: 'none',
        fontSize: '0.8750em',
      },
      '&:hover': {
        backgroundColor: theme.palette.btn_gray,
        borderColor: theme.palette.btn_gray,
      },
      borderRadius: '0px',
      fontWeight: '300',
      backgroundColor: theme.palette.btn_gray,
      borderColor: theme.palette.btn_gray,
      color: theme.palette.black_white,
      width: '100%'
    },
    date_picker: {
      marginTop: theme.spacing(1),
    },
    btnBack: {
        '& .MuiButton-label': {
          textTransform: 'none',
          fontSize: '0.8750em',
        },
        '&:hover': {
          backgroundColor: theme.palette.btn_gray,
          borderColor: theme.palette.btn_gray,
          color: theme.palette.black_white
        },
        padding: theme.spacing(0.5, 6),
        borderRadius: '0px',
        fontWeight: '300',
        color: theme.palette.btn_gray,
        borderColor: theme.palette.btn_gray,
				marginLeft: theme.spacing(2),
    },
    divide: {
        backgroundColor: 'lightgray',
        height: '1px',
        width: '100%',
        margin: theme.spacing(2.5, 0,)
    },
    top_label: {
      marginBottom: theme.spacing(1),
      fontSize: '0.8750em',      
    },
	top_label_header: {
		marginBottom: theme.spacing(1),
		fontSize: '0.8750em',
		fontWeight: '500'
	  },
    input_box_label: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
      fontSize: '0.8750em',
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
    name_select_box: {
      '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
        padding: '2px 10px',
        borderRadius: '0px',
        border: '0px'
      },
      '& fieldset': {
        border: `1px solid ${theme.palette.gray}`,
      },
      '& .MuiChip-root': {
        borderRadius: '2px',
        backgroundColor: theme.palette.green,
        color: theme.palette.black_white,
        padding: '0px 10px',
        height: '26px'
      }, 
      '& .MuiChip-deleteIcon': {
        color: theme.palette.black_white,
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
