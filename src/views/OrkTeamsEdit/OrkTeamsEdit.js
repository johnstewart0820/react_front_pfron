import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, TextField, CircularProgress, FormControl, RadioGroup, FormControlLabel, Radio, Typography, Chip
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Autocomplete } from '@material-ui/lab';
import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import DeleteIcon from '@material-ui/icons/Delete';
import ork_team from '../../apis/ork-team';
import clsx from 'clsx';
import { DeleteModal } from '../OrkTeams/components';
import storage from 'utils/storage';

const OrkTeamsEdit = props => {
	const { history } = props;
	const classes = useStyles();

	const id = props.match.params.id;
	const breadcrumbs = [{ active: true, label: 'Uczestnicy', href: '/ork_teams' }, { active: true, label: 'Zespół ORK', href: '/ork_teams' }, { active: false, label: 'Edytuj osobę' }];
	const [name, setName] = useState('');
	const [rehabitationCenter, setRehabitationCenter] = useState([]);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [specialization, setSpecialization] = useState([]);
	const [specializationList, setSpecializationList] = useState([]);
	const [is_accepted, setIsAccepted] = useState('false');
	const [date_of_acceptance, setDateOfAcceptance] = useState(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate()));
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		ork_team.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRehabitationCenterList(response.data.rehabitation_centers);
					setSpecializationList(response.data.specializations);
				}
			})
	}, []);

	useEffect(() => {
		ork_team.get(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setName(response.data.ork_team.name);
					setIsAccepted(response.data.ork_team.is_accepted === 1 ? 'true' : 'false');
					setDateOfAcceptance(response.data.ork_team.date_of_acceptance);
					let list = response.data.ork_team.rehabitation_center.split(',');
					let rehabitation_list = [];
					rehabitationCenterList.map((item, index) => {
						for (let i = 0; i < list.length; i++) {
							if (parseInt(list[i]) === parseInt(item.id)) {
								rehabitation_list.push(item);
							}
						}
					})
					setRehabitationCenter(rehabitation_list);

					let a_list = response.data.ork_team.specialization.split(',');
					let specialization_list = [];
					specializationList.map((item, index) => {
						for (let i = 0; i < a_list.length; i++) {
							if (parseInt(a_list[i]) === parseInt(item.id)) {
								specialization_list.push(item);
							}
						}
					})
					setSpecialization(specialization_list);
				}
			})
	}, [specializationList]);

	const handleError = () => {
		let _error = {}
		_error.name = (name.length === 0);
		_error.rehabitationCenter = (rehabitationCenter.length === 0);
		_error.specialization = (specialization.length === 0);
		setError(_error);
	};

	const handleChangeName = (value) => {
		setName(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.name = (value.length === 0);
		setError(_error);
	}

	const handleChangeRehabitationCenter = (value) => {
		setRehabitationCenter(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.rehabitationCenter = (value.length === 0);
		setError(_error);
	}

	const handleChangeSpecialization = (value) => {
		setSpecialization(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.specialization = (value.length === 0);
		setError(_error);
	}

	const checkError = () => {
		return name.length === 0 || rehabitationCenter.length === 0 || specialization.length === 0;
	}

	const handleBack = () => {
		history.push('/ork_teams');
	}

	const handleSave = () => {


		if (checkError()) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
			handleError();
		} else {
			setProgressStatus(true);
			let specialization_arr = [];
			let rehabitation_arr = [];
			specialization.map((item, index) => {
				specialization_arr.push(item.id);
			})
			rehabitationCenter.map((item, index) => {
				rehabitation_arr.push(item.id);
			})

			ork_team.update(name, rehabitation_arr, specialization_arr, is_accepted === "true" ? true : false, date_of_acceptance, id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						if (response.code === 200) {
							setTimeout(function () { history.push('/ork_teams'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	const handleDelete = () => {

		setProgressStatus(true);
		ork_team
			.delete(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setHasAlert(true);
					setMessage(response.message);
					setIsSuccess(response.code === 200);
					if (response.code === 200) {
						setTimeout(function () { history.push('/ork_teams'); }, 1000);
					}
					setProgressStatus(false);
				}
			})

	}

	const handleChangeDate = (value) => {
		let _date = new Date(value);
		setDateOfAcceptance(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
	}

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" id="main" className={classes.btnBack} onClick={handleBack}>          Wróć do listy osób w zespołach
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
									<div className={classes.top_label}><label htmlFor="name">Tytuł, imię i nazwisko osoby w zespole</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.name })} type="name" value={name} id="name" name="name" onChange={(e) => handleChangeName(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="RehabitationCenter">Wybierz ORK</label></div>
									<Autocomplete
										multiple
										id="RehabitationCenter"
										value={rehabitationCenter}
										className={classes.name_select_box}
										onChange={(event, value) => handleChangeRehabitationCenter(value ? value : [])}
										options={rehabitationCenterList}
										getOptionLabel={(option) => rehabitationCenterList && option && option.name}
										renderTags={(value, getTagProps) =>
											value.map((option, index) => (
												<Chip variant="outlined" label={option.name} {...getTagProps({ index })} deleteIcon={<CloseIcon aria-label="Wyczyść wartość"/>}/>
											))
										}
										renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} error={error.rehabitationCenter} />}
									/>
									<div className={classes.input_box_label}><label htmlFor="specialization">Specjalizacja</label></div>
									<Autocomplete
										multiple
										id="specialization"
										value={specialization}
										className={classes.name_select_box}
										onChange={(event, value) => handleChangeSpecialization(value ? value : [])}
										options={specializationList}
										getOptionLabel={(option) => specializationList && option && option.name + (option.module_type ? (' (' + option.module_type + ')') : '')}
										renderTags={(value, getTagProps) =>
											value.map((option, index) => (
												<Chip variant="outlined" label={option.name + (option.module_type ? (' (' + option.module_type + ')') : '')} {...getTagProps({ index })} deleteIcon={<CloseIcon aria-label="Wyczyść wartość"/>}/>
											))
										}
										renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} error={error.specialization} />}
									/>
									{storage.getStorage('role').includes('1') ?
										<>
											<div className={classes.input_box_label}>Zaakceptowany</div>
											<FormControl component="fieldset">
												<RadioGroup aria-label="is_accepted" name="is_accepted" value={is_accepted === 1 || is_accepted === 'true' ? 'true' : 'false'} onChange={(e) => setIsAccepted(e.target.value)} row>
													<FormControlLabel value="true" control={<Radio />} label="TAK" />
													<FormControlLabel value="false" control={<Radio />} label="NIE" />
												</RadioGroup>
											</FormControl>
											{is_accepted === 'true' || is_accepted === true ?
												<>
													<div className={classes.input_box_label}><label htmlFor="date">Data akceptacji</label></div>
													<KeyboardDatePicker
														disableToolbar
														id="date"
														variant="inline"
														format="dd.MM.yyyy"
														aria-label="Data akceptacji - Format wprowadzania daty DD.MM.RRRR"
														margin="normal"
														value={date_of_acceptance}
														onChange={(e) => handleChangeDate(e)}
														KeyboardButtonProps={{
															'aria-label': 'Zmień datę',
														}}
													/>
												</>
												:
												<></>
											}
										</>
										:
										<></>
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
									<Button variant="outlined" color="secondary" className={classes.btnDelete} onClick={() => setOpenModal(true)} aria-label="usuń">
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
			<DeleteModal
				openModal={openModal}
				handleClose={handleCloseModal}
				handleDelete={handleDelete}
				selectedIndex={id}
			/>
		</MuiPickersUtilsProvider>
	);
};

export default OrkTeamsEdit;
