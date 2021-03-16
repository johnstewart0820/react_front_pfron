import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  logoBlock: {
    backgroundColor: theme.palette.black_white,
		borderTop: theme.palette.card_border
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '100%'
  },
  logoContainer: {
    width: '100%',
    margin: '0px'
  }
}));

const Footer = props => {
  const { children } = props;

  const classes = useStyles();

  return (
    <div className={classes.logoBlock}>
      <Grid container spacing={4} className={classes.logoContainer}>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_FE.png" alt="footer_FE"/>
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_RP.png" alt="footer_RP"/>
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_pfron.png" alt="footer_PFRON" />
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_zus.png" alt="footer_ZUS" />
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_ciop.png" alt="footer_CIOP" />
        </Grid>
        <Grid item xs={2} className={classes.alignRight}>
          <img className={classes.logo} src="/images/logos/footer_UE.png" alt="footer_UE" />
        </Grid>
      </Grid>
    </div>
  );
};

Footer.propTypes = {
  children: PropTypes.node
};

export default Footer;
