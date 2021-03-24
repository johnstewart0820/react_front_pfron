import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  CircularProgress,
  Grid,
  Card,
  Button
} from '@material-ui/core';

const Notifications = props => {
  const { children } = props;

  const { history } = props;

  const classes = useStyles();
  
  useEffect(() => {
    
  }, []);
  
  return (
    <div className={classes.public}>
      <label className={classes.notification}>Brak powiadomień.</label>
    </div>
  );
};

export default Notifications;
