import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    '& .ql-align-right': {
        textAlign: 'right'
      },
    '& .ql-align-left': {
    textAlign: 'left'
    },
    '& .ql-align-center': {
    textAlign: 'center'
    },

}));

export default useStyles;