import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
	Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import ipr from '../../apis/ipr';
import clsx from 'clsx';

import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';

const IprAdd = props => {
	const { history } = props;
	const classes = useStyles();
	const { addToast } = useToasts()
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
	}, [participant]);

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
			addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
			handleError();
		} else {
			setProgressStatus(true);
			let _date = schedule_date.getFullYear() + '-' + (schedule_date.getMonth() + 1) + '-' + schedule_date.getDate();
			ipr.create(participant, ipr_type, number + 1, _date, ork_person.id, profession)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
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
					<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
						Wróć do listy IPR
        			</Button>
				</div>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={9}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Dane IPR
              					</Grid>
								<Grid item xs={9}>
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
											/>
										</Grid>
										<Grid item xs={5}>
											<div className={classes.top_label} htmlFor="name">Typ</div>
											<SingleSelect value={ipr_type} handleChange={handleChangeIprType} list={iprTypeList}/>
										</Grid>
										<Grid item xs={2}>
											<div className={classes.top_label} htmlFor="name">Numer</div>
											<div className={classes.number}>{number + 1}</div>
										</Grid>
										<Grid item xs={5}>
											<div className={classes.top_label}><label htmlFor="date">Data wypełnienia</label></div>
											<KeyboardDatePicker
												disableToolbar
												variant="inline"
												format="dd.MM.yyyy"
												margin="normal"
												id="date"
												value={schedule_date}
												onChange={setScheduleDate}
												KeyboardButtonProps={{
													'aria-label': 'change date',
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
											<div className={classes.top_label}><label htmlFor="profession">Wybrany zawod</label></div>
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
					<Grid item xs={3}>
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
