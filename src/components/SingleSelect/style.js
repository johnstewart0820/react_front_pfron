import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
        width: '100%',
    },
    name_select_box: {
        fontStyle: 'italic',
        color: '#aeaeae',
        fontWeight: '400',
        '& .MuiInputLabel-outlined .MuiInputLabel-shrink': {
            transform: 'translate(14px -100px) scale(0.5)',
        },
    },
    input_box: {
        '& select': {
            border: '1px solid gray',
            borderRadius: '0px'
        },
        '& .MuiOutlinedInput-input': {
            padding: '10px 20px'
        }
    }
}));

export default useStyles;