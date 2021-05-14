import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, TextField, CircularProgress, Typography, FormControl, FormControlLabel, Checkbox
} from '@material-ui/core';

import { Breadcrumb, SingleSelect } from 'components';
import DeleteIcon from '@material-ui/icons/Delete';
import payment from '../../apis/payment';

const PaymentsEdit = props => {
	const { children } = props;
	const id = props.match.params.id;
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Finanse', href: '/payments' }, { active: true, label: 'Zdefiniowane koszty usług', href: '/payments' }, { active: false, label: 'Edytuj koszt' }];
	const [value, setValue] = useState('');
	const [rehabitationCenter, setRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [service, setService] = useState(0);
	const [serviceList, setServiceList] = useState([]);
	const [pricelist_amount, setPricelistAmount] = useState('');
	const [pricelist_cost, setPricelistCost] = useState('');
	const [is_flatrate_service, setIsFlatRateService] = useState(false);
	const [quater_list, setQuaterList] = useState([]);
	const [value_list, setValueList] = useState([]);
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

	useEffect(() => {
		payment.get(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setValue(response.data.payment.value);
					setRehabitationCenter(response.data.payment.rehabitation_center);
					setQuaterListInit(response.data.payment.rehabitation_center);
					setService(response.data.payment.service);
					setPricelistAmount(response.data.payment.pricelist_amount);
					setPricelistCost(response.data.payment.pricelist_cost);
					setIsFlatRateService(response.data.payment.is_flatrate_service === 1);
					let _value_list = response.data.flat_rate.map((item, index) => ({ quater: item.quater_id.toString(), value: item.price }));
					setValueList(_value_list);
				}
			})
	}, [serviceList]);

	const setQuaterListInit = (value) => {
		payment.getQuaterList(value)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					let _quater_list = response.data.quater_list;
					for (let i = 0; i < _quater_list.length; i++) {
						_quater_list[i].name = `Kwartał ${i + 1} (${getPolishDate(_quater_list[i].start_date)}-${getPolishDate(_quater_list[i].end_date)})`
					}
					setQuaterList(response.data.quater_list);
				}
			})
	}

	const handleChangeRehabitationCenter = (value) => {
		setRehabitationCenter(value);
		payment.getQuaterList(value)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setValueList([]);
					let _quater_list = response.data.quater_list;
					for (let i = 0; i < _quater_list.length; i++) {
						_quater_list[i].name = `Kwartał ${i + 1} (${getPolishDate(_quater_list[i].start_date)}-${getPolishDate(_quater_list[i].end_date)})`
					}
					setQuaterList(response.data.quater_list);
				}
			})
	}

	const getPolishDate = (value) => {
		return `${value.split('-')[2]}.${value.split('-')[1]}.${value.split('-')[0]}`;
	}
	const handleBack = () => {
		history.push('/payments');
	}

	const handleSave = () => {
		if (isNaN(value) || parseInt(rehabitationCenter) === 0 || parseInt(service) === 0 || isNaN(pricelist_amount) || isNaN(pricelist_cost)) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
		} else {
			setProgressStatus(true);

			payment.update(value, rehabitationCenter, service, pricelist_amount, pricelist_cost, is_flatrate_service, value_list, id)
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

	const handleChangeValueList = (index, type, value) => {
		let _value_list = JSON.parse(JSON.stringify(value_list));
		if (type === 'quater') {
			_value_list[index].quater = value;
		} else {
			_value_list[index].value = value;
		}
		setValueList(_value_list);
	}

	const handleDelete = (index) => {
		let _value_list = JSON.parse(JSON.stringify(value_list));
		_value_list.splice(index, 1);
		setValueList(_value_list);
	}

	const handleAdd = () => {
		let _value_list = JSON.parse(JSON.stringify(value_list));
		_value_list.push({ quater: 0, value: '' });
		setValueList(_value_list);
	}

	const getRemainList = (index) => {
		let _remain_list = JSON.parse(JSON.stringify(quater_list));
		let result = _remain_list;
		let _value_list = JSON.parse(JSON.stringify(value_list));
		for (let i = 0; i < _remain_list.length; i++) {
			for (let j = 0; j < _value_list.length; j++) {
				if (Number(_remain_list[i].id) === Number(_value_list[j].quater) && j !== index)
					result.splice(i, 1);
			}
		}
		return result;
	}

	const handleDeletePayment = () => {

		setProgressStatus(true);
		payment
			.delete(id)
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
									<SingleSelect value={rehabitationCenter} handleChange={handleChangeRehabitationCenter} list={rehabitationCenterList} id="type" />
									<div className={classes.input_box_label}><label htmlFor="value">Cena jednostkowa</label></div>
									<input className={classes.input_box} type="name" id="value" value={value} name="name" onChange={(e) => setValue(e.target.value)} />
									<Grid container spacing={2}>
										<Grid item md={6} xs={12}>
											<div className={classes.input_box_label}><label htmlFor="amount">Liczba jednostek wg. cennika</label></div>
											<input className={classes.input_box} type="name" id="amount" value={pricelist_amount} name="name" onChange={(e) => setPricelistAmount(e.target.value)} />
										</Grid>
										<Grid item md={6} xs={12}>
											<div className={classes.input_box_label}><label htmlFor="cost">Wartość usługi wg. cennika</label></div>
											<input className={classes.input_box} type="name" id="cost" value={pricelist_cost} name="name" onChange={(e) => setPricelistCost(e.target.value)} />
										</Grid>
									</Grid>
									<FormControl component="fieldset">
										<FormControlLabel
											className={classes.rememberMe}
											checked={is_flatrate_service}
											control={
												<Checkbox
													onChange={handleChangeisFlatrateService}
												/>
											}
											label='Usługa ryczałtowa'
										/>
									</FormControl>
									{is_flatrate_service &&
										<>
											{
												value_list.map((item, index) => (
													<Grid container spacing={2} style={{ alignItems: 'center' }}>
														<Grid item xs={1} style={{ marginTop: '30px' }}>
															{index + 1}.
														</Grid>
														<Grid item md={4} xs={11}>
															<div className={classes.input_box_label}><label htmlFor={`kwartał ${index + 1}`}>Wybierz kwartał</label></div>
															<SingleSelect value={item.quater} handleChange={(value) => handleChangeValueList(index, 'quater', value)} list={getRemainList(index)} id={`kwartał ${index + 1}`} />
														</Grid>
														<Grid item md={5} xs={10}>
															<div className={classes.input_box_label}><label htmlFor={`value ${index + 1}`}>Liczba wykonanych jednostek</label></div>
															<input className={classes.input_box} id={`value ${index + 1}`} value={item.value} onChange={(e) => handleChangeValueList(index, 'value', e.target.value)} />
														</Grid>
														<Grid item md={2} xs={2}>
															<DeleteIcon aria-label={`usuń kwartał ${index + 1}`} onClick={() => handleDelete(index)} style={{ marginTop: '30px' }} />
														</Grid>
													</Grid>
												))
											}
											<Grid container spacing={2} justify="flex-end" style={{ marginTop: '10px' }}>
												<Grid item xs={12} md={6}>
													<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleAdd}>
														Dodaj kolejny kwartał
												</Button>
												</Grid>
											</Grid>
										</>
									}
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item md={3} xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
										Zapisz
                </Button>
								</Grid>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnDelete} onClick={handleDeletePayment} aria-label="usuń">
										<DeleteIcon />
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

export default PaymentsEdit;
