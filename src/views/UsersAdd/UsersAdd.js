import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, TextField, CircularProgress, FormControlLabel, Checkbox, Typography, Chip
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import users from '../../apis/users';
import { Autocomplete } from '@material-ui/lab';

const UsersAdd = props => {
	const { children } = props;
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, href: '/users', label: 'Ustawienia systemowe' }, { active: true, href: '/users', label: 'Użytkownicy systemu' }, { active: false, label: 'Dodawanie użytkownika' }];
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState([]);
	const [roleList, setRoleList] = useState([]);
	const [qualification_point, setQualificationPoint] = useState([]);
	const [qualificationPointList, setQualificationPointList] = useState([]);
	const [activateStatus, setActivateStatus] = useState(false);
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);

	useEffect(() => {
		users.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRoleList(response.data.role);
					setQualificationPointList(response.data.qualification_point);
				}
			})
	}, []);

	const handleBack = () => {
		history.push('/users');
	}

	const handleSave = () => {
		if (name.length === 0 || email.length === 0 || role.length === 0) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
		} else {
			setProgressStatus(true);
			let role_arr = [];
			role.map((item, index) => {
				role_arr.push(item.id);
			})

			let qualification_point_arr = qualification_point.map((item, index) => { return item.id });

			users.create(name, email, role_arr, qualification_point_arr, activateStatus)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						if (response.code === 200) {
							setTimeout(function () { history.push('/users'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	useEffect(() => {
		if (!role.some(e => e.id === 3)) {
			setQualificationPoint([]);
		}
	}, [role]);

	return (
		<>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" id="main" className={classes.btnBack} onClick={handleBack}>						Wróć do listy użytkowników
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
										Użytkownik
									</Typography>
								</Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.top_label}><label htmlFor="name">Nazwa użytkownika</label></div>
									<input className={classes.input_box} id="name" type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
									<div className={classes.input_box_label} htmlFor="type"><label htmlFor="email">E-mail</label></div>
									<input className={classes.input_box} type="name" value={email} id="email" name="name" onChange={(e) => setEmail(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="role">Rola</label></div>
									<Autocomplete
										multiple
										id="role"
										className={classes.name_select_box}
										onChange={(event, value) => setRole(value ? value : [])}
										value={role}
										options={roleList}
										getOptionLabel={(option) => roleList && option && option.name}
										renderTags={(value, getTagProps) =>
											value.map((option, index) => (
												<Chip variant="outlined" label={option.name} {...getTagProps({ index })} deleteIcon={<CloseIcon aria-label="Wyczyść wartość"/>}/>
											))
										}
										renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
									/>
									{
										role.some(e => e.id === 3) ?
											<>
												<div className={classes.input_box_label}><label htmlFor="role">Punkt kwalifikacyjny</label></div>
												<Autocomplete
													multiple
													id="qualification_point"
													className={classes.name_select_box}
													onChange={(event, value) => setQualificationPoint(value ? value : [])}
													value={qualification_point}
													options={qualificationPointList}
													getOptionLabel={(option) => roleList && option && option.name}
													renderTags={(value, getTagProps) =>
														value.map((option, index) => (
															<Chip variant="outlined" label={option.name} {...getTagProps({ index })} deleteIcon={<CloseIcon aria-label="Wyczyść wartość"/>}/>
														))
													}
													renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
												/>
											</>
											:
											<></>
									}

									<FormControlLabel
										className={classes.rememberMe}
										control={
											<Checkbox
												onChange={() => setActivateStatus(!activateStatus)}
											/>
										}
										label="Aktywny"
									/>
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

export default UsersAdd;
