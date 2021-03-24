import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
	Button, Grid, Card, TextField, CircularProgress, FormControlLabel, Checkbox
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import users from '../../apis/users';
import { Autocomplete } from '@material-ui/lab';

const Profile = props => {
	const { children } = props;
	const { history } = props;
	const id = props.match.params.id;
	const classes = useStyles();
	const { addToast } = useToasts()
	const breadcrumbs = [{ active: true, href: '/users', label: 'Użytkownicy systemu' }, { active: false, label: 'Edytuj profil' }];
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [role, setRole] = useState([]);
	const [password, setPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatPassword, setRepeatPassword] = useState('');
	const [roleList, setRoleList] = useState([]);
	const [activateStatus, setActivateStatus] = useState(false);
	const [progressStatus, setProgressStatus] = useState(false);

	useEffect(() => {
		users.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRoleList(response.data.role);
				}
			})
	}, []);

	useEffect(() => {
		users.getProfile()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setName(response.data.user.name);
					setEmail(response.data.user.email);
					setActivateStatus(response.data.user.activate_status === '1' ? true : false);
					let id_role_arr = response.data.user.id_role.split(',');
					let role_arr = [];
					for (let i = 0; i < id_role_arr.length; i++) {
						role_arr.push(roleList[id_role_arr[i] - 1]);
					}
					setRole(role_arr);
				}
			})
	}, [roleList]);

	const handleBack = () => {
		history.push('/users');
	}

	const handleSave = () => {
		if (name.length === 0 || email.length === 0 || role.length === 0) {
			addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
		} else if (password.length > 0 || newPassword.length > 0 || repeatPassword.length > 0) {
			if (password.length === 0 || newPassword.length === 0 || repeatPassword.length === 0 || (newPassword !== repeatPassword)) {
				addToast('Wprowadź poprawne pola hasła.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
			} else {
				if (password.length < 6 || newPassword.length < 6)
					addToast('Wprowadź poprawne pola hasła.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
				else {
					setProgressStatus(true);
					let role_arr = [];
					role.map((item, index) => {
						role_arr.push(item.id);
					})
					users.updateProfile(name, email, role_arr, activateStatus, password, newPassword)
						.then(response => {
							if (response.code === 401) {
								history.push('/login');
							} else {
								addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
								setProgressStatus(false);
							}
						})
				}
			}
		} else {
			setProgressStatus(true);
			users.updateProfile(name, email, role, activateStatus, password, newPassword)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
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
					addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
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
					<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
						Wróć do listy uźytkowników
        </Button>
				</div>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={9}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Uźytkownik
              </Grid>
								<Grid item xs={9}>
									<div className={classes.top_label}><label htmlFor="name">Nazwa użytkownika</label></div>
									<input className={classes.input_box} id="name" type="name" value={name} name="name" onChange={(e) => setName(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="email">E-mail</label></div>
									<input className={classes.input_box} type="name" value={email} name="name" id="email" onChange={(e) => setEmail(e.target.value)} />
									<div className={classes.input_box_label}><label  htmlFor="role">Rola</label></div>
									<Autocomplete
										multiple
										id="role"
										className={classes.name_select_box}
										onChange={(event, value) => setRole(value ? value : [])}
										value={role}
										options={roleList}
										getOptionLabel={(option) => roleList && option && option.name}
										renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
									/>
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
								<div className={classes.divide} />
								<Grid item xs={3} className={classes.form_title}>
									Zmiana hasła
              </Grid>
								<Grid item xs={9}>
									<div className={classes.top_label}><label htmlFor="password">Obecne hasło</label></div>
									<input className={classes.input_box} type="password" id="password" value={password} name="name" onChange={(e) => setPassword(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="new_password">Nowe hasło</label></div>
									<input className={classes.input_box} type="password" id="new_password" value={newPassword} name="name" onChange={(e) => setNewPassword(e.target.value)} />
									<div className={classes.input_box_label}><label htmlFor="repeat_password">Powtórz nowe hasło</label></div>
									<input className={classes.input_box} type="password" id="repeat_password" value={repeatPassword} name="name" onChange={(e) => setRepeatPassword(e.target.value)} />
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
									Zapisz
              </Button>
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

export default Profile;
