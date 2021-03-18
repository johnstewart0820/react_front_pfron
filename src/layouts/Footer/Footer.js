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
          <img className={classes.logo} src="/images/logos/footer_FE.png" alt="Logo Fundusze Europejskie Wiedza Edukacja Rozwój"/>
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_RP.png" alt="Logo Rzeczpospolita Polska"/>
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_pfron.png" alt="Logo Państwowy Fundusz Rehabilitacji Osób Niepełnosprawnych" />
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_zus.png" alt="Logo Zakład Ubezpieczeń Społecznych" />
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_ciop.png" alt="Logo Centralny Instytut Ochrony Pracy" />
        </Grid>
        <Grid item xs={2} className={classes.alignRight}>
          <img className={classes.logo} src="/images/logos/footer_UE.png" alt="Logo Unia Europejska Europejski Fundusz Społeczny" />
        </Grid>
      </Grid>
    </div>
  );
};

Footer.propTypes = {
  children: PropTypes.node
};

export default Footer;
