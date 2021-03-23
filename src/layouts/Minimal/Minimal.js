import React, { useState, useEffect }  from 'react';
import PropTypes from 'prop-types';
import { SiteInfoContextConsumer } from "App";
import { makeStyles, useTheme } from '@material-ui/styles';
import useStyles from './style';
import {
  Grid, Button, Typography
} from '@material-ui/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFont, faLink, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const Minimal = props => {
  const { children } = props;
  const theme = useTheme();
  const classes = useStyles(theme);
	const [underlineStatus, setUnderlineStatus] = useState(false);
	const [contrastStatus, setContrastStatus] = useState(false);
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

  const toggleUnderlineLinks = e => {
    e.preventDefault();
    document.body.classList.toggle("links-underline");
		setUnderlineStatus(!underlineStatus);
  }

	const toggleContrast = (e, handle) => {
		e.preventDefault(); 
		handle();
		setContrastStatus(!contrastStatus);
	}

  return (
		<SiteInfoContextConsumer>
    { (props) => (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_FE.png" alt="Logo Fundusze Europejskie Wiedza Edukacja Rozwój"/>
        </Grid>
        <Grid item xs={2}>
          <img className={classes.logo} src="/images/logos/footer_RP.png" alt="Logo Rzeczpospolita Polska"/>
        </Grid>
        <Grid item xs={6}>
					<Grid container justify='center'>
						<Grid item xs={8}>
							<Button title="Wczytaj domyślny rozmiar tekstu"	onClick={(e) => changeFontSize('normal')}>
								<div className={classes.helper} name="normal">
										<FontAwesomeIcon icon={faFont} size="2x"/>
								</div>
							</Button>
							<Button title="Pomniejsz tekst na stronie" onClick={(e) => changeFontSize('less')}>
								<div className={classes.helper} name="minus">
										<FontAwesomeIcon icon={faFont} size="2x"/>
										<FontAwesomeIcon icon={faMinus} size="1x"/>
								</div>
							</Button>
							<Button title="Powiększ tekst na stronie" onClick={(e) => changeFontSize('more')}>
								<div className={classes.helper} name="plus">
									<FontAwesomeIcon icon={faFont} size="2x" />
									<FontAwesomeIcon icon={faPlus} size="1x" />
								</div>
							</Button>
							<Button title={!contrastStatus ? "Wyłącz tryb wysokokontrastowy": "Włącz tryb wysokokontrastowy"} onClick={(e) => toggleContrast(e, props.toggleContrast)}>
								<div className={classes.helper}>
										<FontAwesomeIcon icon={faEye} size="2x"/>
								</div>
							</Button>
							<Button title={!underlineStatus ? "Wyłącz podkreślenie linków" : "Włącz podkreślenie linków"}  onClick={(e) => toggleUnderlineLinks(e)}>
								<div className={classes.helper}>
										<FontAwesomeIcon icon={faLink} size="2x"/>
								</div>
							</Button>
						</Grid>
					</Grid>
        </Grid>
        <Grid item xs={2} className={classes.alignRight}>
          <img className={classes.logo} src="/images/logos/footer_UE.png" alt="Logo Unia Europejska Europejski Fundusz Społeczny" />
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
          <Grid item xs={2}>
            <img className={classes.logo} src="/images/logos/footer_pfron.png" alt="Logo Państwowy Fundusz Rehabilitacji Osób Niepełnosprawnych" />
          </Grid>
          <Grid item xs={2}>
            <img className={classes.logo} src="/images/logos/footer_zus.png" alt="Logo Zakład Ubezpieczeń Społecznych" />
          </Grid>
          <Grid item xs={2}>
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
