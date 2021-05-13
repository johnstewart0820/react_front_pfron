import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, TextField, CircularProgress, Typography, FormControl, FormControlLabel, Checkbox
} from '@material-ui/core';

import { Breadcrumb, SingleSelect } from 'components';
import payment from '../../apis/payment';

const PaymentsAdd = props => {
	const { children } = props;
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Finanse', href: '/payments' }, { active: true, label: 'Zdefiniowane koszty usług', href: '/payments' }, { active: false, label: 'Dodaj koszt' }];
	const [value, setValue] = useState('');
	const [rehabitationCenter, setRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [service, setService] = useState(0);
	const [serviceList, setServiceList] = useState([]);
	const [pricelist_amount, setPricelistAmount] = useState('');
	const [pricelist_cost, setPricelistCost] = useState('');
	const [is_flatrate_service, setIsFlatRateService] = useState(false);
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);

	useEffect(() => {
		payment.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRehabitationCenterList(response.data.rehabitation_center);
					setServiceList(response.data.service);
				}
			})
	}, []);

	const handleBack = () => {
		history.push('/payments');
	}

	const handleSave = () => {


		if (isNaN(value) || parseInt(rehabitationCenter) === 0 || parseInt(service) === 0) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
		} else {
			setProgressStatus(true);

			payment.create(value, rehabitationCenter, service)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						if (response.code === 200) {
							setTimeout(function () { history.push('/payments'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	const handleChangeisFlatrateService = () => {
		setIsFlatRateService(!is_flatrate_service);
	}

	return (
		<>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" id="main" className={classes.btnBack} onClick={handleBack}>          Wróć do listy kosztów
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
										Dane podstawowe
									</Typography>
								</Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.input_box_label}><label htmlFor="service">Wybierz usługę</label></div>
									<SingleSelect value={service} handleChange={setService} list={serviceList} id="service" />
									<div className={classes.input_box_label}><label htmlFor="type">Wybierz ORK</label></div>
									<SingleSelect value={rehabitationCenter} handleChange={setRehabitationCenter} list={rehabitationCenterList} id="type" />
									<div className={classes.input_box_label}><label htmlFor="value">Cena jednostkowa</label></div>
									<input className={classes.input_box} type="name" id="value" value={value} name="name" onChange={(e) => setValue(e.target.value)} />
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<div className={classes.input_box_label}><label htmlFor="amount">Liczba jednostek z cennika</label></div>
											<input className={classes.input_box} type="name" id="amount" value={pricelist_amount} name="name" onChange={(e) => setPricelistAmount(e.target.value)} />
										</Grid>
										<Grid item md={6} xs={12}>
											<div className={classes.input_box_label}><label htmlFor="cost">Wartość usługi z cennika</label></div>
											<input className={classes.input_box} type="name" id="cost" value={pricelist_cost} name="name" onChange={(e) => setPricelistCost(e.target.value)} />
										</Grid>
									</Grid>
									<FormControl component="fieldset">
										<FormControlLabel
											className={classes.rememberMe}
											control={
												<Checkbox
													onChange={handleChangeisFlatrateService}
												/>
											}
											label='Usługa ryczałtowa'
										/>
									</FormControl>
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

export default PaymentsAdd;
