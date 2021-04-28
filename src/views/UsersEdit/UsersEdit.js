import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, TextField, CircularProgress, FormControlLabel, Checkbox, Typography, Chip
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import users from '../../apis/users';
import { Autocomplete } from '@material-ui/lab';
const UsersEdit = props => {
	const { children } = props;
	const { history } = props;
	const id = props.match.params.id;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, href: '/users', label: 'Ustawienia systemowe' }, { active: true, href: '/users', label: 'Użytkownicy systemu' }, { active: false, label: 'Edytowanie użytkownika' }];
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState([]);
	const [roleList, setRoleList] = useState([]);
	const [activateStatus, setActivateStatus] = useState(false);
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [qualification_point, setQualificationPoint] = useState([]);
	const [qualificationPointList, setQualificationPointList] = useState([]);
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

	useEffect(() => {
		users.get(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setName(response.data.user.name);
					setEmail(response.data.user.email);
					setQualificationPoint(response.data.qualification_point)
					setActivateStatus(response.data.user.activate_status === '1' ? true : false);
					let id_role_arr = response.data.user.id_role.split(',');
					let role_arr = [];
					if (roleList.length > 0 && id_role_arr.length > 0) {
						for (let i = 0; i < id_role_arr.length; i++) {
							role_arr.push(roleList[parseInt(id_role_arr[i]) - 1]);
						}
					}

					setRole(role_arr);
				}
			})
	}, [roleList]);

	useEffect(() => {
		if (role.length != 0 && !role.some(e => e.id === 3)) {
			setQualificationPoint([]);
		}
	}, [role]);

	const handleBack = () => {
		history.push('/users');
	}

	const handleSave = () => {

		if (name.length === 0 || email.length === 0 || parseInt(role) === 0) {
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

			users.update(name, email, role_arr, qualification_point_arr, activateStatus, id)
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

	const handleDelete = () => {

		setProgressStatus(true);
		users
			.delete(id)
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
									<input className={classes.input_box} type="name" id="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="email">E-mail</label></div>
									<input className={classes.input_box} type="name" id="email" value={email} name="name" onChange={(e) => setEmail(e.target.value)} />
									<div className={classes.input_box_label} htmlFor="type"><label htmlFor="role">Rola</label></div>
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
										renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />
									}
									/>
									{
										role.length != 0 && role.some(e => e.id === 3) ?
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
												checked={activateStatus}
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
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
										Zapisz
                </Button>
								</Grid>
								<Grid item xs={6}>
									<Button aria-label="Usuń" variant="outlined" color="secondary" className={classes.btnDelete} onClick={handleDelete}>
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

export default UsersEdit;
