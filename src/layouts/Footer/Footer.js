import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { Grid, Button } from '@material-ui/core';
import constants from '../../utils/constants';

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
  },
	wcag_footer: {
		color: theme.palette.text.primary,
		textTransform: 'initial',
		fontFamily: 'roboto',
	},
	wcag_container: {
		display: 'flex',
		justifyContent: 'center',
		width: '100%'
	},
	declaration: {
		fontFamily: 'roboto',

		color: theme.palette.color,
		fontWeight: '500',
		marginBottom: '20px'
	},
}));

const Footer = props => {
  const { children } = props;

  const classes = useStyles();

	const handleWcagPage = () => {
		var newWindow = window.open();
		newWindow.document.write(constants.DECLARATION_DATA);
	}

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
				<div className={classes.wcag_container}>
					<a href="https://pfron.nfinity.pl/deklaracja.html" className={classes.declaration} target="_blank" title="Deklaracja dostępności - Strona zostanie otwarta w nowym oknie przeglądarki">Deklaracja dostępności</a>
				</div>
      </Grid>
    </div>
  );
};

Footer.propTypes = {
  children: PropTypes.node
};

export default Footer;
