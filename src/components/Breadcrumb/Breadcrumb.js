import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link, Breadcrumbs } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.green,
    fontSize: '0.8125em',
  },
  typo: {
    fontSize: '0.8125em',
  }
}));

const Breadcrumb = props => {
  const { list } = props;

  const classes = useStyles();

  return (
    <Breadcrumbs aria-label="breadcrumb" class={classes.breadcrumb}>
      {
        list && list.map((item, index) => (
          item.active ? 
            <Link color="inherit" href={item.href} className={classes.link}>
              {item.label}
            </Link>
          :
          <Typography color="textPrimary" className={classes.typo}>{item.label}</Typography>
        ))
      }
    </Breadcrumbs>
    
  );
};

export default Breadcrumb;
