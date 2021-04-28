import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, TextField, CircularProgress, Typography
} from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import ipr from '../../apis/ipr';
import clsx from 'clsx';

import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import { useLocation } from "react-router-dom";

const IprAdd = props => {
	const location = useLocation();
	const { history } = props;
	const classes = useStyles();
	const searchKey = location.state ? location.state.searchKey : null;
	const breadcrumbs = [{ active: true, label: 'Uczestnicy', href: '/participants' }, { active: true, label: 'Lista IPR', href: '/ipr_list' }, { active: false, label: 'Dodaj IPR' }];
	const [participant_number, setParticipantNumber] = useState('');
	const [participant_name, setParticipantName] = useState('');
	const [participant, setParticipant] = useState(0);
	const [participantList, setParticipantList] = useState([]);
	const [ipr_type, setIprType] = useState(0);
	const [iprTypeList, setIprTypeList] = useState([]);
	const [number, setNumber] = useState(0);
	const [schedule_date, setScheduleDate] = useState(new Date());
	const [ork_person, setOrkPerson] = useState(null);
	const [orkPersonList, setOrkPersonList] = useState([]);
	const [profession, setProfession] = useState('');
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});

	useEffect(() => {
		ipr.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setIprTypeList(response.data.ipr_type);
					setParticipantList(response.data.participant);
				}
			})
	}, []);

	useEffect(() => {
		ipr.getOrkPerson(participant)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setNumber(response.data.count);
					setOrkPersonList(response.data.ork_person);
				}
			})
	}, [participant])

	useEffect(() => {
		if (searchKey) {
			let participant_obj = {};
			participantList.map((item, index) => {
				if (item.participant_number === searchKey)
					participant_obj = item;
			})
			setParticipantNumber(participant_obj);
			setParticipantName(participant_obj);
			setParticipant(participant_obj.id);
		}
	}, [participantList]);

	const handleError = () => {
		let _error = {}
		_error.participant = (parseInt(participant) === 0);
		_error.ipr_type = (parseInt(ipr_type) === 0);
		_error.ork_person = (parseInt(ork_person) === 0);
		_error.profession = (profession.length === 0);
		setError(_error);
	};

	const handleChangeParticipantNumber = (value) => {
		setParticipantNumber(value);
		setParticipantName(value);
		setParticipant(value ? value.id : 0);
	}

	const handleChangeParticipantName = (value) => {
		setParticipantNumber(value);
		setParticipantName(value);
		setParticipant(value ? value.id : 0);
	}

	const handleChangeIprType = (value) => {
		setIprType(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.ipr_type = (parseInt(value) === 0);
		setError(_error);
	}

	const handleChangeProfession = (value) => {
		setProfession(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.profession = (parseInt(value) === 0);
		setError(_error);
	}

	const checkError = () => {
		return parseInt(participant) === 0 || parseInt(ipr_type) === 0 || ork_person === null || profession.length === 0;
	}

	const handleBack = () => {
		history.push('/ipr_list');
	}

	const handleSave = () => {

		if (checkError()) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
			handleError();
		} else {
			setProgressStatus(true);
			let _date = schedule_date.getFullYear() + '-' + (schedule_date.getMonth() + 1) + '-' + schedule_date.getDate();
			ipr.create(participant, ipr_type, number + 1, _date, ork_person.id, profession)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						if (response.code === 200) {
							setTimeout(function () { history.push(parseInt(ipr_type) !== 1 ? `/ipr_list/plan/edit/${response.data.id}` : `/ipr_list/balance/edit/${response.data.id}`) }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" id="main" className={classes.btnBack} onClick={handleBack}>						Wróć do listy IPR
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
										Dane IPR
									</Typography>
								</Grid>
								<Grid item md={9} xs={12}>
									<Grid container spacing={3}>
										<Grid item xs={5}>
											<div className={classes.top_label}><label htmlFor="number">Numer uczestnika</label></div>
											<Autocomplete
												className={classes.name_select_box}
												id="number"
												onChange={(event, value) => handleChangeParticipantNumber(value)}
												value={participant_number}
												options={participantList}
												getOptionLabel={(option) => participantList && option && option.participant_number}
												renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
												disabled={searchKey !== null}
											/>
										</Grid>
										<Grid item xs={7}>
											<div className={classes.top_label}><label htmlFor="name">Uczestnik</label></div>
											<Autocomplete
												className={classes.name_select_box}
												id="name"
												onChange={(event, value) => handleChangeParticipantName(value)}
												value={participant_name}
												options={participantList}
												getOptionLabel={(option) => participantList && option && `${option.name} ${option.surname}`}
												renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
												disabled={searchKey !== null}
											/>
										</Grid>
										<Grid item xs={5}>
											<div className={classes.top_label}><label htmlFor="ipr_type">Typ</label></div>
											<SingleSelect value={ipr_type} handleChange={handleChangeIprType} list={iprTypeList} id="ipr_type"/>
										</Grid>
										<Grid item xs={2}>
											<div className={classes.top_label}>Numer</div>
											<div className={classes.number}>{number + 1}</div>
										</Grid>
										<Grid item xs={5}>
											<div className={classes.top_label}><label htmlFor="date">Data wypełnienia</label></div>
											<KeyboardDatePicker
												disableToolbar
												variant="inline"
												format="dd.MM.yyyy"
												aria-label="Data urodzenia - Format wprowadzania daty DD.MM.RRRR"
												margin="normal"
												id="date"
												value={schedule_date}
												onChange={setScheduleDate}
												aria-label="Data wypełnienia"
												KeyboardButtonProps={{
													'aria-label': 'Zmień datę',
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											<div className={classes.top_label}><label htmlFor="ork_person">Specjalista ds. zarządzania rehabilitacją</label></div>
											<Autocomplete
												className={classes.name_select_box}
												id="ork_person"
												onChange={(event, value) => setOrkPerson(value)}
												value={ork_person}
												options={orkPersonList}
												getOptionLabel={(option) => participantList && option && option.name}
												renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
											/>
										</Grid>
										<Grid item xs={12}>
											<div className={classes.top_label}><label htmlFor="profession">Wybrany zawód</label></div>
											<input className={classes.input_box} type="name" value={profession} id="profession" name="name" onChange={(e) => handleChangeProfession(e.target.value)} />
										</Grid>
									</Grid>

									{/* <div className={classes.input_box_label} htmlFor="type">Typ punktu</div>
									<SingleSelect value={type} handleChange={(value) => handleChangeType(value)} list={typeList} error={error.type} />
									<div className={classes.input_box_label} htmlFor="ambassador">Ambasadorzy</div>
									<Autocomplete
										multiple
										className={classes.name_select_box}
										onChange={(event, value) => setAmbassador(value ? value : [])}
										options={ambassadorList}
										getOptionLabel={(option) => ambassadorList && option && option.name}
										renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
									/> */}
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
		</MuiPickersUtilsProvider>
	);
};

export default IprAdd;
