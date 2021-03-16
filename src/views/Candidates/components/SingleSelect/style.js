import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
        marginLeft: '10px',
        marginRight: '10px'
    },
    name_select_box: {
        // fontStyle: 'italic',
				'& svg': {
					fill: theme.palette.text.secondary
				},
        fontWeight: '400',
        // padding: '5px 14px',
        '& .MuiInputLabel-outlined .MuiInputLabel-shrink': {
            transform: 'translate(14px -100px) scale(0.5)',
            // padding: '5px 14px'
        },
        '& .MuiSelect-outlined.MuiSelect-outlined': {
border: `1px solid ${theme.palette.gray}`,
            padding: '10px 30px 10px 20px !important'
        },				
    },
		
}));

export default useStyles;