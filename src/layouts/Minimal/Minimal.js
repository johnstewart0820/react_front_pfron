import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import useStyles from './style';
import {
  Grid,
} from '@material-ui/core';

const Minimal = props => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_FE.png" alt="footer_FE"/>
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_RP.png" alt="footer_RP"/>
        </Grid>
        <Grid item xs={6}>
          
        </Grid>
        <Grid item xs={2} className={classes.alignRight}>
          <img className={classes.logo} src="/images/logos/footer_UE.png" alt="footer_UE" />
        </Grid>
        <main className={classes.content}>{children}</main>
        <Grid container spacing={3} className={classes.footer}>
          <Grid item xs={2}>
            <img className={classes.logo} src="/images/logos/footer_pfron.png" alt="footer_PFRON" />
          </Grid>
          <Grid item xs={2}>
            <img className={classes.logo} src="/images/logos/footer_zus.png" alt="footer_ZUS" />
          </Grid>
          <Grid item xs={2}>
            <img className={classes.logo} src="/images/logos/footer_ciop.png" alt="footer_CIOP" />
          </Grid>
          <Grid item xs={12}>
            <span>
              System informatyczny prowadzony jest w ramach Projektu: "Wypracowanie i pilotażowe wdrożenie modelu kompleksowej rehabilitacji umożliwiającej podjęcje lub powrót do pracy" nr: POWR.02.06.00.00-00-0057/17 realizowanego przez Państwowy Fundusz Rehabilitacji Osób Niepełnosprawnych we współpracy z Zakładem Ubezpieczeń Społecznych oraz Centralnym Instytutem Ochrony Pracy - Państwowym Instytutem Badawczym. Projekt finansowany jest przez Unię Europejską w ramach Europejskiego Funduszu Spolecznego i przez Budźet Państwa.
            </span>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Minimal;
