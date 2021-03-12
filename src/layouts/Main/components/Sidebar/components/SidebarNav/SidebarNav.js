/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  label: {
    padding: '16px 32px',
    justifyContent: 'flex-start',
    color: 'gray',
    fontFamily: 'roboto',
    fontSize: '13px'
  },
  button: {
    padding: '16px 32px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: 400,
    fontSize: '14px',
    color: '#2f2f37',
    lineHeight: '1em',
    '&:hover': {
      backgroundColor: theme.palette.green,
      color: '#EBECF0',
      fontWeight: 400,
      borderRadius: '0px',
      '& $icon': {
        color: '#EBECF0',
      },
    },
  },
  icon: {
    color: '#2f2f37',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(3),
    '&:hover': {
      color: '#EBECF0'
    },
  },
  active: {
    fontWeight: 400,
    '& $icon': {
      color: '#EBECF0',
    },
    backgroundColor: theme.palette.green,
    color: '#EBECF0',
    borderRadius: '0px'
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className, ...rest } = props;

  const classes = useStyles();

  return (
    <List
      {...rest}
      className={clsx(classes.root, className)}
    >
      {pages.map(page => (
        page.label ?
        <div className={classes.label}>
          {page.label}
        </div>
        :
        <ListItem
          className={classes.item}
          disableGutters
          key={page.title}
        >
          <Button
            activeClassName={classes.active}
            className={classes.button}
            component={CustomRouterLink}
            to={page.href}
          >
            <div className={classes.icon} style={{backgroundImage: `url("${page.icon}")`,backgroundColor: 'transparent'}}></div>
            {page.title}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default SidebarNav;
