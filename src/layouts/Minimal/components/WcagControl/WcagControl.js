import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Grid, Button,} from '@material-ui/core';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faFont, faLink, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
	root: {
		boxShadow: 'none'
	},
	helper: {
		color: theme.palette.text.primary,
		fontSize: '8px',
		margin: theme.spacing(0, 2.5),
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer'
	},
}));

const WcagControl = props => {
	const { className, is_contrast, is_underline, changeFontSize, toggleContrast, toggleUnderlineLinks, toggleContrastHandler, toggleUnderlineLinksHandler } = props;

	const classes = useStyles();

	return (
		<Grid container justify='center'>
			<Grid item>
				<Button title="Wczytaj domyślny rozmiar tekstu" onClick={(e) => changeFontSize('normal')}>
					<div className={classes.helper} name="normal">
						<FontAwesomeIcon icon={faFont} size="2x" />
					</div>
				</Button>
			</Grid>
			<Grid item>
				<Button title="Pomniejsz tekst na stronie" onClick={(e) => changeFontSize('less')}>
					<div className={classes.helper} name="minus">
						<FontAwesomeIcon icon={faFont} size="2x" />
						<FontAwesomeIcon icon={faMinus} size="1x" />
					</div>
				</Button>
			</Grid>
			<Grid item>
				<Button title="Powiększ tekst na stronie" onClick={(e) => changeFontSize('more')}>
					<div className={classes.helper} name="plus">
						<FontAwesomeIcon icon={faFont} size="2x" />
						<FontAwesomeIcon icon={faPlus} size="1x" />
					</div>
				</Button>
			</Grid>
			<Grid item>
				<Button title={is_contrast ? "Wyłącz tryb wysokokontrastowy" : "Włącz tryb wysokokontrastowy"} onClick={(e) => toggleContrast(e, toggleContrastHandler)}>
					<div className={classes.helper}>
						<FontAwesomeIcon icon={faEye} size="2x" />
					</div>
				</Button>
			</Grid>
			<Grid item>
				<Button title={is_underline ? "Wyłącz podkreślenie linków" : "Włącz podkreślenie linków"} onClick={(e) => toggleUnderlineLinks(e, toggleUnderlineLinksHandler)}>
					<div className={classes.helper}>
						<FontAwesomeIcon icon={faLink} size="2x" />
					</div>
				</Button>
			</Grid>
		</Grid>
	);
};

WcagControl.propTypes = {
	className: PropTypes.string
};

export default WcagControl;
