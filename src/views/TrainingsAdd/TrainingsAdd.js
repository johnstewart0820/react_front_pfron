import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
	Button, Grid, Card, TextField, CircularProgress, IconButton, TextareaAutosize
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import training_api from '../../apis/training';
import clsx from 'clsx';
import MaskedInput from 'react-text-mask';
import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { pl } from 'date-fns/locale'
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import AddIcon from '@material-ui/icons/Add';
import EXCEL from 'js-export-xlsx';

const TrainingsAdd = props => {
	const { history } = props;
	const classes = useStyles();
	const { addToast } = useToasts()
	const breadcrumbs = [{ active: true, label: 'Uslugi', href: '/service_list' }, { active: true, label: 'Szkolenia', href: '/trainings' }, { active: false, label: 'Dodaj szkolenie' }];
	const [training, setTraining] = useState({ name: '', number: '', rehabitation_center: 0, service: 0, participant: [{}], comment: '', training_status: 0 });
	const [training_class, setTrainingClass] = useState([{ name: '', date: null, start_hour: '', end_hour: '', break_amount: '', total_hour: '', ork_team: [] }]);
	const [trainingStatusList, setTrainingStatusList] = useState([{ id: 1, name: 'TAK' }, { id: 2, name: 'NIE' }]);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [orkTeamList, setOrkTeamList] = useState([]);
	const [serviceList, setServiceList] = useState([]);
	const [participantList, setParticipantList] = useState([]);
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({ participant: [true] });
	const [error_class, setErrorClass] = useState([{}]);

	useEffect(() => {
		training_api.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setParticipantList(response.data.participant);
					setRehabitationCenterList(response.data.rehabitation_center);
					setServiceList(response.data.service_list);
				}
			})
	}, []);

	const handleError = () => {
		let _error = { participant: [] }
		_error.name = (training.name.length === 0);
		_error.number = (training.number.length === 0);
		_error.rehabitation_center = (parseInt(training.rehabitation_center) === 0);
		_error.service = (parseInt(training.service) === 0);
		for (let i = 0; i < training.participant.length; i++) {
			_error.participant.push(true);
			_error.participant[i] = !(training.participant[i].id > 0);
		}
		_error.comment = (training.comment.length === 0);
		_error.training_status = (parseInt(training.training_status) === 0);
		setError(_error);
		let _error_class = []
		for (let i = 0; i < training_class.length; i++) {
			_error_class.push({});
			_error_class[i].name = (training_class[i].name.length === 0);
			_error_class[i].date = (!training_class[i].date || training_class[i].date.length === 0);
			_error_class[i].start_hour = (training_class[i].start_hour.length === 0);
			_error_class[i].end_hour = (training_class[i].end_hour.length === 0);
			_error_class[i].break_amount = (training_class[i].break_amount.length === 0);
			_error_class[i].total_hour = (training_class[i].total_hour.length === 0);
			_error_class[i].ork_team = (training_class[i].ork_team.length === 0);
		}
		setErrorClass(_error_class);
	};

	const handleChangeName = (value) => {
		let _training = JSON.parse(JSON.stringify(training));
		_training.name = value;
		setTraining(_training);
		let _error = JSON.parse(JSON.stringify(error));
		_error.name = (value.length === 0);
		setError(_error);
	}

	const handleChangeNumber = (value) => {
		let _training = JSON.parse(JSON.stringify(training));
		_training.number = value;
		setTraining(_training);
		let _error = JSON.parse(JSON.stringify(error));
		_error.number = (value.length === 0);
		setError(_error);
	}

	const handleChangeRehabitationCenter = (value) => {
		let _training = JSON.parse(JSON.stringify(training));
		_training.rehabitation_center = value;
		setTraining(_training);
		let _error = JSON.parse(JSON.stringify(error));
		_error.rehabitation_center = (parseInt(value) === 0);
		setError(_error);
		training_api.getOrkTeam(value)
			.then(response => {
				if (response.code === 401) {
				} else {
					setOrkTeamList(response.data.ork_team);
				}
			})
	}

	const handleChangeService = (value) => {
		let _training = JSON.parse(JSON.stringify(training));
		_training.service = value;
		setTraining(_training);
		let _error = JSON.parse(JSON.stringify(error));
		_error.service = (parseInt(value) === 0);
		setError(_error);
	}

	const handleChangeParticipant = (value, index) => {
		let _training = JSON.parse(JSON.stringify(training));
		_training.participant[index] = value;
		setTraining(_training);
		let _error = JSON.parse(JSON.stringify(error));
		_error.participant[index] = !training.participant[index].id > 0;
		setError(_error);
	}

	const handleDeleteParticipant = (index) => {
		let _training = JSON.parse(JSON.stringify(training));
		let _error = JSON.parse(JSON.stringify(error));
		_error.participant.splice(index, 1);
		_training.participant.splice(index, 1);
		setTraining(_training);
		setError(_error);
	}

	const handleCreateParticipant = () => {
		let _training = JSON.parse(JSON.stringify(training));
		let _error = JSON.parse(JSON.stringify(error));
		_training.participant.push({});
		_error.participant.push(true);
		setTraining(_training);
		setError(_error);
	}

	const handleChangeComment = (value) => {
		let _training = JSON.parse(JSON.stringify(training));
		_training.comment = value;
		setTraining(_training);
		let _error = JSON.parse(JSON.stringify(error));
		_error.comment = (value.length === 0);
		setError(_error);
	}

	const handleChangeTrainingStatus = (value) => {
		let _training = JSON.parse(JSON.stringify(training));
		_training.training_status = value;
		setTraining(_training);
		let _error = JSON.parse(JSON.stringify(error));
		_error.training_status = (parseInt(value) === 0);
		setError(_error);
	}

	const handleChangeClassName = (value, index) => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		_training_class[index].name = value;
		setTrainingClass(_training_class);
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_error_class[index].name = (parseInt(value) === 0);
		setErrorClass(_error_class);
	}

	const handleChangeClassDate = (value, index) => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		_training_class[index].date = value;
		setTrainingClass(_training_class);
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_error_class[index].date = (parseInt(value) === 0);
		setErrorClass(_error_class);
	}

	const handleDeleteClass = (index) => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_error_class.splice(index, 1);
		_training_class.splice(index, 1);
		setTrainingClass(_training_class);
		setErrorClass(_error_class);
	}

	const handleCreateClass = () => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_training_class.push({ name: '', date: null, start_hour: '', end_hour: '', break_amount: '', total_hour: '', ork_team: '' });
		_error_class.push({ name: true, date: true, start_hour: true, end_hour: true, break_amount: true, total_hour: true, ork_team: true });
		setTrainingClass(_training_class);
		setErrorClass(_error_class);
	}

	const handleChangeStartHour = (value, index) => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		_training_class[index].start_hour = value;
		setTrainingClass(_training_class);
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_error_class[index].start_hour = (parseInt(value) === 0);
		setErrorClass(_error_class);
	}

	const handleChangeEndHour = (value, index) => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		_training_class[index].end_hour = value;
		setTrainingClass(_training_class);
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_error_class[index].end_hour = (parseInt(value) === 0);
		setErrorClass(_error_class);
	}

	const handleChangeClassBreakAmount = (value, index) => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		_training_class[index].break_amount = value;
		setTrainingClass(_training_class);
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_error_class[index].break_amount = (parseInt(value) === 0);
		setErrorClass(_error_class);
	}

	const handleChangeClassTotalHour = (value, index) => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		_training_class[index].total_hour = value;
		setTrainingClass(_training_class);
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_error_class[index].total_hour = (parseInt(value) === 0);
		setErrorClass(_error_class);
	}

	const handleChangeOrkTeam = (value, index) => {
		let _training_class = JSON.parse(JSON.stringify(training_class));
		_training_class[index].ork_team = value;
		setTrainingClass(_training_class);
		let _error_class = JSON.parse(JSON.stringify(error_class));
		_error_class[index].ork_team = (parseInt(value) === 0);
		setErrorClass(_error_class);
	}

	const handleExportClass = () => {
		let export_data = [];
		for (let i = 0; i < training_class.length; i++) {
			let item = [];
			item.push(training_class[i].name);
			item.push(training_class[i].date);
			item.push(training_class[i].start_hour);
			item.push(training_class[i].end_hour);
			item.push(training_class[i].break_amount);
			item.push(training_class[i].total_hour);
			export_data.push(item);
		}

		EXCEL.outPut({
			header: ['Nazwa zajec', 'Data zajec', 'Godzina rozpoczecia', 'Godzina zakonczenia', 'Czas przerw(w minutach)', 'Czas trwania(w godzinach)'],
			data: export_data,
			name: 'download'
		})
	}

	const getRemainParticipantNumber = () => {
		let _arr = [];
		participantList.map((item, index) => {
			let count = 0;
			for(let i = 0; i < training.participant.length; i ++) {
				if (parseInt(item.id) === parseInt(training.participant[i].id)) {
					count ++;
				}
			}
			if (count === 0) {
				_arr.push(item);
			}
		})
		return _arr;
	}

	const checkError = () => {
		let result = (training.name.length === 0) ||
			(training.number.length === 0) ||
			(parseInt(training.rehabitation_center) === 0) ||
			(parseInt(training.service) === 0) ||
			(training.comment.length === 0) ||
			(parseInt(training.training_status) === 0);
		for (let i = 0; i < training.participant.length; i++) {
			result = result || !training.participant[i].id > 0;
		}
		for (let i = 0; i < training_class.length; i++) {
			result = result || (training_class[i].name.length === 0)
				|| (!training_class[i].date || training_class[i].date.length === 0)
				|| (training_class[i].start_hour.length === 0)
				|| (training_class[i].end_hour.length === 0)
				|| (training_class[i].break_amount.length === 0)
				|| (training_class[i].total_hour.length === 0)
				|| (training_class[i].ork_team.length === 0);
		}
		return result;
	}

	const handleBack = () => {
		history.push('/trainings');
	}

	const handleSave = () => {
		if (checkError()) {
			addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
			handleError();
		} else {
			setProgressStatus(true);
			let participant_arr = [];
			training.participant.map((item, index) => {
				participant_arr.push(item.id);
			})
			let participant_str = participant_arr.join(',');
			for (let i = 0; i < training_class.length; i++) {
				let ork_team_arr = []
				for (let j = 0; j < training_class[i].ork_team.length; j++) {
					ork_team_arr.push(training_class[i].ork_team[j].id);
				}
				training_class[i].ork_team_str = ork_team_arr.join(',');
			}


			training_api.create(training, participant_str, training_class)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
						if (response.code === 200) {
							setTimeout(function () { history.push('/trainings'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	const handleExportParticipants = () => {
		let export_data = [];
		for (let i = 0; i < training.participant.length; i++) {
			let item = [];
			item.push(training.participant[i].id);
			item.push(training.participant[i].name);
			item.push(training.participant[i].participant_number);
			export_data.push(item);
		}

		EXCEL.outPut({
			header: ['ID', 'Nazwisko', 'Numer'],
			data: export_data,
			name: 'download'
		})
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
						Wróć do listy szkolen
        			</Button>
				</div>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={9}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Dane podstawowe
              					</Grid>
								<Grid item xs={9}>
									<div className={classes.top_label}><label htmlFor="name">Nazwa</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.name })} id="name" type="name" value={training.name} name="name" onChange={(e) => handleChangeName(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="number">Numer szkolenia</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.number })} id="number" type="name" value={training.number} name="name" onChange={(e) => handleChangeNumber(e.target.value)} />
									<div className={classes.input_box_label} htmlFor="type">ORK</div>
									<SingleSelect value={training.rehabitation_center} handleChange={(value) => handleChangeRehabitationCenter(value)} list={rehabitationCenterList} error={error.rehabitation_center} />
									<div className={classes.input_box_label} htmlFor="type">Usługa, do ktorej jest przypisane szkolenie</div>
									<SingleSelect value={training.service} handleChange={(value) => handleChangeService(value)} list={serviceList} error={error.service} />
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} />
								<Grid item xs={9}>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
										<div className={classes.top_label}>
											Uczestnicy
										</div>
										<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleExportParticipants}>
											Eksportuj liste do XLS
										</Button>
									</div>
									{
										training.participant.map((item, index) => (
											<Grid container spacing={2}>
												<Grid item xs={1}></Grid>
												<Grid item xs={1} className={classes.input_box_label}><label htmlFor="participant">{index + 1}.</label></Grid>
												<Grid item xs={6}>
													<Autocomplete
														className={classes.name_select_box}
														id="participant"
														onChange={(event, value) => handleChangeParticipant(value ? value : [], index)}
														options={getRemainParticipantNumber()}
														value={ item.name ? item : '' }
														getOptionLabel={(option) => participantList && option && (`${option.name} ${option.surname} (${option.participant_number}) `)}
														renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
													/>
												</Grid>
												{
													index == 0 && training.participant.length === 1 ?
														<Grid item xs={1} />
														:
														<Grid item xs={1}>
															<IconButton variant="outlined" aria-label={`Usuń uczestnika`} component="span" className={classes.iconButton} onClick={() => handleDeleteParticipant(index)}>
																<DeleteOutlineOutlinedIcon className={classes.icon} />
															</IconButton>
														</Grid>
												}
												{
													index == training.participant.length - 1 ?
														<Grid item xs={3}>
															<Button variant="contained" color="secondary" className={classes.btnAdd} onClick={handleCreateParticipant}>
																<AddIcon style={{ marginRight: '20px' }} />
															Dodaj
														</Button>
														</Grid>
														:
														<></>
												}

											</Grid>
										))
									}
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>Harmonogram</Grid>
								<Grid item xs={6}>
									{
										training_class.map((item, index) => (
											<Grid container spacing={2}>
												<Grid item xs={index == 0 && training_class.length === 1 ? 12 : 11}>
													<div className={classes.input_box_label}><label htmlFor="class_name">Nazwa zajec</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error_class[index].name })} id="class_name" type="name" value={item.name} name="name" onChange={(e) => handleChangeClassName(e.target.value, index)} />
												</Grid>
												{
													index == 0 && training_class.length === 1 ?
														<></>
														:
														<Grid item xs={1} style={{ marginTop: '35px' }}>
															<IconButton variant="outlined" aria-label="Usuń zajęcia" component="span" className={classes.iconButton} onClick={() => handleDeleteClass(index)}>
																<DeleteOutlineOutlinedIcon className={classes.icon} />
															</IconButton>
														</Grid>
												}
												<Grid item xs={4}>
													<div className={classes.input_box_label}><label htmlFor="class_date">Data zajec</label></div>
													<KeyboardDatePicker
														disableToolbar
														variant="inline"
														format="dd.MM.yyyy"
														margin="normal"
														id="class_date"
														value={item.date}
														onChange={(value) => handleChangeClassDate(value, index)}
														KeyboardButtonProps={{
															'aria-label': 'change date',
														}}
														className={classes.date_picker}
													/>
												</Grid>
												<Grid item xs={4}>
													<div className={classes.input_box_label}><label htmlFor="start_hour">Godzina rozpoczecia</label></div>
													<MaskedInput
														className={classes.input_box}
														id="start_hour"
														mask={[/\d/, /\d/, ':', /\d/, /\d/]}
														value={training_class[index].start_hour}
														onChange={(e) => handleChangeStartHour(e.target.value, index)}
													/>
												</Grid>
												<Grid item xs={4}>
													<div className={classes.input_box_label}><label htmlFor="end_hour">Godzina zakonczenia</label></div>
													<MaskedInput
														className={classes.input_box}
														id="end_hour"
														mask={[/\d/, /\d/, ':', /\d/, /\d/]}
														value={training_class[index].end_hour}
														onChange={(e) => handleChangeEndHour(e.target.value, index)}
													/>
												</Grid>
												<Grid item xs={6}>
													<div className={classes.input_box_label}><label htmlFor="break_amount">Czas przerw(w minutach)</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error_class[index].break_amount })} id="break_amount" type="name" value={item.break_amount} name="name" onChange={(e) => handleChangeClassBreakAmount(e.target.value, index)} />
												</Grid>
												<Grid item xs={6}>
													<div className={classes.input_box_label}><label htmlFor="total_hour">Czas trwania(w godzinach)</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error_class[index].total_hour })} id="total_hour" type="name" value={item.total_hour} name="name" onChange={(e) => handleChangeClassTotalHour(e.target.value, index)} />
												</Grid>
												<Grid item xs={12}>
													<div className={classes.input_box_label}><label htmlFor="ork_team">Prowadzący</label></div>
													<Autocomplete
														multiple
														id="ork_team"
														className={classes.name_select_box}
														onChange={(event, value) => handleChangeOrkTeam(value ? value : [], index)}
														options={orkTeamList}
														getOptionLabel={(option) => orkTeamList && option && (option.name)}
														renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
													/>
												</Grid>

												{
													index !== training_class.length - 1 ?
														<div className={classes.divide_small} />
														:
														<></>
												}

											</Grid>
										))
									}
								</Grid>
								<Grid item xs={3}>
									<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
										<Button variant="outlined" color="secondary" className={classes.btnExport} onClick={handleExportClass}>
											Eksportuj harmonogram do XLS
										</Button>
									</div>
								</Grid>
							</Grid>
						</Card>
						<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
							<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleCreateClass}>
								Dodaj kolejne zajecia
							</Button>
						</div>
					</Grid>
					<Grid item xs={3}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<div className={classes.top_label}>Zaakceptowane</div>
									<SingleSelect value={training.training_status} handleChange={(value) => handleChangeTrainingStatus(value)} list={trainingStatusList} error={error.training_status} />
									<div className={classes.input_box_label} htmlFor="name"><label htmlFor="comment">Komentarz dotyczący edycji (max 100 znaków)</label></div>
									<TextareaAutosize className={clsx({ [classes.textArea]: true, [classes.error]: error.comment })} id="comment" value={training.comment} rowsMin={10} onChange={(e) => handleChangeComment(e.target.value)} placeholder="Utworzenie profilu uczestnika" />
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

export default TrainingsAdd;
