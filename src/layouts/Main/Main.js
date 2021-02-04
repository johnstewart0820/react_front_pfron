import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import { Sidebar, Topbar, Footer } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.default,
    paddingTop: 95,
    // height: '100%',
    [theme.breakpoints.up('sm')]: {
      paddingTop: 80
    }
  },
  shiftContent: {
    paddingLeft: 300
  },
  content: {
    height: '100%',
    backgroundColor: theme.palette.background.default
  },
  topbar_max: {
    transform: 'translateX(-300px)',
    visibility: 'visible',
    width: '100%',
  },
  topbar_min: {
    transform: 'translateX(0)',
    visibility: 'visible',
  },
  mainContainer: {
    padding: theme.spacing(8, 4, 0, 4),
  },
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(true);

  const handleSidebarOpen = () => {
    setOpenSidebar(false);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(true);
  };

  const shouldOpenSidebar = openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: openSidebar
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} onSidebarClose={handleSidebarClose} className={!openSidebar ? classes.topbar_max : classes.topbar_min } title={props.title}/>
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.mainContainer}>
        {children}
      </main>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
