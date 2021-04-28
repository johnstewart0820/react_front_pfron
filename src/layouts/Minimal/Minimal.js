import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { SiteInfoContextConsumer } from "App";
import { makeStyles, useTheme } from '@material-ui/styles';
import useStyles from './style';
import {WcagControl} from './components';
import {
  Grid, Button, Typography
} from '@material-ui/core';

import { useHistory } from 'react-router';
import constants from '../../utils/constants';

const Minimal = props => {
  const { children } = props;
	const history = useHistory();
  const theme = useTheme();
  const classes = useStyles(theme);

	const changeFontSize = type => {

    let
      body = document.body,
      fontSize = parseInt(window.getComputedStyle(body).fontSize.replace("px", ""));

    if (type === 'less' && fontSize > 10) fontSize -= 1;
    if (type === 'more' && fontSize < 22) fontSize += 1;
    if (type === 'normal') fontSize = 16;

    fontSize += "px";
    body.style.fontSize = fontSize;
  }

  const toggleUnderlineLinks = (e, handle) => {
    e.preventDefault();
    document.body.classList.toggle("links-underline");
		handle();
  }

	const toggleContrast = (e, handle) => {
		e.preventDefault(); 
		handle();
	}

  return (
		<SiteInfoContextConsumer>
    { (props) => (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={4} sm={4} md={2}>
          <img className={classes.logo} src="/images/logos/footer_FE.png" alt="Logo Fundusze Europejskie Wiedza Edukacja Rozwój"/>
        </Grid>
        <Grid item xs={4} sm={4} md={2}>
          <img className={classes.logo} src="/images/logos/footer_RP.png" alt="Logo Rzeczpospolita Polska"/>
        </Grid>
        <Grid item xs={0} sm={0} md={6} className={classes.wcag_controller}>
					<WcagControl
						changeFontSize={changeFontSize}
						toggleContrast={toggleContrast}
						toggleUnderlineLinks={toggleUnderlineLinks}
						toggleContrastHandler={props.toggleContrast}
						toggleUnderlineLinksHandler={props.toggleUnderline}
						is_underline={props.is_underline}
						is_contrast={props.is_contrast}
					/>
        </Grid>
        <Grid item xs={4} sm={4} md={2} className={classes.alignRight}>
          <img className={classes.logo} src="/images/logos/footer_UE.png" alt="Logo Unia Europejska Europejski Fundusz Społeczny" />
        </Grid>
				<Grid xs={12} className={classes.wcag_controller_bottom}>
					<WcagControl
						changeFontSize={changeFontSize}
						toggleContrast={toggleContrast}
						toggleUnderlineLinks={toggleUnderlineLinks}
						toggleContrastHandler={props.toggleContrast}
						toggleUnderlineLinksHandler={props.toggleUnderline}
						is_underline={props.is_underline}
						is_contrast={props.is_contrast}
					/>
				</Grid>
				<Grid item xs={12}>
					<Grid container justify="center">
						<Typography variant={"h1"} className={classes.site_title}>
							System wspomagający monitoring projektu umożliwiającego podjęcie lub powrót do pracy
						</Typography>
					</Grid>					
				</Grid>
        <main className={classes.content}>{children}</main>
        <Grid container spacing={3} className={classes.footer}>
					<Grid item xs={12}>
						<a href="https://pfron.nfinity.pl/deklaracja.html" target="_blank" className={classes.declaration} title="Deklaracja dostępności - Strona zostanie otwarta w nowym oknie przeglądarki">Deklaracja dostępności</a>
					</Grid>
          <Grid item md={2} sm={4} xs={4}>
            <img className={classes.logo} src="/images/logos/footer_pfron.png" alt="Logo Państwowy Fundusz Rehabilitacji Osób Niepełnosprawnych" />
          </Grid>
          <Grid item md={2} sm={4} xs={4}>
            <img className={classes.logo} src="/images/logos/footer_zus.png" alt="Logo Zakład Ubezpieczeń Społecznych" />
          </Grid>
          <Grid item md={2} sm={4} xs={4}>
            <img className={classes.logo} src="/images/logos/footer_ciop.png" alt="Logo Centralny Instytut Ochrony Pracy" />
          </Grid>
          <Grid item xs={12}>
            <span>
              System informatyczny prowadzony jest w ramach Projektu: "Wypracowanie i pilotażowe wdrożenie modelu kompleksowej rehabilitacji umożliwiającej podjęcje lub powrót do pracy" nr: POWR.02.06.00.00-00-0057/17 realizowanego przez Państwowy Fundusz Rehabilitacji Osób Niepełnosprawnych we współpracy z Zakładem Ubezpieczeń Społecznych oraz Centralnym Instytutem Ochrony Pracy - Państwowym Instytutem Badawczym. Projekt finansowany jest przez Unię Europejską w ramach Europejskiego Funduszu Spolecznego i przez Budźet Państwa.
            </span>
          </Grid>
        </Grid>
      </Grid>
    </div>
		)}
    </SiteInfoContextConsumer>
  );
};

Minimal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Minimal;
