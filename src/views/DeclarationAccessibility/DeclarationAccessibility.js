import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import constants from '../../utils/constants';
import { useHistory } from 'react-router';
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4, 15),

  },
  content: {
    paddingTop: 150,
    textAlign: 'center'
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 560
  },
	btnBack: {
		'& .MuiButton-label': {
			textTransform: 'none',
			fontSize: '0.8750em',
		},
		'&:hover': {
			backgroundColor: theme.palette.pink,
			borderColor: theme.palette.pink,
			color: theme.palette.black_white
		},
		padding: theme.spacing(0.5, 8),
		borderRadius: '0px',
		fontWeight: '300',
		color: theme.palette.pink,
		borderColor: theme.palette.pink
},
}));

const DeclarationAccessibility = () => {
  const classes = useStyles();
	const history = useHistory();
	const declaration_data = constants.DECLARATION_DATA;
	const handleBack = () => {
		history.goBack();
	}
  return (
    <div className={classes.root}>
			<Grid container justify="flex-end">
				<Button variant="outlined" color="secondary" id="main"  className={classes.btnBack} onClick={handleBack}>					Wróć
        </Button>
			</Grid>
      <Grid
        container
        justify="center"
        spacing={4}
      >
        <div dangerouslySetInnerHTML={{__html: declaration_data}}></div>
      </Grid>
    </div>
  );
};

export default DeclarationAccessibility;
