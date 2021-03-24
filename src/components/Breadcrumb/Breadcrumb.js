import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link, Breadcrumbs } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	breadcrumb: {
    color: theme.palette.sidebar_title_color,
		fontFamily: 'roboto'
	},
  link: {
    color: theme.palette.green,
    fontSize: '0.8125em',
  },
  typo: {
		color: theme.palette.sidebar_title_color,
    fontSize: '0.8125em',
  }
}));

const Breadcrumb = props => {
  const { list } = props;

  const classes = useStyles();
	const title = "Po zmianie opcji wyszukiwania formularz przeładuje się automatycznie";
  return (
    <Breadcrumbs aria-label="breadcrumb" class={classes.breadcrumb}>
      {
        list && list.map((item, index) => (
          item.active ? 
            <Link color="inherit" href={item.href} className={classes.link} title={title}>
              {item.label}
            </Link>
          :
          <Typography color="textPrimary" className={classes.typo} title={title}>{item.label}</Typography>
        ))
      }
    </Breadcrumbs>
    
  );
};

export default Breadcrumb;
