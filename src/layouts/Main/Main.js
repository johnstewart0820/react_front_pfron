import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import { Sidebar, Topbar } from './components';
import Footer from 'layouts/Footer';

const useStyles = makeStyles(theme => ({
  root: {
    // backgroundColor: theme.palette.background.default,
		paddingTop: 80
    // height: '100%',

  },
  shiftContent: {
    paddingLeft: 300
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
  content: {
    position: 'relative',
    height: 'calc(100vh - 200px)',
    overflow: 'scroll',
		backgroundColor: theme.palette.background.default
  },
  mainContainer: {
    padding: theme.spacing(6, 4, 0, 4),
  },
  footer: {
    position: 'absolute',
    bottom: '0px',
    width: 'calc(100% - 299px)',
    boxShadow: '0px 2px 4px 3px rgb(0 0 0 / 15%), 0px 4px 5px 0px rgb(0 0 0 / 4%), 0px 1px 10px 0px rgb(0 0 0 / 2%)'
  },
  footer_min: {
    position: 'absolute',
    bottom: '0px',
    width: '100%',
    boxShadow: '0px 2px 4px 3px rgb(0 0 0 / 15%), 0px 4px 5px 0px rgb(0 0 0 / 4%), 0px 1px 10px 0px rgb(0 0 0 / 2%)'
  }
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(true);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = openSidebar;

  useEffect(() => {
    if(isDesktop === false) {
      setOpenSidebar(false);
    }
  }, [isDesktop]);

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: openSidebar && isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen} onSidebarClose={handleSidebarClose} openSidebar={openSidebar} className={!openSidebar || !isDesktop ? classes.topbar_max : classes.topbar_min } title={props.title}/>
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        <div className={classes.mainContainer}>
          {children}
        </div>
      </main>
      <div className={openSidebar && isDesktop ? classes.footer : classes.footer_min}>
        <Footer/>
      </div>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
