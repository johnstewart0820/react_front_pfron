import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
	
}));

function Alert_Component(props) {
	return (
		<div style={{width: '100%', position: 'relative', marginTop: '5px'}}>
			<MuiAlert elevation={6} variant="filled" {...props} />
		</div>
	)
}

const Alert = ({hasAlert, setHasAlert, isSuccess, message}) => {
  const classes = useStyles();

  return (
		<Alert_Component severity={isSuccess ? "success" : "error"} style={{display: hasAlert ? 'flex' : 'none'}}>
			{message}
			<CloseIcon style={{position: 'absolute', top: '10px', right: '10px', color: 'white'}} onClick={() => setHasAlert(false)}/>
		</Alert_Component>
  );
};

export default Alert;
