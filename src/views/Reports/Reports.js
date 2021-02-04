import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  CircularProgress,
  Grid,
  Card,
  Button
} from '@material-ui/core';

const Reports = props => {
  const { children } = props;

  const { history } = props;

  const classes = useStyles();
  
  useEffect(() => {
    
  }, []);
  
  return (
    <div className={classes.public}>
      
    </div>
  );
};

export default Reports;
