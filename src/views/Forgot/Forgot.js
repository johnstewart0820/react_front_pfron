import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Button,
	Link,
	CircularProgress,
	Typography
} from '@material-ui/core';
import useStyles from './style';
import { Alert } from 'components';
import auth from '../../apis/auth';
import constants from '../../utils/constants';

const Forgot = props => {
	const { history } = props;

	const classes = useStyles();

	const [input, setInput] = useState({});
	const [error, setError] = useState({});

	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	useEffect(() => {

	}, []);

	const handleChange = event => {
		let arr = JSON.parse(JSON.stringify(input));
		arr[event.target.name] = event.target.value;
		setInput(arr);
	};

	const handleForgot = event => {
		if ((error && (error.email && error.email.length > 0)) || !input.email) {
			setHasAlert(true);
			setMessage(constants.CHECK_ALL_FIELDS);
			setIsSuccess(false);
		} else {
			setProgressStatus(true);
			auth
				.forgot(input.email)
				.then(response => {
					if (response.code === 200) {
						setProgressStatus(false);
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(true);
						setTimeout(function () { history.push('/login') }, 1000);
					} else {
						setProgressStatus(false);
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(false);
					}
				})
		}
	};

	const handleKeyPress = (event) => {
		if (event.charCode === 13) {
			handleForgot();
		}
	}

	useEffect(() => {
		let arr = JSON.parse(JSON.stringify(error));
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		if (input["email"] && !pattern.test(input["email"])) {
			arr["email"] = constants.ENTER_VALID_EMAIL;
		} else {
			arr["email"] = "";
		}

		setError(arr);
	}, [input]);
	return (
		<>
			<div className={classes.root}>
				<div className={classes.mainContainer}>
					<div className={classes.logoContainer}>
						<img src="/images/logos/logo.png" alt="Logo Państwowy Fundusz Rehabilitacji Osób Niepełnosprawnych" />
					</div>
					<div className={classes.loginForm}>
						<Typography className={classes.title} variant={"h2"}>Odzyskaj hasło</Typography>
						<Alert
							hasAlert={hasAlert}
							setHasAlert={setHasAlert}
							isSuccess={isSuccess}
							message={message}
						/>
						<span>Podaj swój adres e-mail, aby odzyskać hasło</span>
						<div>
							<div className={classes.input_box_label}><label htmlFor="email">E-mail</label></div>
							<input className={classes.input_box} aria-label="e-mail" type="email" value={input.email} name="email" id="email" onChange={handleChange} onKeyPress={handleKeyPress} />
							<div className={classes.error_log}>{error["email"] && error["email"].length > 0 && error.email}</div>
						</div>
						<div className={classes.buttonContainer}>
							<Button variant="contained" color="secondary" className={classes.btnForgot} onClick={handleForgot}>
								Wyślij
              </Button>
							<Link to="/login" component={RouterLink} className={classes.btnBack}>
								Wróć do poprzedniej strony
              </Link>
						</div>
					</div>
				</div>
			</div>
			{
				progressStatus ?
					<>
						<div className={classes.progressContainer}>
							<CircularProgress className={classes.progress} />
						</div>
					</>
					:
					<></>
			}
		</>
	);
};

Forgot.propTypes = {
	history: PropTypes.object
};

export default withRouter(Forgot);
