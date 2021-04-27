import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, Checkbox, FormControl, FormControlLabel, CircularProgress, Typography
} from '@material-ui/core';

import { Breadcrumb, SingleSelect } from 'components';
import notification from '../../apis/notification';
import clsx from 'clsx';

const NotificationSetting = props => {
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Usługi', href: '/service_list' }, { active: true, label: 'Powiadomienia', href: '/notifications' }, { active: false, label: 'Ustawienia powiadomień' }];
	const [setting, setSetting] = useState({});
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});

	useEffect(() => {
		notification.get_setting()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setSetting(response.data.setting);
				}
			})
	}, []);


	const handleSave = () => {
		setProgressStatus(true);

		notification.update_setting(setting)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setHasAlert(true);
					setMessage(response.message);
					setIsSuccess(response.code === 200);
					if (response.code === 200) {
						setTimeout(function () { history.push('/notifications'); }, 1000);
					}
					setProgressStatus(false);
				}
			})
	}

	const handleBack = () => {
		history.push('/notifications');
	}

	const handleChange = (e) => {
		let _setting = JSON.parse(JSON.stringify(setting));
		_setting[e.target.name] = e.target.checked;
		setSetting(_setting);
	}

	return (
		<>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" id="main" className={classes.btnBack} onClick={handleBack}>          Wróć do listy powiadomień
        </Button>
				</div>
				<Alert
					hasAlert={hasAlert}
					setHasAlert={setHasAlert}
					isSuccess={isSuccess}
					message={message}
				/>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item md={9} xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<Typography variant="h2" className={classes.form_title}>
										Aktywne powiadomienia
									</Typography>
								</Grid>
								<Grid item md={9} xs={12}>
									<Grid container>
										<FormControlLabel
											control={<Checkbox checked={setting.end_service_date == 1 ? true : false} onChange={handleChange} name="end_service_date" />}
											label="Zakończenie terminu usługi"
										/>
									</Grid>
									<Grid container>
										<FormControlLabel
											control={<Checkbox checked={setting.undone_service_participant == 1 ? true : false} onChange={handleChange} name="undone_service_participant" />}
											label="Niezrealizowanie danej usługi przez uczestnika (uczestnik zrezygnował)"
										/>
									</Grid>
									<Grid container>
										<FormControlLabel
											control={<Checkbox checked={setting.end_stay_participant == 1 ? true : false} onChange={handleChange} name="end_stay_participant" />}
											label="Zakończenie pobytu w ORK (minął termin planowanej daty wyjścia z ORK)"
										/>
									</Grid>
									<Grid container>
										<FormControlLabel
											control={<Checkbox checked={setting.amount_service_participant == 1 ? true : false} onChange={handleChange} name="amount_service_participant" />}
											label="Przekroczenie wymiaru danej usługi"
										/>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item md={3} xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
										Zapisz
                </Button>
								</Grid>
							</Grid>
						</Card>
					</Grid>
				</Grid>
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

export default NotificationSetting;
