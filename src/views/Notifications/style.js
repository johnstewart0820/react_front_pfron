import { makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
  notification: {
		fontFamily: 'roboto',
		color: theme.palette.text.primary,
	}
}));

export default useStyles;
